import chalk from "chalk";
import { FileGenerator } from "./file-generator";
import { getGlobalOra } from "./global";
import { ProgressTracker } from "./progress-tracker";
import type { Example, PracticeSession, Problem, ProblemMeta } from "./types";
import { mockProblems } from "../../mock";
import { TestValidator } from "./test-validator";

class AlgorithmSystem {
  private progressTracker: ProgressTracker;
  private fileGenerator: FileGenerator;
  private currentSession: PracticeSession | null = null;
  constructor() {
    this.progressTracker = new ProgressTracker();
    this.fileGenerator = new FileGenerator();

    this.progressTracker.loadProgress();
  }

  // 开始练习
  async startPracticeSession(num: number) {
    const problemGenerator = this.progressTracker.problemGenerator;
    const oraInstance = getGlobalOra();
    oraInstance.start("题目生成中...");
    const currentSession = await problemGenerator.generatePracticeSession(num);
    console.log("[ currentSession ] >", currentSession);

    // const problems = (currentSession.choices[0]?.message.content ||
    //   []) as Problem[];

    // console.log("[ problems ] >", problems);
    // oraInstance.succeed("题目生成成功");

    // const problems = mockProblems;
    // for (const problem of problems) {
    //   oraInstance.start("题目文件创建中...");
    //   const filePath = this.fileGenerator.generateProblemFile(
    //     problem as Problem
    //   );
    //   oraInstance.stop();
    //   console.log(chalk.green(`📝 文件已创建: ${filePath}`));
    // }

    // oraInstance.stopAndPersist({
    //   text: "所有题目文件创建成功",
    //   symbol: "🎉",
    // });
  }

  async submitSolution(
    solutionFn: Function,
    examples: Example[],
    problemMeta: ProblemMeta
  ) {
    const oraInstance = getGlobalOra();
    oraInstance.stop();

    oraInstance.start(`🔍 验证题目 ${problemMeta.englishName} 的解答...`);

    const validator = new TestValidator(solutionFn, examples, problemMeta);

    const testResults = await validator.validateSolution();

    oraInstance.stop();

    this.progressTracker.recordProblemCompletion(problemMeta, true);

    oraInstance.start("解题报告文件创建中...");
    const solutionFilePath = await this.fileGenerator.generateSolutionFile(
      solutionFn,
      examples,
      problemMeta,
      testResults
    );
    oraInstance.stop();
    console.log(chalk.green(`📝 文件已创建: ${solutionFilePath}`));
    return testResults;
  }

  completeCurrentSession() {
    if (!this.currentSession) {
      throw new Error("没有活跃的练习会话");
    }

    this.currentSession.endTime = new Date();
    this.currentSession.completed = true;

    const solvedCount = this.currentSession.problems.filter((problem) => {
      return this.progressTracker
        .getUserProgress()
        .completedProblems.includes(problem.englishName);
    }).length;

    this.currentSession.score =
      (solvedCount / this.currentSession.problems.length) * 100;

    this.progressTracker.saveProgress();
  }

  setCurrentSession(currentSession: PracticeSession | null) {
    this.currentSession = currentSession;
  }
}

export { AlgorithmSystem };
