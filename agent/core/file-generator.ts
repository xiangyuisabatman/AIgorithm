import path from "path";
import fs from "fs";
import type { Example, Problem, ProblemMeta, TestResult } from "./types";
import { createProblemFile, getProblemsDirFileCount } from "./utils";
import { AiServer } from "./ai";
import { solution_base, solution_template } from "../../prompt";
import { PublicClass } from "./public";

class FileGenerator {
  ai: AiServer;
  constructor() {
    this.ai = new AiServer();
  }
  generateProblemFile(problem: Problem) {
    const fileCount = getProblemsDirFileCount();
    const fileId = fileCount + 1;
    const filename = `${fileId}-${problem.englishName}.ts`;
    const filePath = createProblemFile(filename, problem.content);
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
    }

    // 如果文件已存在，直接覆盖文件内容
    fs.writeFileSync(filePath, bashContent || "", "utf-8");

    return filePath;
  }
}

export { FileGenerator };
