import fs from "fs";
import path from "path";
import { TestValidator } from "./core/test-validator";
import { PublicClass } from "./core/public";
/**
 * 运行验证
 * @param filename 算法文件名
 */
async function runValidator(filename: string) {
  filename = filename.split("/").pop() || "";
  const filePath = path.resolve(process.cwd(), "problems", filename);

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.log(`文件 ${filename} 不存在。`);
    return;
  }

  // 动态导入算法文件
  try {
    const {
      examples,
      solution: solutionFn,
      problemMeta,
    } = await import(filePath);

    console.log(`开始验证文件: ${filename}`);

    const testValidator = new TestValidator(solutionFn, examples, problemMeta);

    const testResults = await testValidator.validateSolution();
    // 执行验证
    const testSummary = PublicClass.generateTestSummary(testResults);

    console.log(testSummary);
  } catch (error) {
    console.error(`无法导入文件 ${filename}:`, error);
  }
}
// 从命令行接收文件路径参数
const args = process.argv.slice(2);
const filename = args[0];

if (!filename) {
  console.log("请提供文件名作为参数");
  process.exit(1);
}

runValidator(filename);
