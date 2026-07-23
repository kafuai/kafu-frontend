export type VoiceRecorderStatus =
  | "idle"
  | "requesting_permission"
  | "recording"
  | "stopped"
  | "error";

export interface VoiceRecordingResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
  durationSeconds: number;
}

export interface VoiceRecorderSnapshot {
  status: VoiceRecorderStatus;
  durationSeconds: number;
  error: string | null;
}

const SUPPORTED_AUDIO_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/ogg",
  "audio/mp4",
];

function selectMimeType(): string {
  if (
    typeof MediaRecorder === "undefined" ||
    typeof MediaRecorder.isTypeSupported !== "function"
  ) {
    return "";
  }

  return (
    SUPPORTED_AUDIO_TYPES.find((type) =>
      MediaRecorder.isTypeSupported(type)
    ) ?? ""
  );
}

function extensionFromMimeType(mimeType: string): string {
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4")) return "m4a";

  return "webm";
}

export class VoiceRecorderController {
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private startedAt: number | null = null;
  private status: VoiceRecorderStatus = "idle";
  private error: string | null = null;

  getSnapshot(): VoiceRecorderSnapshot {
    return {
      status: this.status,
      durationSeconds: this.getDurationSeconds(),
      error: this.error,
    };
  }

  async start(): Promise<void> {
    if (this.status === "recording") {
      throw new Error("Voice recording is already active.");
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      this.status = "error";
      this.error =
        "Voice recording is not supported by this browser.";

      throw new Error(this.error);
    }

    if (typeof MediaRecorder === "undefined") {
      this.status = "error";
      this.error =
        "MediaRecorder is not supported by this browser.";

      throw new Error(this.error);
    }

    this.status = "requesting_permission";
    this.error = null;
    this.chunks = [];

    try {
      this.mediaStream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

      const mimeType = selectMimeType();

      this.mediaRecorder = mimeType
        ? new MediaRecorder(this.mediaStream, { mimeType })
        : new MediaRecorder(this.mediaStream);

      this.mediaRecorder.addEventListener(
        "dataavailable",
        (event: BlobEvent) => {
          if (event.data.size > 0) {
            this.chunks.push(event.data);
          }
        }
      );

      this.mediaRecorder.start(250);
      this.startedAt = Date.now();
      this.status = "recording";
    } catch (error) {
      this.cleanupStream();
      this.status = "error";

      this.error =
        error instanceof Error
          ? error.message
          : "Unable to start voice recording.";

      throw new Error(this.error);
    }
  }

  stop(): Promise<VoiceRecordingResult> {
    const recorder = this.mediaRecorder;

    if (!recorder || recorder.state !== "recording") {
      return Promise.reject(
        new Error("No active voice recording was found.")
      );
    }

    return new Promise((resolve, reject) => {
      const durationSeconds = this.getDurationSeconds();

      const handleStop = (): void => {
        try {
          const mimeType =
            recorder.mimeType ||
            this.chunks[0]?.type ||
            "audio/webm";

          const blob = new Blob(this.chunks, {
            type: mimeType,
          });

          if (blob.size === 0) {
            throw new Error(
              "The voice recording did not contain audio."
            );
          }

          const extension =
            extensionFromMimeType(mimeType);

          this.status = "stopped";
          this.startedAt = null;
          this.cleanupStream();

          resolve({
            blob,
            fileName:
              `voice-${new Date()
                .toISOString()
                .replace(/[:.]/g, "-")}.${extension}`,
            mimeType,
            durationSeconds,
          });
        } catch (error) {
          this.status = "error";
          this.error =
            error instanceof Error
              ? error.message
              : "Unable to finalize voice recording.";

          this.cleanupStream();
          reject(new Error(this.error));
        }
      };

      recorder.addEventListener("stop", handleStop, {
        once: true,
      });

      recorder.stop();
    });
  }

  cancel(): void {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "recording"
    ) {
      this.mediaRecorder.stop();
    }

    this.chunks = [];
    this.startedAt = null;
    this.status = "idle";
    this.error = null;
    this.cleanupStream();
  }

  private getDurationSeconds(): number {
    if (!this.startedAt) {
      return 0;
    }

    return Math.max(
      0,
      Math.round((Date.now() - this.startedAt) / 1000)
    );
  }

  private cleanupStream(): void {
    this.mediaStream?.getTracks().forEach((track) => {
      track.stop();
    });

    this.mediaStream = null;
    this.mediaRecorder = null;
  }
}
