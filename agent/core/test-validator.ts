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
    const executionTime = performance.now() - startTime;
    let result: any;
    if (Array.isArray(input)) {
      result = await this.solutionFn(...input);
    } else if (typeof input === "object") {
      result = await this.solutionFn(...Object.values(input));
    } else {
      result = await this.solutionFn(input);
    }
    const passed = this.compareResults(result, expected);
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
