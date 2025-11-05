import fs from "fs";
import path from "path";
import { ProblemGenerator } from "./problem-generator";
import type { PracticeSession, ProblemMeta, UserProgress } from "./types";
import { GlobalConsole } from "./console";

class ProgressTracker {
  private problem_generator: ProblemGenerator;
  private userProgress: UserProgress;
  private practiceHistory: PracticeSession[];
  constructor() {
    this.userProgress = this.initializeCompletedProgress();
    this.problem_generator = new ProblemGenerator(this.userProgress);
    this.practiceHistory = [];
  }

  private initializeCompletedProgress(): UserProgress {
    return {
      completedProblems: [],
      currentDifficulty: "Easy",
      totalSolved: 0,
      accuracy: 0,
    };
  }

  get problemGenerator(): ProblemGenerator {
    return this.problem_generator;
  }

  recordProblemCompletion(problemMeta: ProblemMeta, passed: boolean) {
    // 记录问题完成情况
    if (
      passed &&
      !this.userProgress.completedProblems.includes(problemMeta.englishName)
    ) {
      this.userProgress.completedProblems.push(problemMeta.englishName);
      this.userProgress.totalSolved++;

      this.updateAccuracyAfterProblemCompletion(passed);

      GlobalConsole.success(
        `题目 ${problemMeta.englishName} 已完成！当前已解决 ${this.userProgress.totalSolved} 道题目`
      );
    }
  }

  private updateAccuracyAfterProblemCompletion(passed: boolean) {
    const totalAttempts = this.userProgress.totalSolved + (passed ? 0 : 1);
    const solvedCount = this.userProgress.totalSolved;
    this.userProgress.accuracy = solvedCount / totalAttempts;
  }

  loadProgress(): boolean {
    const filePath = path.join(process.cwd(), "progress.json");

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      const progressData = JSON.parse(data);
      this.userProgress = progressData.userProgress;
      GlobalConsole.info(
        "已加载做题进度：" + JSON.stringify(this.userProgress)
      );
      this.practiceHistory = progressData.practiceHistory.map(
        (session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
        })
      );
      return true;
    } else {
      GlobalConsole.warn("未找到进度文件，将使用默认进度。");
      return false;
    }
  }

  saveProgress() {
    const progressData = {
      userProgress: this.userProgress,
      practiceHistory: this.practiceHistory,
      lastUpdated: new Date().toLocaleString(),
    };

    const filePath = path.join(process.cwd(), "progress.json");

    try {
      fs.writeFileSync(
        filePath,
        JSON.stringify(progressData, null, 2),
        "utf-8"
      );
    } catch (error) {
      GlobalConsole.error("Failed to save progress:" + error);
    }
  }

  // 获取用户进度
  getUserProgress(): UserProgress {
    return { ...this.userProgress };
  }
}

export { ProgressTracker };
