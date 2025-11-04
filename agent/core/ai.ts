import OpenAI from "openai";
import { AlgorithmConFig } from "./config.ts";

class AiServer {
  // 静态私有变量，存储唯一的 OpenAI 实例
  private static aiInstance: OpenAI;

  // 私有构造函数，确保外部无法直接创建实例
  constructor() {
    // 如果 aiInstance 没有被创建过，就创建它
    if (!AiServer.aiInstance) {
      const key = AlgorithmConFig.openai;
      if (!key) {
        throw new Error("API key is not provided.");
      }
      AiServer.aiInstance = new OpenAI({
        apiKey: key,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      });
    }
  }

  async createCompletion(prompt: string) {
    return await AiServer.aiInstance.chat.completions.create({
      // model: "gpt-3.5-turbo",
      model: "qwen-plus",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      // max_tokens: 100,
      temperature: 0.2,
    });
  }
}

export { AiServer };
