export declare global {
  interface Object {
    isEquals<T extends object>(obj1: T, obj2: T): boolean;
  }
}
