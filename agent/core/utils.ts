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

export function removeAllProblemsDirFiles() {
  const problemsDir = path.join(projectRoot, "problems");
  if (!fs.existsSync(problemsDir)) {
    return;
  }

  function removeDirContents(dirPath: string) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        removeDirContents(itemPath);
        fs.rmdirSync(itemPath);
      } else {
        fs.unlinkSync(itemPath);
      }
    }
  }

  try {
    removeDirContents(problemsDir);
    GlobalConsole.success('\n 已删除 "problems" 目录下所有文件和文件夹');
  } catch (err) {
    GlobalConsole.error('删除 "problems" 目录内容失败: ' + err);
  }
}

export function removeAllSolutionsDirFiles() {
  const solutionsDir = path.join(projectRoot, "solutions");
  if (!fs.existsSync(solutionsDir)) {
    return;
  }

  function removeDirContents(dirPath: string) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        removeDirContents(itemPath);
        fs.rmdirSync(itemPath);
      } else {
        fs.unlinkSync(itemPath);
      }
    }
  }

  try {
    removeDirContents(solutionsDir);
    GlobalConsole.success('已删除 "solutions" 目录下所有文件和文件夹');
  } catch (err) {
    GlobalConsole.error('删除 "solutions" 目录内容失败: ' + err);
  }
}

export function clearProblemsJson() {
  const problemsJsonPath = path.join(projectRoot, "problems.json");
  try {
    fs.writeFileSync(problemsJsonPath, "[]", "utf-8");
    GlobalConsole.success('已清空根目录下 "problems.json" 的内容');
  } catch (err) {
    GlobalConsole.error('清空 "problems.json" 内容失败: ' + err);
  }
}
