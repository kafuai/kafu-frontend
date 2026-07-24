export type VoiceRecordingStatus =
  | "idle"
  | "requesting_permission"
  | "recording"
  | "paused"
  | "stopped"
  | "failed";

export interface VoiceRecordingResult {
  readonly blob: Blob;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly durationSeconds: number;
  readonly createdAt: string;
}

export interface VoiceRecorderState {
  readonly status: VoiceRecordingStatus;
  readonly startedAt?: number;
  readonly pausedAt?: number;
  readonly durationSeconds: number;
  readonly errorMessage?: string;
}

export interface VoiceRecorder {
  getState(): VoiceRecorderState;
  start(): Promise<void>;
  pause(): void;
  resume(): void;
  stop(): Promise<VoiceRecordingResult>;
  cancel(): void;
}
