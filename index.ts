import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import readline from "readline/promises";
import dotenv from "dotenv";
import { OpenAI } from "openai/client.js";
import { connectToBlenderMCPServer } from './blenderMCPServerConnect.js'
import { jsonformat } from "./blenderTools.js";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not set");
}

class MCPClient {
    private mcp: Client;
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: OPENROUTER_API_KEY,
        });
        this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
    }

    async processQuery(query: string) {
        const prefixCommand = "Only generate a JSON format like: "+jsonformat+" and use only avaiable tools in method only if query is related to blender task Query -> "

        const response = await this.openai.chat.completions.create({
            model: "deepseek/deepseek-chat-v3.1:free",
            messages: [
            {
                "role": "user",
                "content": prefixCommand + query
            }
            ],
        });

        return response.choices[0].message.content
    }

    async chatLoop() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const blenderServer = new connectToBlenderMCPServer();
        const blendertools = await blenderServer.getAvaiableTools();
        try {
            console.log("\nMCP Client Started!");
            console.log("Type your queries or 'quit' to exit.");

            while (true) {
                const message = await rl.question("\nQuery: ");
                if (message.toLowerCase().trim() === "quit") {
                    break;
                }
                const instructions = await this.processQuery(message+"\nBlender Tools"+blendertools);
                console.log(JSON.stringify(instructions))
                await blenderServer.sendQuery(JSON.stringify(instructions));
            }
        } finally {
            rl.close();
        }
    }

    async cleanup() {
        await this.mcp.close();
    }
}

async function main() {
    if (process.argv.length < 2) {
        console.log("Usage: node index.ts");
        return;
    }
    const mcpClient = new MCPClient();
    try {
        await mcpClient.chatLoop();
    } finally {
        await mcpClient.cleanup();
        process.exit(0);
    }
}

main();
