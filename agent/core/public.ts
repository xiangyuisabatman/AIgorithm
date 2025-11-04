import type { TestResult } from "./types";

class PublicClass {
  static generateTestSummary(testResults: TestResult[]): string {
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

export { PublicClass };
