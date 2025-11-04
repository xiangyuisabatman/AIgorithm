import ora, { type Ora } from "ora";

type SingletonType = "ora" | string;

interface SingletonInstances {
  [key: string]: any;
}

/**
 * 通用全局单例管理器
 * 支持多种类型的单例全局实例，例如ora、notification等
 */
class GlobalSingletonManager {
  private static instances: SingletonInstances = {};

  /**
   * 获取类型为type的唯一实例，如果不存在则会用factory创建
   */
  static getInstance<T>(type: SingletonType, factory: () => T): T {
    if (!GlobalSingletonManager.instances[type]) {
      GlobalSingletonManager.instances[type] = factory();
    }
    return GlobalSingletonManager.instances[type];
  }

  /**
   * 判断某类型的实例是否已存在
   */
  static hasInstance(type: SingletonType): boolean {
    return !!GlobalSingletonManager.instances[type];
  }

  /**
   * 可以移除某类型的实例，比如reset
   */
  static removeInstance(type: SingletonType) {
    delete GlobalSingletonManager.instances[type];
  }
}

// ====== 示例: ora单例 ======

// 获取全局唯一的 ora 实例
function getGlobalOra(text: string = "Processing..."): Ora {
  return GlobalSingletonManager.getInstance("ora", () => ora(text).start());
}

// 如果以后有其他类似global实例，也可以用同样方式注册获取

export { GlobalSingletonManager, getGlobalOra };
