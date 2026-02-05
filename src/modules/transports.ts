import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { randomUUID } from "crypto";

let transport: StreamableHTTPServerTransport | null = null;

export function setupSSEEndpoint(app: any, server: McpServer) {
  // Initialize transport with stateful mode (generates session IDs)
  transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });

  // Connect the transport to the MCP server
  server.connect(transport).then(() => {
    console.log("Transport connected to MCP server");
  }).catch((error) => {
    console.error("Error connecting transport to MCP server:", error);
  });

  // Handle both GET (SSE) and POST (messages) requests at /mcp endpoint
  app.all("/mcp", async (req: Request, res: Response) => {
    if (!transport) {
      res.status(500).send("Transport not initialized");
      return;
    }

    try {
      console.log(`Handling ${req.method} request to /mcp`);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error(`Error handling request:`, error);
      if (!res.headersSent) {
        res.status(500).send("Internal Server Error");
      }
    }
  });
}
