import { EnterpriseDIContainer } from "./enterpriseDIContainer";

export function getEnterpriseDIDiagnostics(container: EnterpriseDIContainer) {
  return {
    providerCount: container.getProviderTokens().length,
    providers: container.getProviderTokens().map((token) => String(token)),
  };
}