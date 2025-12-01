import { problem_template } from "../../prompt";
import { AiServer } from "./ai";
import { FileGenerator } from "./file-generator";
import { getGlobalOra } from "./global";
import type { PracticeSession, UserProgress } from "./types";
import { getCompletedProblemsFromProgress, getProblemsJson } from "./utils";

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
    let problems: string = "";
    let json: any = null;
    try {
      problems = await this.selectProblems(num);
      json = JSON.parse(problems);
      oraInstance.succeed("题目生成成功");
      this.fileGenerator.appendProblemToProblemsJson(json);
      return {
        sessionId,
        problems: json,
        startTime: new Date(),
        completed: false,
        score: 0,
      };
    } catch (err: any) {
      await this.fileGenerator.saveErrorLog(problems);
      oraInstance.fail("题目生成失败: " + (err?.message || err));
      // 提示并返回空结果，也可根据需求抛出异常
      return {
        sessionId,
        problems: [],
        startTime: new Date(),
        completed: false,
        score: 0,
      };
    }
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

    let usedProblemNames: string[] = getProblemsJson();
    // 构造避免重复出题的前置信息
    let avoidRepeatPrompt = "";
    if (usedProblemNames.length > 0) {
      avoidRepeatPrompt =
        "请确保本次生成的所有题目不能与下列题目重复（根据英文题目名unique）：[" +
        usedProblemNames.join(", ") +
        "]\n\n";
    }

    const completedList = await getCompletedProblemsFromProgress();

    // 构造避免推荐已完成题目的前置信息
    let dontRepeatCompletedList = "";
    if (completedList && completedList.length > 0) {
      dontRepeatCompletedList =
        "请确保本次生成的题目不能与下列已完成题目重复：[" +
        completedList.join(", ") +
        "]\n\n";
    }
    // 将dontRepeatCompletedList插入到prompt顶部，优先于avoidRepeatPrompt
    // 优先结合两个去重要求（已生成和已完成）

    const prompt =
      difficultyInfo +
      avoidRepeatPrompt +
      dontRepeatCompletedList +
      problem_template(num);
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
