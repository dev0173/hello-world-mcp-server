import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrompts(server: McpServer) {
  // Register echo prompt using the non-deprecated API
  server.registerPrompt(
    "echo",
    {
      description: "Echoes a message back to the user",
      argsSchema: { message: z.string() },
    },
    ({ message }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please process this message: ${message}`,
          },
        },
      ],
    })
  );
}
