import chalk from "chalk";

class GlobalConsole {
  static success(message: string) {
    console.log(chalk.green(`🎉  ${message}`));
  }

  static error(message: string) {
    console.log(chalk.red(`❌ ${message}`));
  }

  static warn(message: string) {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }

  static info(message: string) {
    console.log(chalk.blue(`ℹ️  ${message}`));
  }

  static processing(message: string) {
    console.log(chalk.cyan(`⏳ ${message}`));
  }

  static custom(message: string, color: keyof typeof chalk = "white") {
    // fallback to plain if wrong color specified
    if (chalk[color]) {
      // @ts-ignore
      console.log(chalk[color](message));
    } else {
      console.log(message);
    }
  }
}

export { GlobalConsole };
