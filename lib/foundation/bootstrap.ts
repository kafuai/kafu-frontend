import { registerFoundationServices } from "./serviceRegistry";

let bootstrapped = false;

export function bootstrapFoundation() {
  if (bootstrapped) {
    return;
  }

  registerFoundationServices();

  bootstrapped = true;
}