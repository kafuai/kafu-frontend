export type EnterpriseDIToken<T = unknown> = (string | symbol) & {
  readonly __enterpriseDIType?: T;
};

export type EnterpriseDIProviderScope = "singleton" | "transient";

export type EnterpriseDIProvider<T = unknown> = {
  token: EnterpriseDIToken;
  scope: EnterpriseDIProviderScope;
  useValue?: T;
  useFactory?: () => T;
};

export type EnterpriseDIResolutionResult<T = unknown> = {
  token: EnterpriseDIToken;
  resolved: T;
  scope: EnterpriseDIProviderScope;
};