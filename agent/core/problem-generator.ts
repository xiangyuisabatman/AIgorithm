import { problem_template } from "../../prompt";
import { AiServer } from "./ai";
import type { PracticeSession, Problem, UserProgress } from "./types";

class ProblemGenerator {
  private userProgress: UserProgress;
  ai: AiServer;
  constructor(userProgress: UserProgress) {
    this.ai = new AiServer();
    this.userProgress = userProgress;
  }
  async generatePracticeSession(num: number): Promise<PracticeSession> {
    const sessionId = this.generateSessionId();
    const problems = await this.selectProblems(num);
    return {
      sessionId,
      problems: JSON.parse(problems),
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

    if (totalSolved < 5) {
      // 初学者：主要Easy题目
      return { Easy: 0.7, Medium: 0.3, Hard: 0.0 };
    } else if (totalSolved < 20) {
      // 初级：Easy + Medium
      return { Easy: 0.5, Medium: 0.5, Hard: 0.0 };
    } else if (accuracy > 0.8) {
      // 高准确率：增加Hard题目
      return { Easy: 0.2, Medium: 0.5, Hard: 0.3 };
    } else if (accuracy > 0.6) {
      // 中等准确率：平衡分布
      return { Easy: 0.3, Medium: 0.6, Hard: 0.1 };
    } else {
      // 低准确率：降低难度
      return { Easy: 0.6, Medium: 0.4, Hard: 0.0 };
    }
  }

  // 生成会话ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export { ProblemGenerator };
