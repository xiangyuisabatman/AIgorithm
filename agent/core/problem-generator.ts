import { problem_template } from "../../prompt";
import { AiServer } from "./ai";
import { FileGenerator } from "./file-generator";
import { getGlobalOra } from "./global";
import type { PracticeSession, UserProgress } from "./types";

class ProblemGenerator {
  private userProgress: UserProgress;
  private fileGenerator: FileGenerator;
  ai: AiServer;
  constructor(userProgress: UserProgress) {
    this.ai = new AiServer();
    this.userProgress = userProgress;
    this.fileGenerator = new FileGenerator();
  }
  async generatePracticeSession(num: number): Promise<PracticeSession> {
    const oraInstance = getGlobalOra();
    oraInstance.start("题目生成中...");
    const sessionId = this.generateSessionId();
    const problems = await this.selectProblems(num);
    oraInstance.succeed("题目生成成功");
    const json = JSON.parse(problems);
    this.fileGenerator.appendProblemToProblemsJson(json);
    return {
      sessionId,
      problems: json,
      startTime: new Date(),
      completed: false,
      score: 0,
    };
  }

  private async selectProblems(num: number): Promise<string> {
    const difficultyDistribution = this.calculateDifficultyDistribution();
    // 将难度分布信息插入prompt顶部
    const difficultyInfo = `请注意本次题目难度分布建议：Easy: ${(
      difficultyDistribution.Easy * 100
    ).toFixed(0)}%，Medium: ${(difficultyDistribution.Medium * 100).toFixed(
      0
    )}%，Hard: ${(difficultyDistribution.Hard * 100).toFixed(
      0
    )}%。请尽量按此分布比例出题。\n\n`;
    const prompt = difficultyInfo + problem_template(num);
    const aiRes = await this.ai.createCompletion(prompt);

    return aiRes.choices[0]?.message?.content || "";
  }

  // 计算难度分布
  private calculateDifficultyDistribution(): {
    Easy: number;
    Medium: number;
    Hard: number;
  } {
    const totalSolved = this.userProgress.totalSolved;
    const accuracy = this.userProgress.accuracy;

    // --- 基础阶段定义 ---
    if (totalSolved < 5) {
      // 新手阶段：以简单题为主
      return { Easy: 0.8, Medium: 0.2, Hard: 0.0 };
    }

    // --- 成长阶段 ---
    if (totalSolved < 20) {
      // 根据准确率微调难度分布
      if (accuracy >= 0.8) {
        return { Easy: 0.3, Medium: 0.6, Hard: 0.1 };
      } else if (accuracy >= 0.6) {
        return { Easy: 0.5, Medium: 0.5, Hard: 0.0 };
      } else {
        return { Easy: 0.7, Medium: 0.3, Hard: 0.0 };
      }
    }

    // --- 熟练阶段 ---
    if (totalSolved < 50) {
      if (accuracy >= 0.85) {
        return { Easy: 0.2, Medium: 0.55, Hard: 0.25 };
      } else if (accuracy >= 0.7) {
        return { Easy: 0.3, Medium: 0.55, Hard: 0.15 };
      } else {
        return { Easy: 0.5, Medium: 0.45, Hard: 0.05 };
      }
    }

    // --- 高级阶段 ---
    if (totalSolved < 100) {
      if (accuracy >= 0.85) {
        return { Easy: 0.15, Medium: 0.5, Hard: 0.35 };
      } else if (accuracy >= 0.7) {
        return { Easy: 0.25, Medium: 0.55, Hard: 0.2 };
      } else {
        return { Easy: 0.4, Medium: 0.5, Hard: 0.1 };
      }
    }

    // --- 专家阶段 ---
    // 做题量大，始终保持一定比例的 Hard 题
    return { Easy: 0.1, Medium: 0.5, Hard: 0.4 };
  }

  // 生成会话ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export { ProblemGenerator };
