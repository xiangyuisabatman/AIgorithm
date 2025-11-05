import prompts from "prompts";
import fs from "fs";
import path from "path";
import { AlgorithmSystem } from "./core/index.ts";
import { getProblemFiles } from "./core/utils.ts";
import { getGlobalOra } from "./core/global.ts";
import type { Example, ProblemMeta } from "./core/types.ts";
import { GlobalConsole } from "./core/console.ts";
class AlgorithmCLI {
  system!: AlgorithmSystem;
  constructor() {
    this.showWelcome();
    this.system = new AlgorithmSystem();
    this.showMainMenu();
  }

  private showWelcome() {
    GlobalConsole.info("欢迎使用 AIgorithm");
  }

  private async showMainMenu() {
    const response = await prompts([
      {
        type: "select",
        name: "value",
        message: "请选择功能:",
        choices: [
          { title: "1. 🚀 开始新的练习", value: "1" },
          { title: "2. 📝 提交现有题目解答", value: "2" },
          // { title: "3. 📊 查看学习进度", value: "3" },
          // { title: "4. 🎯 获取推荐题目", value: "4" },
          // { title: "5. 📈 查看学习路径", value: "5" },
          { title: "3. 🔄 重置进度", value: "6" },
          { title: "4. ❌ 退出系统", value: "7" },
        ],
      },
    ]);
    this.handleUserChoice(response.value);
  }

  private handleUserChoice(choice: string) {
    switch (choice) {
      case "1":
        this.startPracticeSession();
        break;
      case "2":
        this.submitExistingSolution();
        break;
      // case "3":
      //   this.showProgress();
      //   break;
      // case "4":
      //   this.showRecommendedProblems();
      //   break;
      // case "5":
      //   this.showLearningPath();
      //   break;
      case "6":
        this.resetProgress();
        break;
      case "7":
        this.exitSystem();
        break;
      default:
        GlobalConsole.error("无效选择，请重新选择");
        this.showMainMenu();
    }
  }

  // 1.开始新的练习
  private async startPracticeSession() {
    const res = await prompts([
      {
        type: "number",
        name: "value",
        message: "请输入要练习的题目数量:",
        initial: 1,
        style: "default",
        min: 1,
        max: 3,
      },
    ]);

    const num = res.value;

    this.system.startPracticeSession(num);
  }
  // 2. 提交现有题目解答
  private async submitExistingSolution() {
    const problemsDir = path.join(process.cwd(), "problems");
    if (!fs.existsSync(problemsDir)) {
      {
        GlobalConsole.error("没有找到题目文件目录/problems");
        this.showMainMenu();
        return;
      }
    }

    const problemFiles = getProblemFiles();
    if (problemFiles.length === 0) {
      GlobalConsole.error("没有找到题目文件");
      this.showMainMenu();
      return;
    }
    const res = await prompts([
      {
        type: "select",
        name: "value",
        message: "请选择要提交的题目:",
        choices: problemFiles.map((file) => ({
          title: file.filename,
          value: file.filePath,
        })),
      },
    ]);

    const problemFile = fs.existsSync(res.value);
    if (!problemFile) {
      GlobalConsole.error("没有找到题目文件");
      this.showMainMenu();
      return;
    }

    const oraInstance = getGlobalOra();
    oraInstance.start("正在加载题目： ");

    // 动态引入题目文件，提取其中导出的 solution 方法
    let solutionFn, examples, problemMeta;
    try {
      const fileModule = await import(res.value);
      if (typeof fileModule.solution !== "function" || !fileModule.solution) {
        oraInstance.fail();
        GlobalConsole.error("未找到解答代码，请确保文件中导出 solution 函数");
        this.showMainMenu();
        return;
      }
      solutionFn = fileModule.solution;
      examples = fileModule.examples;
      problemMeta = fileModule.problemMeta;
      oraInstance.succeed();
      GlobalConsole.success("题目加载成功，已提取 solution 方法");

      const res2 = await prompts([
        {
          type: "confirm",
          name: "value",
          message: "是否使用此代码提交？(y/N):",
          initial: true,
        },
      ]);

      if (!res2.value) {
        GlobalConsole.error("取消提交");
        this.showMainMenu();
      } else {
        this.processExistingSolution(solutionFn, examples, problemMeta);
      }
    } catch (err) {
      oraInstance.fail(`加载题目出错: ${err}`);
      this.showMainMenu();
      return;
    }
  }

  // 2.1 处理现有题目解答
  private async processExistingSolution(
    solutionFn: Function,
    examples: Example[],
    problemMeta: ProblemMeta
  ) {
    // 创建临时会话
    const tempSession = {
      sessionId: `temp_${Date.now()}`,
      problems: [problemMeta],
      startTime: new Date(),
      completed: false,
      score: 0,
    };

    this.system.setCurrentSession(tempSession);

    const testResults = await this.system.submitSolution(
      solutionFn,
      examples,
      problemMeta
    );

    // 检查是否通过
    const passed = testResults.every((result) => result.passed);

    if (passed) {
      GlobalConsole.success("解答验证通过");
    } else {
      GlobalConsole.error("解答验证未通过");
      const failedTestCase = testResults.filter((result) => !result.passed);
      GlobalConsole.info("失败的测试用例:");
      failedTestCase.forEach((test, index) => {
        GlobalConsole.warn("====================================");
        GlobalConsole.error(`失败用例：${JSON.stringify(test.failedTestCase)}`);
        GlobalConsole.info(`   ${index + 1}. ${test.errorMessage}`);
        GlobalConsole.warn("====================================");
      });
    }
    this.system.completeCurrentSession();
  }

  private async resetProgress() {
    const res = await prompts([
      {
        type: "confirm",
        name: "value",
        message:
          "是否确定要重置进度？这将删除所有练习记录和分析报告及所有题目文件(y/N):",
        initial: false,
      },
    ]);

    if (res.value) {
      const oraInstance = getGlobalOra();
      oraInstance.start("正在重置进度...");
      this.system.resetProgress();
      oraInstance.succeed("进度重置成功");
    } else {
      this.showMainMenu();
    }
  }

  // 退出系统
  private exitSystem(): void {
    GlobalConsole.success("感谢使用算法练习系统！");
    GlobalConsole.info("继续加油，算法学习需要持之以恒！");
  }
}

export { AlgorithmCLI };
