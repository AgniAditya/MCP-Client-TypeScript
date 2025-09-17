import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import readline from "readline/promises";
import dotenv from "dotenv";
import { OpenAI } from "openai/client.js";
dotenv.config();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
}
class MCPClient {
    mcp;
    openai;
    transport = null;
    tools = [];
    constructor() {
        this.openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: OPENROUTER_API_KEY,
        });
        this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
    }
    async connectToServer(serverScriptPath) {
        try {
            const isJs = serverScriptPath.endsWith(".js");
            const isPy = serverScriptPath.endsWith(".py");
            if (!isJs && !isPy) {
                throw new Error("Server script must be a .js or .py file");
            }
            const command = isPy ? process.platform === "win32" ? "python" : "python3"
                : process.execPath;
            this.transport = new StdioClientTransport({
                command,
                args: [serverScriptPath],
            });
            await this.mcp.connect(this.transport);
            const toolsResult = await this.mcp.listTools();
            this.tools = toolsResult.tools.map((tool) => {
                return {
                    name: tool.name,
                    description: tool.description,
                    input_schema: tool.inputSchema,
                };
            });
            console.log("Connected to server with tools:", this.tools.map(({ name }) => name));
        }
        catch (e) {
            console.log("Failed to connect to MCP server: ", e);
            throw e;
        }
    }
    async processQuery(query) {
        const messages = [
            {
                "role": "user",
                "content": query,
            },
        ];
        const response = await this.openai.chat.completions.create({
            model: "deepseek/deepseek-chat-v3.1:free",
            messages: [
                {
                    "role": "user",
                    "content": query
                }
            ],
        });
        return response.choices[0].message;
        // const finalText = [];
        // for (const content of response.output_text) {
        //     if (content.type === "text") {
        //         finalText.push(content.text);
        //     } else if (content.type === "tool_use") {
        //         const toolName = content.name;
        //         const toolArgs = content.input as { [x: string]: unknown } | undefined;
        //         const result = await this.mcp.callTool({
        //             name: toolName,
        //             arguments: toolArgs,
        //         });
        //         finalText.push(
        //             `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
        //         );
        //         messages.push({
        //             role: "user",
        //             content: result.content as string,
        //         });
        //         const response = await this.anthropic.messages.create({
        //             model: "claude-3-5-sonnet-20241022",
        //             max_tokens: 1000,
        //             messages,
        //         });
        //         finalText.push(
        //             response.content[0].type === "text" ? response.content[0].text : ""
        //         );
        //     }
        // }
        // return finalText.join("\n");
    }
    async chatLoop() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        try {
            console.log("\nMCP Client Started!");
            console.log("Type your queries or 'quit' to exit.");
            while (true) {
                const message = await rl.question("\nQuery: ");
                if (message.toLowerCase().trim() === "quit") {
                    break;
                }
                const response = await this.processQuery(message);
                console.log("\n" + response.content);
            }
        }
        finally {
            rl.close();
        }
    }
    async cleanup() {
        await this.mcp.close();
    }
}
async function main() {
    if (process.argv.length < 3) {
        console.log("Usage: node index.ts C:\\Program Files\\Blender Foundation\\Blender 4.4\\blender.exe");
        return;
    }
    const mcpClient = new MCPClient();
    try {
        // await mcpClient.connectToServer(process.argv[2]);
        await mcpClient.chatLoop();
    }
    finally {
        await mcpClient.cleanup();
        process.exit(0);
    }
}
main();
