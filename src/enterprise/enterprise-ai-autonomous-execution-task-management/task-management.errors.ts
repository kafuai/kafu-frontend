export class TaskManagementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskManagementError';
  }
}

export class TaskNotFoundError extends TaskManagementError {
  constructor(taskId: string) {
    super(`Task was not found: ${taskId}`);
    this.name = 'TaskNotFoundError';
  }
}

export class InvalidTaskStateError extends TaskManagementError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTaskStateError';
  }
}

export class TaskReadinessError extends TaskManagementError {
  constructor(message: string) {
    super(message);
    this.name = 'TaskReadinessError';
  }
}