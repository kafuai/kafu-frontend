import { CoreService } from "./types";

const coreServices: CoreService[] = [];

export function registerCoreService(service: CoreService) {
  const existingService = coreServices.find(
    (item) => item.name === service.name
  );

  if (existingService) {
    return;
  }

  coreServices.push(service);
}

export function getCoreServices() {
  return coreServices;
}