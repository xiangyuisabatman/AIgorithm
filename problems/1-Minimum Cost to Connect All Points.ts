/*
Minimum Cost to Connect All Points | Hard

题目描述：给你一个整数数组 points，其中 points[i] = [xi, yi] 表示二维平面上的点。你需要将所有点连接起来，使得任意两点之间有路径相连，且总连接成本最小。连接两个点 (xi, yi) 和 (xj, yj) 的成本是它们的曼哈顿距离 |xi - xj| + |yi - yj|。求连接所有点的最小成本。

输入格式：points: number[][]
输出格式：number

限制条件：
- 1 <= points.length <= 1000
- -10^6 <= xi, yi <= 10^6
- 所有点坐标唯一或可重复
- 结果保证为整数

示例用例：
1. 输入：points = [[0,0],[2,2],[3,10],[5,2],[7,0]]
   输出：20
2. 输入：points = [[3,12],[-2,5],[-4,1]]
   输出：18
3. 输入：points = [[0,0]]
   输出：0
4. 输入：points = [[-5,-2],[0,0],[5,2]]
   输出：14
5. 输入：points = [[2,2],[2,2],[2,2]]
   输出：0

提示：
- 使用最小生成树算法（如Kruskal或Prim）解决本题。
- 曼哈顿距离计算注意绝对值。
- 处理大量边时注意性能优化。
*/

// 用例数组，供外部导入
export const examples = [
  {
    input: [
      [0, 0],
      [2, 2],
      [3, 10],
      [5, 2],
      [7, 0],
    ],
    output: 21,
  },
  {
    input: [
      [3, 12],
      [-2, 5],
      [-4, 1],
    ],
    output: 18,
  },
  { input: [[0, 0]], output: 0 },
  {
    input: [
      [-5, -2],
      [0, 0],
      [5, 2],
    ],
    output: 14,
  },
  {
    input: [
      [2, 2],
      [2, 2],
      [2, 2],
    ],
    output: 0,
  },
];

function minCostConnectPoints(points: number[][]): number {
  const n = points.length;
  const inMST = new Array(n).fill(false); // 是否已加入 MST
  const minDist = new Array(n).fill(Infinity); // 每个点到 MST 的最小距离

  let edgesUsed = 0;
  let result = 0;

  minDist[0] = 0; // 从第 0 个点开始

  while (edgesUsed < n) {
    let currMinEdge = Infinity;
    let currNode = -1;

    // 1️⃣ 找到未加入 MST 中、距离最小的点
    for (let i = 0; i < n; i++) {
      if (!inMST[i] && minDist[i] < currMinEdge) {
        currMinEdge = minDist[i];
        currNode = i;
      }
    }

    // 2️⃣ 把它加入 MST
    inMST[currNode] = true;
    result += currMinEdge;
    edgesUsed++;

    // 3️⃣ 更新其他点的最小连接代价
    for (let i = 0; i < n; i++) {
      if (!inMST[i]) {
        const dist =
          Math.abs(points[currNode]![0]! - points[i]![0]!) +
          Math.abs(points[currNode]![1]! - points[i]![1]!);
        if (dist < minDist[i]) {
          minDist[i] = dist;
        }
      }
    }
  }

  return result;
}

// 统一函数导出名，函数本身名不变
export { minCostConnectPoints as solution };

// 题目信息对象导出（包含英文名、描述和难度），供外部模块快速引用题目基础信息
/**
 * 题目基础信息
 * - englishName: 英文题目名
 * - description: 题目描述
 * - difficulty: 难度等级（"Easy" | "Medium" | "Hard"）
 */
export const problemMeta = {
  englishName: "Minimum Cost to Connect All Points",
  description:
    "给你一个整数数组 points，其中 points[i] = [xi, yi] 表示二维平面上的点。你需要将所有点连接起来，使得任意两点之间有路径相连，且总连接成本最小。连接两个点 (xi, yi) 和 (xj, yj) 的成本是它们的曼哈顿距离 |xi - xj| + |yi - yj|。求连接所有点的最小成本。",
  difficulty: "Hard",
};
