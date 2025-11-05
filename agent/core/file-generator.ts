import path from "path";
import fs from "fs";
import type { Example, Problem, ProblemMeta, TestResult } from "./types";
import { createProblemFile, getProblemsDirFileCount } from "./utils";
import { AiServer } from "./ai";
import { solution_base, solution_template } from "../../prompt";
import { PublicClass } from "./public";
import { GlobalConsole } from "./console";
import { getGlobalOra } from "./global";

class FileGenerator {
  ai: AiServer;
  constructor() {
    this.ai = new AiServer();
  }
  generateProblemFile(problem: Problem) {
    const oraInstance = getGlobalOra();
    oraInstance.start("题目文件创建中...");
    const fileCount = getProblemsDirFileCount();
    const fileId = fileCount + 1;
    const filename = `${fileId}-${problem.englishName}.ts`;
    const filePath = createProblemFile(filename, problem.content);
    oraInstance.stop();
    if (!filePath) {
      GlobalConsole.error(`${problem.englishName}题目文件创建失败`);
    } else {
      GlobalConsole.success(`题目文件已生成: ${filePath}`);
    }

    return filePath;
  }

  async generateSolutionFile(
    solutionFn: Function,
    examples: Example[],
    problemMeta: ProblemMeta,
    testResults: TestResult[]
  ) {
    const filename = `${problemMeta.englishName}-solution.md`;

    const filePath = path.join(process.cwd(), "solutions", filename);

    const testSummary = PublicClass.generateTestSummary(testResults);
    const aiResponse = await this.ai.createCompletion(
      solution_template(problemMeta, testSummary)
    );

    const bashContent = `
      ${solution_base(solutionFn, examples, problemMeta, testSummary)}
      ${aiResponse.choices[0]?.message.content}
    `;

    // 确保目录存在
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      GlobalConsole.info(`创建目录: ${dir}`);
    }

    // 如果文件已存在，直接覆盖文件内容
    fs.writeFileSync(filePath, bashContent || "", "utf-8");
    GlobalConsole.success(`解答总结文件已生成: ${filePath}`);

    return filePath;
  }

  /**
   * 记录生成的题目信息到根目录的 problems.json 文件
   * 会追加保存生成的题目的元信息（不包含解答，仅元数据）
   */
  appendProblemToProblemsJson(problems: ProblemMeta[]) {
    const problemsJsonPath = path.join(process.cwd(), "problems.json");

    let problemsArr = [];
    // 若文件存在，读取原内容
    if (fs.existsSync(problemsJsonPath)) {
      try {
        const fileContent = fs.readFileSync(problemsJsonPath, "utf-8");
        problemsArr = JSON.parse(fileContent);
        if (!Array.isArray(problemsArr)) {
          problemsArr = [];
        }
      } catch (error) {
        problemsArr = [];
      }
    }
    // 提取元信息（englishName, description, difficulty, examples）
    problems.forEach((problem) => {
      const { englishName, difficulty } = problem;
      problemsArr.push({
        englishName,
        difficulty,
        createdAt: new Date().toLocaleString(),
      });
    });
    try {
      fs.writeFileSync(
        problemsJsonPath,
        JSON.stringify(problemsArr, null, 2),
        "utf-8"
      );
    } catch (error) {
      GlobalConsole.error("写入 problems.json 失败: " + error);
    }
  }
}

export { FileGenerator };
