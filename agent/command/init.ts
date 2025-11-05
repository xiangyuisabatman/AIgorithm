import prompts from "prompts";
import fs from "fs";
import path from "path";
import { GlobalConsole } from "../core/console";

// 第一步：初始化 AI API Key
async function initAIKey() {
  const envPath = path.join(process.cwd(), ".env");
  const response = await prompts({
    type: "text",
    name: "value",
    message: "请输入你使用的AI API Key （将保存在 .env 文件中）:",
  });

  if (!response.value) {
    console.log("初始化被取消。未输入 API Key。");
  }

  const envContent = `\nOPENAI_API_KEY=${response.value}\n`;

  try {
    if (fs.existsSync(envPath)) {
      fs.appendFileSync(envPath, envContent, { encoding: "utf-8" });
    } else {
      fs.writeFileSync(envPath, envContent, { encoding: "utf-8" });
    }
    GlobalConsole.success("AI API Key 初始化成功！");
    return true;
  } catch (err) {
    GlobalConsole.error("AI API Key 初始化失败: " + err);
    return false;
  }
}

const initProject = async () => {
  const step1 = await initAIKey();
  if (step1) {
    GlobalConsole.success(
      `项目初始化配置完成！\n 可以执行 "bun run start" 开始练习了。`
    );
  }
};

initProject();
