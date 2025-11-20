import type { Example, ProblemMeta, TestResult } from "./types";

class TestValidator {
  private solutionFn: Function;
  private examples: Example[];
  private problemMeta: ProblemMeta;
  constructor(
    solutionFn: Function,
    examples: Example[],
    problemMeta: ProblemMeta
  ) {
    this.solutionFn = solutionFn;
    this.examples = examples;
    this.problemMeta = problemMeta;
  }

  async validateSolution(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const example of this.examples) {
      try {
        const result = await this.runTestCase(example);
        results.push(result);
      } catch (error) {
        results.push({
          passed: false,
          failedTestCase: {
            input: example.input,
            expected: example.output,
          },
          executionTime: 0,
          memoryUsage: 0,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    return results;
  }

  private async runTestCase(example: Example) {
    const input = example.input;
    const expected = example.output;
    const startTime = performance.now();

    // 设置超时时间（例如 500毫秒）
    const TIMEOUT_MS = 500;
    let result: any;
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`执行超时`));
        }, TIMEOUT_MS);
      });

      // 将同步函数包装成异步执行，避免阻塞事件循环
      const executionPromise = new Promise((resolve, reject) => {
        // 使用 setImmediate 确保同步代码不会阻塞事件循环
        setImmediate(() => {
          try {
            let fnResult: any;
            if (Array.isArray(input)) {
              fnResult = this.solutionFn(input);
            } else if (typeof input === "object") {
              fnResult = this.solutionFn(...Object.values(input));
            } else {
              fnResult = this.solutionFn(input);
            }
            resolve(fnResult);
          } catch (error) {
            reject(error);
          }
        });
      });

      result = await Promise.race([executionPromise, timeoutPromise]);
    } catch (error) {
      console.error("[ error ] >", error);
      process.exit(1);
    }
    const passed = this.compareResults(result, expected);
    const executionTime = performance.now() - startTime;

    return {
      passed,
      failedTestCase: passed
        ? undefined
        : {
            input: example.input,
            expected: example.output,
          },
      executionTime,
      memoryUsage: 0,
      errorMessage: passed
        ? undefined
        : `Expected: ${JSON.stringify(example.output)}, Got: ${JSON.stringify(
            result
          )}`,
    };
  }

  private compareResults(result: any, expected: any): boolean {
    if (result === expected) {
      return true;
    }

    if (typeof result === "object" && typeof expected === "object") {
      return JSON.stringify(result) === JSON.stringify(expected);
    }

    return false;
  }
}

export { TestValidator };
