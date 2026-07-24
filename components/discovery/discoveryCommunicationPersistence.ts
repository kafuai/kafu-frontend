import type { DiscoveryLocalAttachment } from "./DiscoveryResponseComposer";

import type {
  CommunicationMessage,
} from "@/src/enterprise/communicationLayer/communicationTypes";
import {
  communicationRuntime,
} from "@/src/enterprise/communicationLayer/communicationRuntime";
import {
  communicationUploadService,
} from "@/src/enterprise/communicationLayer/storage/communicationStorageRuntime";

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

function resolveMessageType(
  answer: string,
  attachments: DiscoveryLocalAttachment[],
): CommunicationMessage["type"] {
  if (answer.trim()) {
    return "text";
  }

  if (
    attachments.some(
      (attachment) =>
        attachment.kind === "voice" ||
        attachment.mimeType.startsWith("audio/"),
    )
  ) {
    return "voice";
  }

  if (
    attachments.some((attachment) =>
      attachment.mimeType.startsWith("image/"),
    )
  ) {
    return "image";
  }

  return "document";
}

function createMessageContent(
  question: string,
  answer: string,
  attachments: DiscoveryLocalAttachment[],
): string {
  const normalizedQuestion = question.trim();
  const normalizedAnswer = answer.trim();

  if (normalizedAnswer) {
    return normalizedQuestion
      ? `${normalizedQuestion}\n\n${normalizedAnswer}`
      : normalizedAnswer;
  }

  const attachmentLabel =
    attachments.length === 1
      ? "Attachment response"
      : `${attachments.length} attachment responses`;

  return normalizedQuestion
    ? `${normalizedQuestion}\n\n${attachmentLabel}`
    : attachmentLabel;
}

export async function persistDiscoveryCommunication({
  companyId,
  questions,
  answers,
  attachmentsByQuestion,
}: PersistDiscoveryCommunicationInput): Promise<PersistDiscoveryCommunicationResult> {
  const conversationId = crypto.randomUUID();
  const senderId = "executive-user";

  const conversation =
    await communicationRuntime.service.createConversation({
      id: conversationId,
      companyId,
      tenantId: companyId,
      organizationId: companyId,
      createdBy: senderId,
      channel: "web",
      subject: "Executive Discovery Session",
      priority: "normal",
      tags: [
        "discovery",
        "executive-discovery",
        "corporate-brain",
      ],
    });

  let messageCount = 0;
  let attachmentCount = 0;

  for (
    let index = 0;
    index < questions.length;
    index += 1
  ) {
    const question = questions[index] ?? "";
    const answer = answers[index]?.trim() ?? "";
    const attachments =
      attachmentsByQuestion[index] ?? [];

    if (!answer && attachments.length === 0) {
      continue;
    }

    const messageId = crypto.randomUUID();

    await communicationRuntime.service.createQueuedMessage({
      id: messageId,
      companyId,
      conversationId: conversation.id,
      senderId,
      direction: "outbound",
      type: resolveMessageType(answer, attachments),
      content: createMessageContent(
        question,
        answer,
        attachments,
      ),
    });

    messageCount += 1;

    for (const attachment of attachments) {
      await communicationUploadService.uploadAttachment({
        attachmentId: crypto.randomUUID(),
        companyId,
        conversationId: conversation.id,
        messageId,
        createdBy: senderId,
        file: {
          name: attachment.name,
          type:
            attachment.mimeType ||
            "application/octet-stream",
          size: attachment.sizeBytes,
          data: attachment.file,
        },
        durationSeconds:
          attachment.durationSeconds,
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





