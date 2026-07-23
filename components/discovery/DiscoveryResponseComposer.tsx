"use client";

import {
  FileAudio,
  FileText,
  Mic,
  Paperclip,
  Play,
  Square,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  VoiceRecorderController,
  type VoiceRecordingResult,
} from "@/src/enterprise/communication-layer/voiceRecorderController";

export type DiscoveryLocalAttachment = {
  id: string;
  kind: "file" | "voice";
  file: File;
  name: string;
  mimeType: string;
  sizeBytes: number;
  durationSeconds?: number;
  previewUrl?: string;
};

type DiscoveryResponseComposerProps = {
  answer: string;
  attachments: DiscoveryLocalAttachment[];
  disabled?: boolean;
  onAnswerChange: (value: string) => void;
  onAttachmentsChange: (
    attachments: DiscoveryLocalAttachment[]
  ) => void;
};

const ACCEPTED_FILE_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".csv",
  ".txt",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
].join(",");

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${Math.round(sizeBytes / 1024)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds = 0): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function createVoiceAttachment(
  result: VoiceRecordingResult
): DiscoveryLocalAttachment {
  const file = new File([result.blob], result.fileName, {
    type: result.mimeType,
  });

  return {
    id: crypto.randomUUID(),
    kind: "voice",
    file,
    name: result.fileName,
    mimeType: result.mimeType,
    sizeBytes: result.blob.size,
    durationSeconds: result.durationSeconds,
    previewUrl: URL.createObjectURL(result.blob),
  };
}

export default function DiscoveryResponseComposer({
  answer,
  attachments,
  disabled = false,
  onAnswerChange,
  onAttachmentsChange,
}: DiscoveryResponseComposerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const recorderRef = useRef<VoiceRecorderController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceError, setVoiceError] = useState("");

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      recorderRef.current?.cancel();
    };
  }, []);

  function handleFilesSelected(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const newAttachments: DiscoveryLocalAttachment[] =
      selectedFiles.map((file) => ({
        id: crypto.randomUUID(),
        kind: "file",
        file,
        name: file.name,
        mimeType:
          file.type || "application/octet-stream",
        sizeBytes: file.size,
      }));

    onAttachmentsChange([
      ...attachments,
      ...newAttachments,
    ]);

    event.target.value = "";
  }

  async function startRecording() {
    setVoiceError("");

    try {
      const controller = new VoiceRecorderController();

      recorderRef.current = controller;

      await controller.start();

      setRecordingSeconds(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        const snapshot = controller.getSnapshot();

        setRecordingSeconds(snapshot.durationSeconds);
      }, 500);
    } catch (error) {
      setVoiceError(
        error instanceof Error
          ? error.message
          : "تعذر بدء التسجيل الصوتي."
      );

      setIsRecording(false);
    }
  }

  async function stopRecording() {
    const controller = recorderRef.current;

    if (!controller) {
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      const result = await controller.stop();
      const voiceAttachment =
        createVoiceAttachment(result);

      onAttachmentsChange([
        ...attachments,
        voiceAttachment,
      ]);

      setRecordingSeconds(0);
      setIsRecording(false);
      recorderRef.current = null;
    } catch (error) {
      setVoiceError(
        error instanceof Error
          ? error.message
          : "تعذر إنهاء التسجيل الصوتي."
      );

      setIsRecording(false);
    }
  }

  function cancelRecording() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    recorderRef.current?.cancel();
    recorderRef.current = null;

    setRecordingSeconds(0);
    setIsRecording(false);
    setVoiceError("");
  }

  function removeAttachment(id: string) {
    const attachment = attachments.find(
      (item) => item.id === id
    );

    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }

    onAttachmentsChange(
      attachments.filter((item) => item.id !== id)
    );
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="relative">
        <textarea
          value={answer}
          disabled={disabled}
          onChange={(event) =>
            onAnswerChange(event.target.value)
          }
          rows={8}
          placeholder="اكتب إجابتك التنفيذية هنا..."
          className="min-h-[220px] w-full resize-y rounded-[22px] border border-slate-200 bg-white px-6 py-5 text-base font-medium leading-8 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
        />

                <div className="pointer-events-none absolute bottom-4 left-5 text-xs font-bold text-slate-400">
          {answer.length.toLocaleString("ar")} حرف
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200 px-5 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {!isRecording && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="إرفاق ملف"
            >
              <Paperclip size={18} />
            </button>
          )}

          {!isRecording ? (
            <button
              type="button"
              disabled={disabled}
              onClick={startRecording}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="بدء التسجيل الصوتي"
            >
              <Mic size={18} />
            </button>
          ) : (
            <div className="flex min-h-12 min-w-0 flex-1 items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4">
              <span className="inline-flex min-w-0 items-center gap-2 text-sm font-black text-red-700">
                <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-500" />

                <span className="truncate">جارٍ التسجيل</span>

                <span dir="ltr" className="shrink-0">
                  {formatDuration(recordingSeconds)}
                </span>
              </span>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={stopRecording}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
                  aria-label="إيقاف التسجيل"
                >
                  <Square size={15} fill="currentColor" />
                </button>

                <button
                  type="button"
                  onClick={cancelRecording}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
                  aria-label="إلغاء التسجيل"
                >
                  <X size={17} />
                </button>
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleFilesSelected}
            className="hidden"
          />
        </div>
      </div>

      {voiceError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {voiceError}
        </p>
      )}

      {attachments.length > 0 && (
        <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <UploadCloud
                size={18}
                className="text-emerald-600"
              />

              <h3 className="text-sm font-black text-slate-900">
                المواد الداعمة
              </h3>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">
              {attachments.length}
            </span>
          </div>

          <div className="space-y-3">
            {attachments.map((attachment) => (
              <article
                key={attachment.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    {attachment.kind === "voice" ? (
                      <FileAudio size={19} />
                    ) : (
                      <FileText size={19} />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-900">
                      {attachment.kind === "voice"
                        ? "إجابة صوتية"
                        : attachment.name}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-400">
                      {formatFileSize(
                        attachment.sizeBytes
                      )}

                      {attachment.durationSeconds !==
                        undefined &&
                        ` • ${formatDuration(
                          attachment.durationSeconds
                        )}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      removeAttachment(attachment.id)
                    }
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="حذف المرفق"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {attachment.kind === "voice" &&
                  attachment.previewUrl && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                      <Play
                        size={16}
                        className="shrink-0 text-emerald-700"
                      />

                      <audio
                        controls
                        preload="metadata"
                        src={attachment.previewUrl}
                        className="h-9 w-full"
                      />
                    </div>
                  )}
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
