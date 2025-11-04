import type { Problem } from "../agent/core/types";

export const mockProblems: Problem[] = [
  {
    englishName: "Minimum Cost to Connect All Points",
    description:
      "给你一个整数数组 points，其中 points[i] = [xi, yi] 表示二维平面上的点。你需要将所有点连接起来，使得任意两点之间有路径相连，且总连接成本最小。连接两个点 (xi, yi) 和 (xj, yj) 的成本是它们的曼哈顿距离 |xi - xj| + |yi - yj|。求连接所有点的最小成本。",
    difficulty: "Hard",
    examples: [
      { input: "points = [[0,0],[2,2],[3,10],[5,2],[7,0]]", output: "20" },
      { input: "points = [[3,12],[-2,5],[-4,1]]", output: "18" },
      { input: "points = [[0,0]]", output: "0" },
      { input: "points = [[-5,-2],[0,0],[5,2]]", output: "14" },
      { input: "points = [[2,2],[2,2],[2,2]]", output: "0" },
    ],
    content:
      '/*\nMinimum Cost to Connect All Points | Hard\n\n题目描述：给你一个整数数组 points，其中 points[i] = [xi, yi] 表示二维平面上的点。你需要将所有点连接起来，使得任意两点之间有路径相连，且总连接成本最小。连接两个点 (xi, yi) 和 (xj, yj) 的成本是它们的曼哈顿距离 |xi - xj| + |yi - yj|。求连接所有点的最小成本。\n\n输入格式：points: number[][]\n输出格式：number\n\n限制条件：\n- 1 <= points.length <= 1000\n- -10^6 <= xi, yi <= 10^6\n- 所有点坐标唯一或可重复\n- 结果保证为整数\n\n示例用例：\n1. 输入：points = [[0,0],[2,2],[3,10],[5,2],[7,0]]\n   输出：20\n2. 输入：points = [[3,12],[-2,5],[-4,1]]\n   输出：18\n3. 输入：points = [[0,0]]\n   输出：0\n4. 输入：points = [[-5,-2],[0,0],[5,2]]\n   输出：14\n5. 输入：points = [[2,2],[2,2],[2,2]]\n   输出：0\n\n提示：\n- 使用最小生成树算法（如Kruskal或Prim）解决本题。\n- 曼哈顿距离计算注意绝对值。\n- 处理大量边时注意性能优化。\n*/\n\n// 用例数组，供外部导入\nexport const examples = [\n  { input: "points = [[0,0],[2,2],[3,10],[5,2],[7,0]]", output: "20" },\n  { input: "points = [[3,12],[-2,5],[-4,1]]", output: "18" },\n  { input: "points = [[0,0]]", output: "0" },\n  { input: "points = [[-5,-2],[0,0],[5,2]]", output: "14" },\n  { input: "points = [[2,2],[2,2],[2,2]]", output: "0" },\n];\n\nfunction minCostConnectPoints(points: number[][]): number {\n  // TODO: implement here\n  return 0;\n}\n\n// 统一函数导出名，函数本身名不变\nexport { minCostConnectPoints as solution };\n\n// 题目信息对象导出（包含英文名、描述和难度），供外部模块快速引用题目基础信息\n/**\n * 题目基础信息\n * - englishName: 英文题目名\n * - description: 题目描述\n * - difficulty: 难度等级（"Easy" | "Medium" | "Hard"）\n */\nexport const problemMeta = {\n  englishName: "Minimum Cost to Connect All Points",\n  description: "给你一个整数数组 points，其中 points[i] = [xi, yi] 表示二维平面上的点。你需要将所有点连接起来，使得任意两点之间有路径相连，且总连接成本最小。连接两个点 (xi, yi) 和 (xj, yj) 的成本是它们的曼哈顿距离 |xi - xj| + |yi - yj|。求连接所有点的最小成本。",\n  difficulty: "Hard",\n};',
  },
];
