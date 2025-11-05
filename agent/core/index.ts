import prompts from "prompts";
import { FileGenerator } from "./file-generator";
import { getGlobalOra } from "./global";
import { ProgressTracker } from "./progress-tracker";
import type { Example, PracticeSession, Problem, ProblemMeta } from "./types";
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

    const currentSession = await problemGenerator.generatePracticeSession(num);

    const problems = currentSession.problems || [];
    // const problems = mockProblems;
    for (const problem of problems) {
      this.fileGenerator.generateProblemFile(problem as Problem);
    }
  }

  // 提交解答
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

    // 是否创建解题报告
    const res = await prompts([
      {
        type: "confirm",
        name: "value",
        message: "是否创建解题报告?（默认不创建）",
        initial: false,
      },
    ]);

    if (res.value) {
      oraInstance.start("解题报告文件创建中...");
      await this.fileGenerator.generateSolutionFile(
        solutionFn,
        examples,
        problemMeta,
        testResults
      );
      oraInstance.stop();
    }

    const passed = testResults.every((result) => result.passed);
    this.progressTracker.recordProblemCompletion(problemMeta, passed);

    return testResults;
  }

  completeCurrentSession() {
    console.log("[ this.currentSession ] >", this.currentSession);
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

  resetProgress() {
    this.progressTracker.resetProgress();
  }
}

export { AlgorithmSystem };
