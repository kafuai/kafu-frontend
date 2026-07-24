import type {
  CommunicationAttachment,
} from "../communicationAttachment";
import type {
  CommunicationUploadService,
} from "../storage/communicationUploadService";
import type {
  VoiceRecorder,
  VoiceRecordingResult,
} from "./voiceRecordingTypes";

export interface SaveCommunicationVoiceInput {
  readonly attachmentId: string;
  readonly companyId: string;
  readonly conversationId: string;
  readonly messageId: string;
  readonly createdBy: string;
}

export class CommunicationVoiceService {
  constructor(
    private readonly recorder: VoiceRecorder,
    private readonly uploadService: CommunicationUploadService,
  ) {}

  async startRecording(): Promise<void> {
    await this.recorder.start();
  }

  pauseRecording(): void {
    this.recorder.pause();
  }

  resumeRecording(): void {
    this.recorder.resume();
  }

  cancelRecording(): void {
    this.recorder.cancel();
  }

  async stopRecording(): Promise<VoiceRecordingResult> {
    const result = await this.recorder.stop();

    if (result.sizeBytes <= 0) {
      throw new Error(
        "The recorded voice message is empty.",
      );
    }

    return result;
  }

  async saveRecording(
    recording: VoiceRecordingResult,
    input: SaveCommunicationVoiceInput,
  ): Promise<CommunicationAttachment> {
    return this.uploadService.uploadAttachment({
      attachmentId: input.attachmentId,
      companyId: input.companyId,
      conversationId: input.conversationId,
      messageId: input.messageId,
      createdBy: input.createdBy,
      durationSeconds: recording.durationSeconds,
      file: {
        name: recording.fileName,
        type: recording.mimeType,
        size: recording.sizeBytes,
        data: recording.blob,
      },
    });
  }
}
