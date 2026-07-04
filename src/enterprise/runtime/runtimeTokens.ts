export type RuntimeToken<T> = string & {
  readonly __runtimeToken?: T;
};

export function createRuntimeToken<T>(name: string): RuntimeToken<T> {
  return name as RuntimeToken<T>;
}