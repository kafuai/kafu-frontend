export type PlatformCachePolicy = {
  keyPrefix: string;
  ttlMs: number;
  enabled: boolean;
};

export function resolveCacheTtl(
  key: string,
  policies: PlatformCachePolicy[],
): number | undefined {
  const policy = policies.find(
    (item) => item.enabled && key.startsWith(item.keyPrefix),
  );

  return policy?.ttlMs;
}