export type EnterpriseDIToken<T = unknown> = string | symbol;

export type EnterpriseDIProviderScope = "singleton" | "transient";

export type EnterpriseDIProvider<T = unknown> = {
  token: EnterpriseDIToken<T>;
  scope: EnterpriseDIProviderScope;
  useValue?: T;
  useFactory?: () => T;
};

export type EnterpriseDIResolutionResult<T = unknown> = {
  token: EnterpriseDIToken<T>;
  resolved: T;
  scope: EnterpriseDIProviderScope;
};