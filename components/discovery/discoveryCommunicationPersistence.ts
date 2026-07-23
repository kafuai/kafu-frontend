import type { DiscoveryLocalAttachment } from "./DiscoveryResponseComposer";

import { CommunicationAttachmentService } from "@/src/enterprise/communication-layer/communicationAttachmentService";
import type {
  CommunicationAttachmentType,
  CommunicationMessageType,
} from "@/src/enterprise/communication-layer/communicationModels";
import { CommunicationService } from "@/src/enterprise/communication-layer/communicationService";
import { communicationStorageService } from "@/src/enterprise/communication-layer/communicationStorageService";
import { communicationAttachmentRepository } from "@/src/enterprise/communication-layer/supabaseCommunicationAttachmentRepository";
import { communicationRepository } from "@/src/enterprise/communication-layer/supabaseCommunicationRepository";

const communicationService = new CommunicationService(
  communicationRepository
);

const communicationAttachmentService =
  new CommunicationAttachmentService(
    communicationStorageService,
    communicationAttachmentRepository
  );

type PersistDiscoveryCommunicationInput = {
  companyId: string;
  questions: string[];
  answers: string[];
  attachmentsByQuestion: DiscoveryLocalAttachment[][];
};

export type PersistDiscoveryCommunicationResult = {
  conversationId: string;
  messageCount: number;
  attachmentCount: number;
};

function resolveAttachmentType(
  attachment: DiscoveryLocalAttachment
): CommunicationAttachmentType {
  if (
    attachment.kind === "voice" ||
    attachment.mimeType.startsWith("audio/")
  ) {
    return "audio";
  }

  if (attachment.mimeType.startsWith("image/")) {
    return "image";
  }

  if (attachment.mimeType.startsWith("video/")) {
    return "video";
  }

  if (
    attachment.mimeType.includes("zip") ||
    attachment.mimeType.includes("rar") ||
    attachment.mimeType.includes("compressed")
  ) {
    return "archive";
  }

  if (
    attachment.mimeType.includes("pdf") ||
    attachment.mimeType.includes("document") ||
    attachment.mimeType.includes("sheet") ||
    attachment.mimeType.includes("presentation") ||
    attachment.mimeType.startsWith("text/")
  ) {
    return "document";
  }

  return "other";
}

function resolveMessageType(
  answer: string,
  attachments: DiscoveryLocalAttachment[]
): CommunicationMessageType {
  if (answer.trim()) {
    return "text";
  }

  if (
    attachments.some(
      (attachment) => attachment.kind === "voice"
    )
  ) {
    return "voice";
  }

  if (
    attachments.some((attachment) =>
      attachment.mimeType.startsWith("image/")
    )
  ) {
    return "image";
  }

  return "file";
}

export async function persistDiscoveryCommunication({
  companyId,
  questions,
  answers,
  attachmentsByQuestion,
}: PersistDiscoveryCommunicationInput): Promise<PersistDiscoveryCommunicationResult> {
  const conversation =
    await communicationService.createConversation({
      companyId,
      conversationType: "corporate_brain",
      channel: "platform",
      title: "Executive Discovery Session",
      createdByName: "Executive User",
      metadata: {
        source: "discovery",
        module: "executive-discovery",
        questionCount: questions.length,
        startedAt: new Date().toISOString(),
      },
    });

  let messageCount = 0;
  let attachmentCount = 0;

  for (let index = 0; index < questions.length; index += 1) {
    const answer = answers[index]?.trim() ?? "";
    const attachments = attachmentsByQuestion[index] ?? [];

    if (!answer && attachments.length === 0) {
      continue;
    }

    const messageType = resolveMessageType(
      answer,
      attachments
    );

    const message = await communicationService.sendMessage({
      companyId,
      conversationId: conversation.id,
      senderType: "user",
      senderName: "Executive User",
      messageType,
      content: answer || undefined,
      metadata: {
        source: "discovery",
        module: "executive-discovery",
        question: questions[index],
        questionOrder: index + 1,
        hasTextAnswer: Boolean(answer),
        attachmentCount: attachments.length,
      },
    });

    messageCount += 1;

    for (const attachment of attachments) {
      await communicationAttachmentService.uploadAndRegister({
        companyId,
        conversationId: conversation.id,
        messageId: message.id,
        file: attachment.file,
        fileName: attachment.name,
        attachmentType:
          resolveAttachmentType(attachment),
        durationSeconds: attachment.durationSeconds,
        uploadedByName: "Executive User",
      });

      attachmentCount += 1;
    }
  }

  return {
    conversationId: conversation.id,
    messageCount,
    attachmentCount,
  };
}
