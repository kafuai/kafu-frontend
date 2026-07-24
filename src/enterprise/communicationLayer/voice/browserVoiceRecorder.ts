import type {
  VoiceRecorder,
  VoiceRecorderState,
  VoiceRecordingResult,
} from "./voiceRecordingTypes";

const DEFAULT_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
] as const;

function resolveSupportedMimeType(): string {
  if (
    typeof MediaRecorder === "undefined" ||
    typeof MediaRecorder.isTypeSupported !== "function"
  ) {
    return "";
  }

  return (
    DEFAULT_MIME_TYPES.find((mimeType) =>
      MediaRecorder.isTypeSupported(mimeType),
    ) ?? ""
  );
}

function resolveExtension(mimeType: string): string {
  if (mimeType.includes("mp4")) {
    return "m4a";
  }

  if (mimeType.includes("ogg")) {
    return "ogg";
  }

  return "webm";
}

export class BrowserVoiceRecorder implements VoiceRecorder {
  private recorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private stopResolver:
    | ((result: VoiceRecordingResult) => void)
    | null = null;
  private stopRejecter:
    | ((reason?: unknown) => void)
    | null = null;

  private state: VoiceRecorderState = {
    status: "idle",
    durationSeconds: 0,
  };

  getState(): VoiceRecorderState {
    return { ...this.state };
  }

  async start(): Promise<void> {
    if (typeof window === "undefined") {
      throw new Error(
        "Voice recording is only available in the browser.",
      );
    }

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      throw new Error(
        "This browser does not support microphone recording.",
      );
    }

    if (
      this.state.status === "recording" ||
      this.state.status === "paused"
    ) {
      throw new Error(
        "A voice recording session is already active.",
      );
    }

    this.state = {
      status: "requesting_permission",
      durationSeconds: 0,
    };

    try {
      this.stream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

      const mimeType = resolveSupportedMimeType();

      this.recorder = mimeType
        ? new MediaRecorder(this.stream, { mimeType })
        : new MediaRecorder(this.stream);

      this.chunks = [];

      this.recorder.ondataavailable = (
        event: BlobEvent,
      ) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.recorder.onerror = () => {
        const error = new Error(
          "Voice recording failed unexpectedly.",
        );

        this.state = {
          status: "failed",
          durationSeconds:
            this.calculateDurationSeconds(),
          errorMessage: error.message,
        };

        this.stopRejecter?.(error);
        this.cleanup();
      };

      this.recorder.onstop = () => {
        try {
          const resolvedMimeType =
            this.recorder?.mimeType ||
            mimeType ||
            "audio/webm";

          const blob = new Blob(this.chunks, {
            type: resolvedMimeType,
          });

          const durationSeconds =
            this.calculateDurationSeconds();

          const result: VoiceRecordingResult = {
            blob,
            fileName: `voice-${crypto.randomUUID()}.${resolveExtension(
              resolvedMimeType,
            )}`,
            mimeType: resolvedMimeType,
            sizeBytes: blob.size,
            durationSeconds,
            createdAt: new Date().toISOString(),
          };

          this.state = {
            status: "stopped",
            durationSeconds,
          };

          this.stopResolver?.(result);
        } catch (error) {
          this.stopRejecter?.(error);
        } finally {
          this.cleanup();
        }
      };

      this.recorder.start(250);

      this.state = {
        status: "recording",
        startedAt: Date.now(),
        durationSeconds: 0,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Microphone permission was denied.";

      this.state = {
        status: "failed",
        durationSeconds: 0,
        errorMessage: message,
      };

      this.cleanup();

      throw error;
    }
  }

  pause(): void {
    if (
      !this.recorder ||
      this.recorder.state !== "recording"
    ) {
      throw new Error(
        "There is no active voice recording to pause.",
      );
    }

    this.recorder.pause();

    this.state = {
      ...this.state,
      status: "paused",
      pausedAt: Date.now(),
      durationSeconds:
        this.calculateDurationSeconds(),
    };
  }

  resume(): void {
    if (
      !this.recorder ||
      this.recorder.state !== "paused"
    ) {
      throw new Error(
        "There is no paused voice recording to resume.",
      );
    }

    this.recorder.resume();

    this.state = {
      ...this.state,
      status: "recording",
      pausedAt: undefined,
    };
  }

  stop(): Promise<VoiceRecordingResult> {
    if (
      !this.recorder ||
      this.recorder.state === "inactive"
    ) {
      throw new Error(
        "There is no active voice recording to stop.",
      );
    }

    return new Promise<VoiceRecordingResult>(
      (resolve, reject) => {
        this.stopResolver = resolve;
        this.stopRejecter = reject;
        this.recorder?.stop();
      },
    );
  }

  cancel(): void {
    this.stopResolver = null;
    this.stopRejecter = null;

    if (
      this.recorder &&
      this.recorder.state !== "inactive"
    ) {
      this.recorder.onstop = null;
      this.recorder.stop();
    }

    this.state = {
      status: "idle",
      durationSeconds: 0,
    };

    this.cleanup();
  }

  private calculateDurationSeconds(): number {
    if (!this.state.startedAt) {
      return this.state.durationSeconds;
    }

    const endingTimestamp =
      this.state.pausedAt ?? Date.now();

    return Math.max(
      0,
      Math.round(
        (endingTimestamp - this.state.startedAt) /
          1000,
      ),
    );
  }

  private cleanup(): void {
    for (const track of this.stream?.getTracks() ?? []) {
      track.stop();
    }

    this.stream = null;
    this.recorder = null;
    this.chunks = [];
    this.stopResolver = null;
    this.stopRejecter = null;
  }
}
