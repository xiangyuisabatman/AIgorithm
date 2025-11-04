import path from "path";
import fs from "fs";
import type { Example, Problem, ProblemMeta, TestResult } from "./types";
import { createProblemFile, getProblemsDirFileCount } from "./utils";
import { AiServer } from "./ai";
import { solution_base, solution_template } from "../../prompt";

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

    const aiResponse = await this.ai.createCompletion(solution_template);
    const testSummary = this.generateTestSummary(testResults);

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

  private generateTestSummary(testResults: TestResult[]): string {
    const total = testResults.length;
    const passed = testResults.filter((r) => r.passed).length;
    const failed = total - passed;
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0";
    const avgTime =
      testResults.reduce((sum, r) => sum + r.executionTime, 0) / total;

    return `
- **总测试用例:** ${total}
- **通过:** ${passed}
- **失败:** ${failed}
- **成功率:** ${successRate}%
- **平均执行时间:** ${avgTime.toFixed(2)}ms

${
  failed > 0
    ? `
### 失败的测试用例
${testResults
  .filter((r) => !r.passed)
  .map(
    (result, index) => `
**测试用例 ${index + 1}:**  
- 输入: ${JSON.stringify(result.failedTestCase?.input)}
- 期望: ${JSON.stringify(result.failedTestCase?.expected)}
- 错误: ${result.errorMessage}
`
  )
  .join("\n")}
`
    : ""
}
`;
  }
}

export { FileGenerator };
