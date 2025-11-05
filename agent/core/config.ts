import { GlobalConsole } from "./console.ts";

class AlgorithmConFig {
  static get openai() {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      GlobalConsole.error(
        "API key is missing. Please add it to the .env file."
      );
      process.exit(1);
    }
    return OPENAI_API_KEY;
  }
}

export { AlgorithmConFig };
