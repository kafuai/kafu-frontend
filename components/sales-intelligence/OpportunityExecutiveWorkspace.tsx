"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Sparkles,
  Target,
  UserRound,
  Video,
  X,
} from "lucide-react";

import {
  loadOpportunityNextActions,
  loadSalesOpportunityActivityTimeline,
  loadSalesOpportunityLifecycle,
} from "@/app/actions/sales";

import type {
  OpportunityLifecycleEvent,
  OpportunityLifecycleSnapshot,
} from "@/src/enterprise/sales-intelligence/opportunity-lifecycle/opportunityLifecycleTypes";

import type {
  OpportunityNextActionSnapshot,
} from "@/src/enterprise/sales-intelligence/next-actions/opportunityNextActionTypes";

import type {
  UnifiedActivityItem,
  UnifiedActivitySnapshot,
} from "@/src/enterprise/sales-intelligence/activity-engine/unifiedActivityTypes";

import type {
  SalesOpportunity,
  SalesPipelineNextAction,
} from "@/src/enterprise/sales-intelligence/salesIntelligenceTypes";

import styles from "./SalesIntelligenceDashboard.module.css";

type OpportunityExecutiveWorkspaceProps = {
  opportunity: SalesOpportunity;
  onClose: () => void;
  onOpenCommunication: (
    opportunityId: string,
    companyName: string,
  ) => void;
  communicationPending: boolean;
};

type WorkspaceState = {
  lifecycle: OpportunityLifecycleSnapshot | null;
  nextActions: OpportunityNextActionSnapshot | null;
  activity: UnifiedActivitySnapshot | null;
  loading: boolean;
  error: string;
};

const dateFormatter = new Intl.DateTimeFormat("ar-BH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ar-BH", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat("ar-BH", {
  maximumFractionDigits: 0,
});

const initialState: WorkspaceState = {
  lifecycle: null,
  nextActions: null,
  activity: null,
  loading: true,
  error: "",
};

function formatCurrency(value: number): string {
  return `${currencyFormatter.format(value)} د.ب`;
}

function getPriorityLabel(
  priority: SalesPipelineNextAction["priority"],
): string {
  const labels = {
    low: "منخفضة",
    medium: "متوسطة",
    high: "عالية",
    critical: "حرجة",
  };

  return labels[priority];
}

function getActionStatusLabel(
  status: SalesPipelineNextAction["status"],
): string {
  const labels = {
    open: "مفتوحة",
    in_progress: "قيد التنفيذ",
    completed: "مكتملة",
    cancelled: "ملغاة",
  };

  return labels[status];
}

function getActivityIcon(item: UnifiedActivityItem) {
  if (item.channel === "email") {
    return <Mail size={16} aria-hidden="true" />;
  }

  if (item.channel === "whatsapp") {
    return <MessageCircle size={16} aria-hidden="true" />;
  }

  if (item.channel === "phone") {
    return <Phone size={16} aria-hidden="true" />;
  }

  if (item.channel === "video") {
    return <Video size={16} aria-hidden="true" />;
  }

  if (item.channel === "in_person") {
    return <UserRound size={16} aria-hidden="true" />;
  }

  if (item.source === "next_action") {
    return <Target size={16} aria-hidden="true" />;
  }

  return <Activity size={16} aria-hidden="true" />;
}

function getLifecycleTitle(
  event: OpportunityLifecycleEvent,
): string {
  if (event.kind === "stage_change") {
    return `انتقال المرحلة إلى ${event.newStatus}`;
  }

  return event.title;
}

function getLifecycleDescription(
  event: OpportunityLifecycleEvent,
): string {
  if (event.kind === "stage_change") {
    const previousStatus =
      event.previousStatus || "البداية";

    return event.reason?.trim() ||
      `تم تغيير مرحلة الفرصة من ${previousStatus} إلى ${event.newStatus}.`;
  }

  return event.description?.trim() ||
    "تم تسجيل نشاط جديد على الفرصة.";
}

function isActionOverdue(
  action: SalesPipelineNextAction,
): boolean {
  if (
    action.status === "completed" ||
    action.status === "cancelled"
  ) {
    return false;
  }

  return new Date(action.dueAt).getTime() < Date.now();
}

export default function OpportunityExecutiveWorkspace({
  opportunity,
  onClose,
  onOpenCommunication,
  communicationPending,
}: OpportunityExecutiveWorkspaceProps) {
  const [state, setState] =
    useState<WorkspaceState>(initialState);

  const loadWorkspace = useCallback(async () => {
    setState((current) => ({
      ...current,
      loading: true,
      error: "",
    }));

    try {
      const [lifecycle, nextActions, activity] =
        await Promise.all([
          loadSalesOpportunityLifecycle(opportunity.id),
          loadOpportunityNextActions({
            pipelineId: opportunity.id,
            includeCompleted: true,
          }),
          loadSalesOpportunityActivityTimeline({
            pipelineId: opportunity.id,
            includeCompletedActions: true,
            limit: 50,
          }),
        ]);

      setState({
        lifecycle,
        nextActions,
        activity,
        loading: false,
        error: "",
      });
    } catch (error) {
      setState({
        lifecycle: null,
        nextActions: null,
        activity: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "تعذر تحميل مساحة العمل التنفيذية للفرصة.",
      });
    }
  }, [opportunity.id]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const overdueActions = useMemo(
    () =>
      state.nextActions?.actions.filter(isActionOverdue) || [],
    [state.nextActions],
  );

  const openActions = useMemo(
    () =>
      state.nextActions?.actions.filter(
        (action) =>
          action.status === "open" ||
          action.status === "in_progress",
      ) || [],
    [state.nextActions],
  );

  const lifecycleEvents = useMemo(
    () => state.lifecycle?.events.slice(0, 8) || [],
    [state.lifecycle],
  );

  const activityItems = useMemo(
    () => state.activity?.items.slice(0, 12) || [],
    [state.activity],
  );

  const primaryAction =
    state.nextActions?.primaryAction || null;

  return (
    <section
      className={styles.executiveWorkspace}
      aria-labelledby="opportunity-workspace-title"
    >
      <div className={styles.executiveWorkspaceHeader}>
        <div className={styles.executiveWorkspaceIdentity}>
          <span className={styles.executiveWorkspaceIcon}>
            <Sparkles size={20} aria-hidden="true" />
          </span>

          <div>
            <span className={styles.sectionEyebrow}>
              Executive Opportunity Workspace
            </span>

            <h2 id="opportunity-workspace-title">
              {opportunity.companyName}
            </h2>

            <p>
              {opportunity.opportunityName}
            </p>
          </div>
        </div>

        <div className={styles.executiveWorkspaceActions}>
          <button
            type="button"
            className={styles.communicationButton}
            disabled={communicationPending}
            onClick={() =>
              onOpenCommunication(
                opportunity.id,
                opportunity.companyName,
              )
            }
          >
            <MessageCircle size={15} aria-hidden="true" />
            {communicationPending
              ? "جارٍ فتح التواصل..."
              : "فتح التواصل"}
          </button>

          <button
            type="button"
            className={styles.workspaceCloseButton}
            aria-label="إغلاق تفاصيل الفرصة"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.workspaceSummaryGrid}>
        <article className={styles.workspaceSummaryCard}>
          <span>قيمة الفرصة</span>
          <strong>{formatCurrency(opportunity.value)}</strong>
          <small>{opportunity.probability}% احتمال الإغلاق</small>
        </article>

        <article className={styles.workspaceSummaryCard}>
          <span>المرحلة الحالية</span>
          <strong>{opportunity.statusLabel}</strong>
          <small>
            الإغلاق المتوقع{" "}
            {dateFormatter.format(
              new Date(opportunity.expectedCloseDate),
            )}
          </small>
        </article>

        <article
          className={styles.workspaceSummaryCard}
          data-health={opportunity.health}
        >
          <span>صحة الفرصة</span>
          <strong>
            {opportunity.health === "healthy"
              ? "صحية"
              : opportunity.health === "attention"
                ? "تحتاج متابعة"
                : "معرضة للخطر"}
          </strong>
          <small>{opportunity.ownerName}</small>
        </article>

        <article
          className={styles.workspaceSummaryCard}
          data-alert={overdueActions.length > 0}
        >
          <span>الإجراءات المتأخرة</span>
          <strong>{overdueActions.length}</strong>
          <small>{openActions.length} إجراءات نشطة</small>
        </article>
      </div>

      {state.loading && (
        <div
          className={styles.workspaceStatus}
          aria-live="polite"
        >
          <RefreshCw
            className={styles.workspaceSpinner}
            size={18}
            aria-hidden="true"
          />
          جارٍ تحميل دورة حياة الفرصة وأنشطتها التنفيذية...
        </div>
      )}

      {!state.loading && state.error && (
        <div
          className={styles.workspaceError}
          role="alert"
        >
          <AlertTriangle size={18} aria-hidden="true" />

          <div>
            <strong>تعذر تحميل تفاصيل الفرصة</strong>
            <p>{state.error}</p>
          </div>

          <button
            type="button"
            onClick={() => void loadWorkspace()}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!state.loading && !state.error && (
        <>
          <div className={styles.workspacePrimaryGrid}>
            <article className={styles.workspacePanel}>
              <div className={styles.workspacePanelHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>
                    Primary Next Action
                  </span>
                  <h3>الخطوة التنفيذية التالية</h3>
                </div>

                <Target size={18} aria-hidden="true" />
              </div>

              {primaryAction ? (
                <div
                  className={styles.primaryActionCard}
                  data-priority={primaryAction.priority}
                >
                  <div className={styles.primaryActionHeading}>
                    <div>
                      <strong>{primaryAction.title}</strong>
                      <span>
                        {getPriorityLabel(
                          primaryAction.priority,
                        )}
                      </span>
                    </div>

                    <span
                      className={styles.actionStatusBadge}
                      data-status={primaryAction.status}
                    >
                      {getActionStatusLabel(
                        primaryAction.status,
                      )}
                    </span>
                  </div>

                  {primaryAction.description && (
                    <p>{primaryAction.description}</p>
                  )}

                  <div className={styles.primaryActionMeta}>
                    <span>
                      <CalendarClock
                        size={14}
                        aria-hidden="true"
                      />
                      {dateTimeFormatter.format(
                        new Date(primaryAction.dueAt),
                      )}
                    </span>

                    <span>
                      <UserRound
                        size={14}
                        aria-hidden="true"
                      />
                      {primaryAction.ownerName ||
                        opportunity.ownerName}
                    </span>
                  </div>

                  {isActionOverdue(primaryAction) && (
                    <div className={styles.overdueIndicator}>
                      <AlertTriangle
                        size={14}
                        aria-hidden="true"
                      />
                      تجاوز هذا الإجراء موعده المحدد
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.workspaceEmptyState}>
                  <Circle size={18} aria-hidden="true" />
                  <p>
                    لا توجد خطوة رئيسية مفتوحة لهذه الفرصة.
                  </p>
                </div>
              )}

              <div className={styles.aiInsight}>
                <span>
                  <Bot size={17} aria-hidden="true" />
                </span>

                <div>
                  <strong>رؤية KAFU AI التنفيذية</strong>
                  <p>{opportunity.aiInsight}</p>
                </div>
              </div>
            </article>

            <article className={styles.workspacePanel}>
              <div className={styles.workspacePanelHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>
                    Action Control
                  </span>
                  <h3>الإجراءات المفتوحة والمتأخرة</h3>
                </div>

                <Clock3 size={18} aria-hidden="true" />
              </div>

              <div className={styles.workspaceActionList}>
                {openActions.slice(0, 6).map((action) => (
                  <div
                    className={styles.workspaceActionItem}
                    data-overdue={isActionOverdue(action)}
                    key={action.id}
                  >
                    <span className={styles.workspaceActionIcon}>
                      {isActionOverdue(action) ? (
                        <AlertTriangle
                          size={15}
                          aria-hidden="true"
                        />
                      ) : (
                        <CheckCircle2
                          size={15}
                          aria-hidden="true"
                        />
                      )}
                    </span>

                    <div>
                      <strong>{action.title}</strong>
                      <small>
                        {dateTimeFormatter.format(
                          new Date(action.dueAt),
                        )}
                      </small>
                    </div>

                    <span
                      className={styles.priorityBadge}
                      data-priority={action.priority}
                    >
                      {getPriorityLabel(action.priority)}
                    </span>
                  </div>
                ))}

                {openActions.length === 0 && (
                  <div className={styles.workspaceEmptyState}>
                    <CheckCircle2
                      size={18}
                      aria-hidden="true"
                    />
                    <p>
                      لا توجد إجراءات مفتوحة حاليًا.
                    </p>
                  </div>
                )}
              </div>
            </article>
          </div>

          <div className={styles.workspaceTimelineGrid}>
            <article className={styles.workspacePanel}>
              <div className={styles.workspacePanelHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>
                    Opportunity Lifecycle
                  </span>
                  <h3>دورة حياة الفرصة</h3>
                </div>

                <ArrowRight size={18} aria-hidden="true" />
              </div>

              <div className={styles.lifecycleTimeline}>
                {lifecycleEvents.map((event) => (
                  <div
                    className={styles.lifecycleEvent}
                    key={`${event.kind}-${event.id}`}
                  >
                    <span className={styles.lifecycleMarker}>
                      {event.kind === "stage_change" ? (
                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                        />
                      ) : (
                        <Activity
                          size={14}
                          aria-hidden="true"
                        />
                      )}
                    </span>

                    <div>
                      <div>
                        <strong>
                          {getLifecycleTitle(event)}
                        </strong>

                        <time dateTime={event.occurredAt}>
                          {dateTimeFormatter.format(
                            new Date(event.occurredAt),
                          )}
                        </time>
                      </div>

                      <p>
                        {getLifecycleDescription(event)}
                      </p>
                    </div>
                  </div>
                ))}

                {lifecycleEvents.length === 0 && (
                  <div className={styles.workspaceEmptyState}>
                    <Activity size={18} aria-hidden="true" />
                    <p>
                      لم يتم تسجيل أحداث دورة حياة بعد.
                    </p>
                  </div>
                )}
              </div>
            </article>

            <article className={styles.workspacePanel}>
              <div className={styles.workspacePanelHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>
                    Unified Activity
                  </span>
                  <h3>التسلسل الموحد للأنشطة</h3>
                </div>

                <Activity size={18} aria-hidden="true" />
              </div>

              {state.activity && (
                <div className={styles.activitySummary}>
                  <span>
                    <strong>
                      {state.activity.summary.totalItems}
                    </strong>
                    إجمالي الأحداث
                  </span>

                  <span>
                    <strong>
                      {
                        state.activity.summary
                          .communicationCount
                      }
                    </strong>
                    تواصل
                  </span>

                  <span>
                    <strong>
                      {
                        state.activity.summary
                          .openActionCount
                      }
                    </strong>
                    إجراء مفتوح
                  </span>
                </div>
              )}

              <div className={styles.unifiedTimeline}>
                {activityItems.map((item) => (
                  <div
                    className={styles.unifiedTimelineItem}
                    key={`${item.source}-${item.id}`}
                  >
                    <span className={styles.unifiedTimelineIcon}>
                      {getActivityIcon(item)}
                    </span>

                    <div>
                      <div>
                        <strong>{item.title}</strong>

                        <time dateTime={item.occurredAt}>
                          {dateTimeFormatter.format(
                            new Date(item.occurredAt),
                          )}
                        </time>
                      </div>

                      {item.description && (
                        <p>{item.description}</p>
                      )}

                      <small>
                        {item.ownerName ||
                          (item.source === "next_action"
                            ? opportunity.ownerName
                            : "KAFU AI")}
                      </small>
                    </div>
                  </div>
                ))}

                {activityItems.length === 0 && (
                  <div className={styles.workspaceEmptyState}>
                    <Activity size={18} aria-hidden="true" />
                    <p>
                      لا توجد أنشطة موحدة لهذه الفرصة بعد.
                    </p>
                  </div>
                )}
              </div>
            </article>
          </div>
        </>
      )}
    </section>
  );
}
