import fs from "fs";
import path from "path";
import { GlobalConsole } from "./console";
import type { ProblemMeta } from "./types";

// 获取项目根目录
const projectRoot = process.cwd();

// 指定问题目录
export function getProblemsDirFileCount() {
  const problemsDir = path.join(projectRoot, "problems");
  try {
    // 读取目录内容
    const files = fs.readdirSync(problemsDir);

    // 过滤掉文件夹，只保留文件
    const fileCount = files.filter((file) => {
      const filePath = path.join(problemsDir, file);
      // 返回文件，排除目录
      return fs.statSync(filePath).isFile();
    }).length;

    return fileCount;
  } catch (err) {
    GlobalConsole.error("Error reading directory:" + err);
    return 0;
  }
}

export function getProblemFiles() {
  const problemsDir = path.join(projectRoot, "problems");
  const files = fs.readdirSync(problemsDir);
  return files
    .filter((file) => {
      const filePath = path.join(problemsDir, file);
      return fs.statSync(filePath).isFile();
    })
    .map((file) => {
      const filePath = path.join(problemsDir, file);
      return { filename: file, filePath };
    });
}

export function createProblemFile(filename: string, content: string) {
  const problemsDir = path.join(projectRoot, "problems");

  // 确保problems目录存在
  if (!fs.existsSync(problemsDir)) {
    fs.mkdirSync(problemsDir, { recursive: true });
  }

  const filePath = path.join(problemsDir, filename);
  try {
    fs.writeFileSync(filePath, content, { encoding: "utf-8" });
    return filePath;
  } catch (err) {
    GlobalConsole.error("Error creating problem file:" + err);
    return false;
  }
}

export function getProblemsJson() {
  const problemsJsonPath = path.join(projectRoot, "problems.json");
  if (!fs.existsSync(problemsJsonPath)) {
    GlobalConsole.warn("problems.json 不存在");
    return [];
  }
  try {
    const fileContent = fs.readFileSync(problemsJsonPath, "utf-8");
    return JSON.parse(fileContent).map(
      (problem: ProblemMeta) => problem.englishName
    );
  } catch (err) {
    GlobalConsole.error("读取 problems.json 失败: " + err);
    return [];
  }
}
