export interface CustomerSuccessPlaybook {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
}

export function shouldRunPlaybook(
  playbook: CustomerSuccessPlaybook,
  trigger: string,
): boolean {
  return playbook.trigger === trigger;
}