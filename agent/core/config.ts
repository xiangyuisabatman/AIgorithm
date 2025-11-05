import { GlobalConsole } from "./console.ts";

class AlgorithmConFig {
  static get openai() {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      GlobalConsole.error(
        "AI API key 不存在，请执行 bun run init 进行初始化！"
      );
      process.exit(1);
    }
    return OPENAI_API_KEY;
  }
}

export { AlgorithmConFig };
