import { Bot, Send, Sparkles, UserRound } from "lucide-react";
import { FormEvent } from "react";
import { ChatMessage, SickFormState } from "./types";
import { useAppCopy } from "./useAppCopy";
import { CategoryIcon } from "./SharedUI";
import SickLeaveForm from "./SickLeaveForm";

export default function ChatArea({
  isArabic,
  messages,
  input,
  setInput,
  isTyping,
  handleSubmit,
  setSickFormState,
  handleSickSuccess,
}: {
  isArabic: boolean;
  messages: ChatMessage[];
  input: string;
  setInput: (v: string) => void;
  isTyping: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setSickFormState: (id: string, state: SickFormState) => void;
  handleSickSuccess: (id: string, text: string) => void;
}) {
  const { copy, categoryLabels } = useAppCopy(isArabic);

  return (
    <div className="flex h-[680px] self-start sticky top-6 flex-col overflow-hidden rounded-[26px] border border-[var(--border)] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[var(--brand-primary)]">
            <Bot size={20} strokeWidth={1.8} />
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{copy.chatHeaderTitle}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{copy.chatHeaderSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[linear-gradient(to_bottom,#ffffff,#fbfcfe)] px-4 py-6 sm:px-7">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {messages.map((message) => {
            const isUser = message.type === "user";

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2.5 ${isUser ? "justify-start" : "justify-end"}`}
              >
                {!isUser && (
                  <div className="order-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white">
                    <Bot size={16} strokeWidth={1.8} />
                  </div>
                )}

                <div className={`order-1 ${message.sickForm ? "w-full max-w-[85%] sm:max-w-[480px]" : "max-w-[85%] sm:max-w-[72%]"}`}>
                  <div
                    className={`rounded-[20px] px-4 py-3.5 text-sm leading-7 ${
                      isUser
                        ? "rounded-bl-md bg-[var(--brand-primary)] text-white"
                        : "rounded-br-md border border-slate-100 bg-white text-slate-700 shadow-[0_4px_18px_rgba(15,23,42,0.045)]"
                    }`}
                  >
                    {message.content.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        {index !== message.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}

                    {message.sickForm && (
                      <SickLeaveForm
                        isArabic={isArabic}
                        state={message.sickForm}
                        onCancel={() => setSickFormState(message.id, "cancelled")}
                        onSuccess={(text) => handleSickSuccess(message.id, text)}
                      />
                    )}
                  </div>

                  <div className={`mt-1.5 flex items-center gap-2 px-1 text-[10px] text-slate-400 ${isUser ? "justify-start" : "justify-end"}`}>
                    {message.category && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                          isUser ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-[var(--brand-primary)]"
                        }`}
                      >
                        <CategoryIcon category={message.category} />
                        {categoryLabels[message.category]}
                      </span>
                    )}
                    <span>{message.time}</span>
                  </div>
                </div>

                {isUser && (
                  <div className="order-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <UserRound size={16} strokeWidth={1.8} />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-end justify-end gap-2.5">
              <div className="max-w-[72%] rounded-[20px] rounded-br-md border border-slate-100 bg-white px-5 py-4 shadow-[0_4px_18px_rgba(15,23,42,0.045)]">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white">
                <Bot size={16} strokeWidth={1.8} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-slate-100 bg-white px-4 py-4 sm:px-6">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="relative flex items-end gap-2 rounded-[20px] border border-slate-200 bg-slate-50 p-2 transition focus-within:border-[var(--brand-primary)] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={1}
              placeholder={copy.inputPlaceholder}
              className="min-h-[48px] flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[var(--brand-primary)] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={18} strokeWidth={2} />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between px-1">
            <p className="text-[10px] text-slate-400">{copy.sendHint}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Sparkles size={12} />
              {copy.poweredByAI}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}