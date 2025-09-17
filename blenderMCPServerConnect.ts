import * as net from "net";
import dotenv from 'dotenv'
import { blenderTools } from './blenderTools.js'

dotenv.config()

export class connectToBlenderMCPServer {
    private PORT : number;
    private HOST : string;
    private client : net.Socket;
    private tools : {};
    
    constructor(){
        this.PORT = Number(process.env.BLENDER_MCP_SERVER_PORT)
        this.HOST = process.env.BLENDER_MCP_SERVER_HOST || ""
        this.client = net.createConnection({ port: this.PORT, host: this.HOST } , () => {
            console.log("Connected to Blender MCP")
        })
        this.tools = blenderTools
    }
    
    async sendQuery(query : {}) {
        try {
            this.client.write(query + "\n");
            this.client.on("data", (data) => {
              console.log("\n"+data.toString());
            });
        } catch (error) {
            console.log("Failed to send query to MCP Server: ", error)
        }
    }

    async getAvaiableTools() {
        return this.tools
    }
}