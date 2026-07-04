import { EnterpriseModule } from "./module";

const enterpriseModules: EnterpriseModule[] = [];

export function registerEnterpriseModule(module: EnterpriseModule) {
  const existingModule = enterpriseModules.find(
    (item) => item.name === module.name
  );

  if (existingModule) {
    return;
  }

  enterpriseModules.push(module);
}

export function getEnterpriseModules() {
  return enterpriseModules;
}