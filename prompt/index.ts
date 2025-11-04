import type { Example, ProblemMeta } from "../agent/core/types";

export const solution_base = (
  solutionFn: Function,
  examples: Example[],
  problemMeta: ProblemMeta,
  testSummary: string
) => {
  `
  # 解题报告：${problemMeta.englishName}

  ## 题目描述
  ${problemMeta.description}

  ## 难度
  ${problemMeta.difficulty}

  ## 题解代码
  ### 用例
  ${examples
    .map(
      (example) =>
        `- 输入: ${JSON.stringify(example.input)}\n- 期望: ${JSON.stringify(
          example.output
        )}`
    )
    .join("\n")}

  \`\`\`javascript
  ${solutionFn}
  \`\`\`

  ## 测试结果
  ${testSummary}
  `;
};

export const solution_template = `
  --- 
  ## 题解（请帮助补全详细题解，包括多种方法的逐步思路）

  请分别给出至少两种解法（基础及进阶，各一种或多于两种），并分别说明每种解法的：
  - 基本解题思想
  - 每步实现要点
  - 时间复杂度、空间复杂度分析

  ### 解法1：基础方法
  - 思路与分析：

  - 时间复杂度：

  - 空间复杂度：

  - 代码实现：

  ---

  ### 解法2：进阶/优化方法
  - 思路与分析：

  - 不同于基础解法的优化点：

  - 时间复杂度：

  - 空间复杂度：

  - 代码实现：

  ---

  ### 可选·其它解法（如有）

  ---

  ## 学习建议（结合测试结果给出针对性建议）

  请根据测试结果反馈总览，为学习者推荐如下指导建议：
  - 如全部通过，如何进一步优化或挑战更高难度；
  - 如有未通过的测试，请分析失败用例、总结常见错误点，并提出修改建议。

  ---
  *生成时间: ${new Date().toLocaleString()}*
`;

export const problem_template = (num: number) => `
  请生成 ${num} 道有挑战性的算法题（覆盖排序、查找、动态规划、图论等），每道题必须以 **纯 JSON 数组** 形式输出，不要任何额外文本、解释或 Markdown。

  每道题是一个 JSON 对象，仅包含以下五个字段：
  - "englishName": 字符串，题目标准英文名（如 "Longest Palindromic Substring"）
  - "description": 字符串，题目的简要中文描述，仅描述背景和解题目标，不包含输入输出格式或示例信息
  - "difficulty": 字符串，必须是 "Easy"、"Medium" 或 "Hard"
  - "examples": 包含恰好 5 个示例的数组，每个示例是 { "input": ..., "output": ... }，**要求 input 字段为实际可用于函数调用的结构化 JSON 值（如数组、数字、对象等），output 字段也为标准 JSON 值（如数字、字符串、布尔、数组、对象等），结果类型应与实际题意一致，不是字符串。如果是数组就写数组，如果是数字就用数字（如 14），如果是布尔值请写 true/false，所有类型都不能用引号包裹。examples 须覆盖常规、边界和极端情况（如空输入、最大规模、重复元素等）**
  - "content": 字符串，内容必须可直接复制到 .ts 文件中使用，格式如下：

  /*
  <englishName> | difficulty

  题目描述：简明说明问题背景和要求。

  输入格式：...
  输出格式：...

  限制条件：
  - ...

  示例用例：
  1. 输入：<input1>
      输出：<output1>
  2. 输入：<input2>
      输出：<output2>
  3. 输入：<input3>
      输出：<output3>
  4. 输入：<input4>
      输出：<output4>
  5. 输入：<input5>
      输出：<output5>

  提示：
  - 题目中若含特殊字符（如引号、反斜杠等），请在 content 中正确转义。
  - 函数名使用驼峰命名（如 twoSum, longestPalindrome）。
  - 函数体留空，用 // TODO: implement here 标注。
  */

  // 用例数组，供外部导入
  export const examples = [
    { input: <input1>, output: <output1> },
    { input: <input2>, output: <output2> },
    { input: <input3>, output: <output3> },
    { input: <input4>, output: <output4> },
    { input: <input5>, output: <output5> },
  ];

  function functionName(...): ... {
    // TODO: implement here
    return ...;
  }

  // 统一函数导出名，函数本身名不变
  export { functionName as solution };

  // 题目信息对象导出（包含英文名、描述和难度），供外部模块快速引用题目基础信息
  /**
   * 题目基础信息
   * - englishName: 英文题目名
   * - description: 题目描述
   * - difficulty: 难度等级（"Easy" | "Medium" | "Hard"）
   */
  export const problemMeta = {
    englishName: "<englishName>",
    description: "<description>",
    difficulty: "<difficulty>",
  };

  注意：
  1. "content" 字段必须是合法的 TypeScript 文件片段（注释 + 函数声明），所有换行用 \\n，引号用 \\" 转义，确保整个 JSON 合法。
  2. examples 中的 input/output 字段直接写为可正确 JSON 解析的原始数据（如 input:[[0,0],[2,2]]，output:20），不可用字符串形式（不要带引号），务必与实际类型完全一致。
  3. 只输出 JSON 数组，不要任何其他内容。
  4. 确保 5 个 examples 覆盖边界和极限情况（如空数组、单元素、最大输入规模、全相同元素、无解情况等）。

  现在请生成 ${num} 道题。
`;
