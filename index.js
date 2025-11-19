#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname 설정 (ES 모듈용)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Grok API 초기화
const apiKey = process.env.GROK_API_KEY;
if (!apiKey) {
  console.error("Error: GROK_API_KEY environment variable is required");
  process.exit(1);
}

const grok = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.x.ai/v1",
});

// 이미지 다운로드 및 저장 함수
async function downloadAndSaveImage(imageUrl, filename) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const outputDir = path.join(__dirname, "generated_images");

    // 디렉토리가 없으면 생성 (이미 있다고 했지만 안전장치)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, Buffer.from(buffer));

    return filePath;
  } catch (error) {
    console.error(`Error saving image: ${error.message}`);
    throw error;
  }
}

// MCP 서버 생성
const server = new Server(
  {
    name: "grok-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 사용 가능한 도구 목록
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "ask_grok",
        description:
          "Use Grok for search-integrated tasks, brainstorming, and reasoning. Grok has access to real-time web and X/Twitter data. Best for finding latest information, generating ideas, and optimization suggestions.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The question or task for Grok",
            },
            context: {
              type: "string",
              description:
                "Optional: Additional context or code to analyze",
            },
            model: {
              type: "string",
              description:
                "Model to use: 'grok-4' (default, best quality) or 'grok-3' (faster)",
              enum: ["grok-4", "grok-3"],
              default: "grok-4",
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "generate_image",
        description:
          "Generate images using Grok's image generation model. Creates high-quality images based on text descriptions.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Detailed description of the image to generate",
            },
            n: {
              type: "number",
              description: "Number of images to generate (1-4, default: 1)",
              minimum: 1,
              maximum: 4,
              default: 1,
            },
          },
          required: ["prompt"],
        },
      },
    ],
  };
});

// 도구 실행 핸들러
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "ask_grok") {
      const { prompt, context, model = "grok-4" } = args;

      // 모델 선택
      const modelName = model === "grok-3" ? "grok-3-latest" : "grok-4-latest";

      // 프롬프트 구성
      const messages = [
        {
          role: "system",
          content: "You are Grok, a helpful AI assistant with access to real-time information.",
        },
      ];

      if (context) {
        messages.push({
          role: "user",
          content: `Context:\n\`\`\`\n${context}\n\`\`\`\n\nTask: ${prompt}`,
        });
      } else {
        messages.push({
          role: "user",
          content: prompt,
        });
      }

      // Grok API 호출
      const completion = await grok.chat.completions.create({
        model: modelName,
        messages: messages,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;

      return {
        content: [
          {
            type: "text",
            text: `[Grok ${model === "grok-3" ? "3" : "4"}]\n\n${response}`,
          },
        ],
      };
    }

    if (name === "generate_image") {
      const {
        prompt,
        n = 1,
      } = args;

      // Grok 이미지 생성 API 호출
      const imageResponse = await grok.images.generate({
        model: "grok-2-image-1212",
        prompt: prompt,
        n: n,
      });

      // 생성된 이미지 URL들을 수집
      const imageUrls = imageResponse.data.map((img) => img.url);

      // 이미지 다운로드 및 저장
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const savedFiles = [];

      for (let i = 0; i < imageUrls.length; i++) {
        const filename = `grok_${timestamp}_${i + 1}.jpeg`;
        try {
          const filePath = await downloadAndSaveImage(imageUrls[i], filename);
          savedFiles.push({ url: imageUrls[i], path: filePath });
        } catch (error) {
          console.error(`Failed to save image ${i + 1}: ${error.message}`);
          savedFiles.push({ url: imageUrls[i], path: null, error: error.message });
        }
      }

      // 결과 구성
      const content = [
        {
          type: "text",
          text: `[Grok Image Generation]\n\nGenerated ${n} image${n > 1 ? "s" : ""} using grok-2-image-1212\n\nPrompt: ${prompt}\n\nSaved Images:`,
        },
      ];

      // 각 이미지 정보를 텍스트로 추가
      savedFiles.forEach((file, index) => {
        if (file.path) {
          content.push({
            type: "text",
            text: `\n${index + 1}. Saved to: ${file.path}\n   URL: ${file.url}`,
          });
        } else {
          content.push({
            type: "text",
            text: `\n${index + 1}. Failed to save (${file.error})\n   URL: ${file.url}`,
          });
        }
      });

      return {
        content: content,
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error calling Grok: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Grok MCP server running");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
