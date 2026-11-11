"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  Bot,
  CheckCheck,
  CircleAlert,
  Clock3,
  Inbox,
  LoaderCircle,
  Mail,
  MessageCircle,
  MessagesSquare,
  Mic,
  PanelRightClose,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { resolveWorkspaceIdentity } from "@/lib/workspace-identity/tenantResolver";
import {
  communicationRepository,
} from "@/src/enterprise/communicationLayer/supabaseCommunicationRepository";
import {
  communicationRuntime,
} from "@/src/enterprise/communicationLayer/communicationRuntime";

import type {
  CommunicationConversation,
  CommunicationMessage,
} from "@/src/enterprise/communicationLayer/communicationTypes";

import styles from "./CommunicationWorkspace.module.css";

type WorkspaceIdentity = {
  companyId: string;
  userId: string;
  userName: string;
};

type WorkspaceStatus =
  | "loading"
  | "ready"
  | "empty"
  | "error";

const channelLabels: Partial<Record<
  CommunicationConversation["channel"],
  string
>> = {
  internal_chat: "محادثة داخلية",
  web: "محادثة ذكية",
  email: "البريد الإلكتروني",
  whatsapp: "واتساب",
  voice: "رسالة صوتية",
};

function formatConversationTime(value?: string): string {
  if (!value) {
    return "لا توجد رسائل";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "غير محدد";
  }

  return new Intl.DateTimeFormat("ar-BH", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatMessageTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ar-BH", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getChannelIcon(
  channel: CommunicationConversation["channel"],
) {
  switch (channel) {
    case "email":
      return <Mail size={16} aria-hidden="true" />;

    case "whatsapp":
      return <MessageCircle size={16} aria-hidden="true" />;

    case "voice":
      return <Mic size={16} aria-hidden="true" />;

    case "web":
      return <Bot size={16} aria-hidden="true" />;

    default:
      return <MessagesSquare size={16} aria-hidden="true" />;
  }
}

function getDeliveryIcon(
  status: CommunicationMessage["deliveryStatus"],
) {
  if (
    status === "delivered" ||
    status === "read"
  ) {
    return <CheckCheck size={13} aria-hidden="true" />;
  }

  if (
    status === "queued" ||
    status === "sending"
  ) {
    return <Clock3 size={13} aria-hidden="true" />;
  }

  if (status === "failed") {
    return <CircleAlert size={13} aria-hidden="true" />;
  }

  return null;
}

function createMessageId(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return [
    "communication-message",
    Date.now().toString(36),
    Math.random().toString(36).slice(2),
  ].join("-");
}

export default function CommunicationWorkspace() {
  const searchParams = useSearchParams();

  const requestedConversationId =
    searchParams.get("conversation");

  const messageEndRef =
    useRef<HTMLDivElement | null>(null);

  const [identity, setIdentity] =
    useState<WorkspaceIdentity | null>(null);

  const [conversations, setConversations] =
    useState<readonly CommunicationConversation[]>([]);

  const [messages, setMessages] =
    useState<readonly CommunicationMessage[]>([]);

  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(
      requestedConversationId,
    );

  const [status, setStatus] =
    useState<WorkspaceStatus>("loading");

  const [error, setError] =
    useState<string | null>(null);

  const [searchValue, setSearchValue] =
    useState("");

  const [messageValue, setMessageValue] =
    useState("");

  const [isSending, setIsSending] =
    useState(false);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) =>
          conversation.id === activeConversationId,
      ) ?? null,
    [activeConversationId, conversations],
  );

  const filteredConversations = useMemo(() => {
    const normalizedSearch =
      searchValue.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const searchableValue = [
        conversation.subject,
        channelLabels[conversation.channel] ?? conversation.channel,
        conversation.externalReferenceId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return searchableValue.includes(normalizedSearch);
    });
  }, [conversations, searchValue]);

  const loadMessages = useCallback(
    async (
      companyId: string,
      conversationId: string,
    ) => {
      const loadedMessages =
        await communicationRepository.listMessages({
          companyId,
          conversationId,
          limit: 300,
        });

      setMessages(loadedMessages);
    },
    [],
  );

  const loadConversations = useCallback(
    async (
      companyId: string,
      preferredConversationId?: string | null,
    ) => {
      const loadedConversations =
        await communicationRepository.listConversations({
          companyId,
          limit: 200,
        });

      setConversations(loadedConversations);

      if (loadedConversations.length === 0) {
        setActiveConversationId(null);
        setMessages([]);
        setStatus("empty");
        return;
      }

      const preferredConversation =
        preferredConversationId
          ? loadedConversations.find(
              (conversation) =>
                conversation.id ===
                preferredConversationId,
            )
          : null;

      const nextConversation =
        preferredConversation ??
        loadedConversations[0];

      setActiveConversationId(
        nextConversation.id,
      );

      await loadMessages(
        companyId,
        nextConversation.id,
      );

      setStatus("ready");
    },
    [loadMessages],
  );

  const initializeWorkspace =
    useCallback(async () => {
      setStatus("loading");
      setError(null);

      try {
        const {
          data: userData,
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !userData.user) {
          throw new Error(
            "تعذر التحقق من المستخدم الحالي.",
          );
        }

        const workspaceIdentity =
          await resolveWorkspaceIdentity(supabase);

        const userName =
          userData.user.user_metadata?.full_name ??
          userData.user.user_metadata?.name ??
          userData.user.email?.split("@")[0] ??
          "KAFU User";

        const nextIdentity: WorkspaceIdentity = {
          companyId: workspaceIdentity.companyId,
          userId: userData.user.id,
          userName,
        };

        setIdentity(nextIdentity);

        await loadConversations(
          nextIdentity.companyId,
          requestedConversationId,
        );
      } catch (workspaceError) {
        console.error(
          "Unable to initialize communication workspace:",
          workspaceError,
        );

        setStatus("error");
        setError(
          workspaceError instanceof Error
            ? workspaceError.message
            : "تعذر تحميل مركز التواصل.",
        );
      }
    }, [
      loadConversations,
      requestedConversationId,
    ]);

  useEffect(() => {
    void initializeWorkspace();
  }, [initializeWorkspace]);

  useEffect(() => {
    if (!identity) {
      return;
    }

    const realtimeChannel = supabase
      .channel(
        `communication-workspace:${identity.companyId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "communication_conversations",
          filter: `company_id=eq.${identity.companyId}`,
        },
        () => {
          void loadConversations(
            identity.companyId,
            activeConversationId,
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "communication_messages",
          filter: `company_id=eq.${identity.companyId}`,
        },
        (payload) => {
          const nextRecord =
            payload.new as {
              conversation_id?: string;
            };

          const previousRecord =
            payload.old as {
              conversation_id?: string;
            };

          const changedConversationId =
            nextRecord.conversation_id ??
            previousRecord.conversation_id;

          if (
            activeConversationId &&
            changedConversationId ===
              activeConversationId
          ) {
            void loadMessages(
              identity.companyId,
              activeConversationId,
            );
          }

          void loadConversations(
            identity.companyId,
            activeConversationId,
          );
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        realtimeChannel,
      );
    };
  }, [
    activeConversationId,
    identity,
    loadConversations,
    loadMessages,
  ]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  async function selectConversation(
    conversationId: string,
  ) {
    if (!identity) {
      return;
    }

    setActiveConversationId(conversationId);
    setMessages([]);
    setError(null);

    try {
      await loadMessages(
        identity.companyId,
        conversationId,
      );
    } catch (messageError) {
      setError(
        messageError instanceof Error
          ? messageError.message
          : "تعذر تحميل رسائل المحادثة.",
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedMessage =
      messageValue.trim();

    if (
      !identity ||
      !activeConversation ||
      !normalizedMessage ||
      isSending
    ) {
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      await communicationRuntime.application
        .createQueuedMessage({
          id: createMessageId(),
          companyId: identity.companyId,
          conversationId: activeConversation.id,
          senderId: identity.userId,
          content: normalizedMessage,
          type: "text",
          direction:
            activeConversation.channel ===
            "internal_chat"
              ? "internal"
              : "outbound",
        });

      setMessageValue("");

      await Promise.all([
        loadMessages(
          identity.companyId,
          activeConversation.id,
        ),
        loadConversations(
          identity.companyId,
          activeConversation.id,
        ),
      ]);
    } catch (sendError) {
      console.error(
        "Unable to queue communication message:",
        sendError,
      );

      setError(
        sendError instanceof Error
          ? sendError.message
          : "تعذر إرسال الرسالة.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.workspace}>
        <header className={styles.workspaceHeader}>
          <div>
            <span className={styles.eyebrow}>
              <Sparkles size={15} aria-hidden="true" />
              Communication Experience
            </span>

            <h1>مركز التواصل الموحد</h1>

            <p>
              إدارة محادثات العملاء والموظفين والذكاء
              الاصطناعي من مساحة تنفيذية واحدة.
            </p>
          </div>

          <button
            type="button"
            className={styles.refreshButton}
            disabled={status === "loading"}
            onClick={() => {
              void initializeWorkspace();
            }}
          >
            {status === "loading" ? (
              <LoaderCircle
                size={16}
                className={styles.spinner}
                aria-hidden="true"
              />
            ) : (
              <RefreshCw
                size={16}
                aria-hidden="true"
              />
            )}

            تحديث
          </button>
        </header>

        {error && (
          <div
            className={styles.errorNotice}
            role="alert"
          >
            <CircleAlert
              size={17}
              aria-hidden="true"
            />
            {error}
          </div>
        )}

        {status === "loading" && (
          <div
            className={styles.statePanel}
            aria-live="polite"
          >
            <LoaderCircle
              size={28}
              className={styles.spinner}
              aria-hidden="true"
            />
            <strong>
              جارٍ تحميل مركز التواصل
            </strong>
            <span>
              يتم استرجاع المحادثات والرسائل الخاصة
              بمساحة العمل الحالية.
            </span>
          </div>
        )}

        {status === "error" && (
          <div className={styles.statePanel}>
            <CircleAlert
              size={28}
              aria-hidden="true"
            />
            <strong>
              تعذر فتح مركز التواصل
            </strong>
            <span>
              {error ??
                "حدث خطأ غير متوقع أثناء تحميل البيانات."}
            </span>
          </div>
        )}

        {status === "empty" && (
          <div className={styles.statePanel}>
            <Inbox
              size={30}
              aria-hidden="true"
            />
            <strong>
              لا توجد محادثات حتى الآن
            </strong>
            <span>
              افتح إحدى فرص المبيعات ثم اضغط
              «فتح التواصل» لإنشاء أول محادثة.
            </span>
          </div>
        )}

        {status === "ready" && (
          <div className={styles.workspaceGrid}>
            <aside className={styles.inboxPanel}>
              <div className={styles.inboxHeader}>
                <div>
                  <span>Unified Inbox</span>
                  <strong>
                    المحادثات
                  </strong>
                </div>

                <span className={styles.countBadge}>
                  {conversations.length}
                </span>
              </div>

              <label className={styles.searchField}>
                <Search
                  size={15}
                  aria-hidden="true"
                />

                <input
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(
                      event.target.value,
                    );
                  }}
                  placeholder="البحث في المحادثات"
                  aria-label="البحث في المحادثات"
                />
              </label>

              <div className={styles.conversationList}>
                {filteredConversations.map(
                  (conversation) => {
                    const isActive =
                      conversation.id ===
                      activeConversationId;

                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        className={
                          styles.conversationItem
                        }
                        data-active={isActive}
                        onClick={() => {
                          void selectConversation(
                            conversation.id,
                          );
                        }}
                      >
                        <span
                          className={
                            styles.channelIcon
                          }
                          data-channel={
                            conversation.channel
                          }
                        >
                          {getChannelIcon(
                            conversation.channel,
                          )}
                        </span>

                        <span
                          className={
                            styles.conversationContent
                          }
                        >
                          <span
                            className={
                              styles.conversationHeading
                            }
                          >
                            <strong>
                              {conversation.subject ??
                                "محادثة بدون عنوان"}
                            </strong>

                            <time>
                              {formatConversationTime(
                                conversation.lastMessageAt,
                              )}
                            </time>
                          </span>

                          <span
                            className={
                              styles.conversationMeta
                            }
                          >
                            <span>
                              {
                                channelLabels[
                                  conversation.channel
                                ] ?? conversation.channel
                              }
                            </span>

                            <span
                              data-priority={
                                conversation.priority
                              }
                            >
                              {conversation.priority ===
                              "critical"
                                ? "حرجة"
                                : conversation.priority ===
                                    "high"
                                  ? "عالية"
                                  : "عادية"}
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </aside>

            <section className={styles.conversationPanel}>
              {activeConversation ? (
                <>
                  <header
                    className={
                      styles.conversationHeader
                    }
                  >
                    <div
                      className={
                        styles.conversationIdentity
                      }
                    >
                      <span
                        className={
                          styles.conversationAvatar
                        }
                      >
                        {activeConversation.channel ===
                        "web" ? (
                          <Bot
                            size={22}
                            aria-hidden="true"
                          />
                        ) : (
                          <UserRound
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                      </span>

                      <div>
                        <span>
                          {
                            channelLabels[
                              activeConversation.channel
                            ] ?? activeConversation.channel
                          }
                        </span>

                        <h2>
                          {activeConversation.subject ??
                            "محادثة بدون عنوان"}
                        </h2>

                        <small>
                          الحالة:{" "}
                          {activeConversation.status ===
                          "active"
                            ? "نشطة"
                            : activeConversation.status}
                        </small>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={
                        styles.contextButton
                      }
                      title="سياق المحادثة"
                    >
                      <PanelRightClose
                        size={17}
                        aria-hidden="true"
                      />
                      سياق المبيعات
                    </button>
                  </header>

                  <div className={styles.timeline}>
                    {messages.length === 0 ? (
                      <div
                        className={
                          styles.emptyTimeline
                        }
                      >
                        <MessagesSquare
                          size={28}
                          aria-hidden="true"
                        />
                        <strong>
                          بداية المحادثة
                        </strong>
                        <span>
                          أرسل أول رسالة لتفعيل
                          سجل التواصل.
                        </span>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwnMessage =
                          message.senderId ===
                          identity?.userId;

                        return (
                          <article
                            key={message.id}
                            className={
                              styles.messageRow
                            }
                            data-direction={
                              isOwnMessage
                                ? "outbound"
                                : "inbound"
                            }
                          >
                            <div
                              className={
                                styles.messageBubble
                              }
                            >
                              <div
                                className={
                                  styles.messageSender
                                }
                              >
                                <strong>
                                  {isOwnMessage
                                    ? identity?.userName
                                    : message.senderId}
                                </strong>

                                <span>
                                  {formatMessageTime(
                                    message.createdAt,
                                  )}
                                </span>
                              </div>

                              <p>
                                {message.content}
                              </p>

                              <span
                                className={
                                  styles.deliveryStatus
                                }
                                data-status={
                                  message.deliveryStatus
                                }
                              >
                                {getDeliveryIcon(
                                  message.deliveryStatus,
                                )}

                                {message.deliveryStatus ===
                                "read"
                                  ? "مقروءة"
                                  : message.deliveryStatus ===
                                      "delivered"
                                    ? "تم التسليم"
                                    : message.deliveryStatus ===
                                        "sent"
                                      ? "تم الإرسال"
                                      : message.deliveryStatus ===
                                          "failed"
                                        ? "فشل الإرسال"
                                        : "في قائمة الإرسال"}
                              </span>
                            </div>
                          </article>
                        );
                      })
                    )}

                    <div ref={messageEndRef} />
                  </div>

                  <form
                    className={styles.composer}
                    onSubmit={handleSubmit}
                  >
                    <div
                      className={
                        styles.composerHeading
                      }
                    >
                      <div>
                        <strong>
                          إنشاء رسالة
                        </strong>
                        <span>
                          سيتم تسجيل الرسالة في
                          Communication Runtime
                        </span>
                      </div>

                      <span
                        className={
                          styles.channelBadge
                        }
                      >
                        {getChannelIcon(
                          activeConversation.channel,
                        )}
                        {
                          channelLabels[
                            activeConversation.channel
                          ] ?? activeConversation.channel
                        }
                      </span>
                    </div>

                    <textarea
                      value={messageValue}
                      onChange={(event) => {
                        setMessageValue(
                          event.target.value,
                        );
                      }}
                      disabled={isSending}
                      placeholder="اكتب رسالتك هنا..."
                      rows={4}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          !event.shiftKey
                        ) {
                          event.preventDefault();
                          event.currentTarget.form?.requestSubmit();
                        }
                      }}
                    />

                    <div
                      className={
                        styles.composerFooter
                      }
                    >
                      <span>
                        Enter للإرسال • Shift + Enter
                        لسطر جديد
                      </span>

                      <button
                        type="submit"
                        disabled={
                          isSending ||
                          !messageValue.trim()
                        }
                      >
                        {isSending ? (
                          <LoaderCircle
                            size={17}
                            className={
                              styles.spinner
                            }
                            aria-hidden="true"
                          />
                        ) : (
                          <Send
                            size={17}
                            aria-hidden="true"
                          />
                        )}

                        {isSending
                          ? "جارٍ الإرسال"
                          : "إرسال الرسالة"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className={styles.statePanel}>
                  <Inbox
                    size={28}
                    aria-hidden="true"
                  />
                  <strong>
                    اختر محادثة
                  </strong>
                  <span>
                    اختر إحدى المحادثات من صندوق
                    الوارد الموحد.
                  </span>
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
