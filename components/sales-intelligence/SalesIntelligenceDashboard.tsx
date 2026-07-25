"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  Bot,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  CircleAlert,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  Presentation,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Video,
} from "lucide-react";

import {
  openSalesOpportunityConversation,
} from "@/app/actions/sales";

import { useSalesIntelligence } from "./useSalesIntelligence";
import OpportunityExecutiveWorkspace from "./OpportunityExecutiveWorkspace";

import type { SalesOpportunity } from "@/src/enterprise/sales-intelligence/salesIntelligenceTypes";

import type { SalesActivityChannel } from "@/src/enterprise/sales-intelligence/salesIntelligenceConstants";
import type {
  SalesHealthStatus,
  SalesTrendDirection,
} from "@/src/enterprise/sales-intelligence/salesIntelligenceTypes";

import styles from "./SalesIntelligenceDashboard.module.css";

const currencyFormatter = new Intl.NumberFormat("ar-BH", {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("ar-BH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ar-BH", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

function formatCurrency(value: number): string {
  return `${currencyFormatter.format(value)} ط¯.ط¨`;
}

function getTrendIcon(direction: SalesTrendDirection) {
  if (direction === "up") {
    return <ArrowUp size={14} aria-hidden="true" />;
  }

  if (direction === "down") {
    return <ArrowDown size={14} aria-hidden="true" />;
  }

  return <TrendingUp size={14} aria-hidden="true" />;
}

function getHealthLabel(health: SalesHealthStatus): string {
  const labels: Record<SalesHealthStatus, string> = {
    healthy: "طµط­ظٹط©",
    attention: "طھط­طھط§ط¬ ظ…طھط§ط¨ط¹ط©",
    critical: "ظ…ط¹ط±ط¶ط© ظ„ظ„ط®ط·ط±",
  };

  return labels[health];
}

function getChannelIcon(channel: SalesActivityChannel | null) {
  switch (channel) {
    case "email":
      return <Mail size={15} aria-hidden="true" />;
    case "whatsapp":
      return <MessageCircle size={15} aria-hidden="true" />;
    case "phone":
      return <Phone size={15} aria-hidden="true" />;
    case "video":
      return <Video size={15} aria-hidden="true" />;
    case "in_person":
      return <UserRound size={15} aria-hidden="true" />;
    default:
      return <Activity size={15} aria-hidden="true" />;
  }
}

export default function SalesIntelligenceDashboard() {

  const router = useRouter();
const { snapshot, loading, error } = useSalesIntelligence();

  const [isCommunicationPending, startCommunicationTransition] =
    useTransition();

  const [
    activeCommunicationOpportunityId,
    setActiveCommunicationOpportunityId,
  ] = useState<string | null>(null);

  const [communicationMessage, setCommunicationMessage] =
    useState<string | null>(null);

  const [communicationError, setCommunicationError] =
    useState<string | null>(null);

  const [
    selectedOpportunityId,
    setSelectedOpportunityId,
  ] = useState<string | null>(null);

  function handleSelectOpportunity(
    opportunityId: string,
  ): void {
    setSelectedOpportunityId(opportunityId);
  }

  function handleCloseOpportunityWorkspace(): void {
    setSelectedOpportunityId(null);
  }

  function handleOpenCommunication(
    opportunityId: string,
    companyName: string,
  ): void {
    setActiveCommunicationOpportunityId(opportunityId);
    setCommunicationMessage(null);
    setCommunicationError(null);

    startCommunicationTransition(async () => {
      try {
        const result =
          await openSalesOpportunityConversation(opportunityId);

        setCommunicationMessage(
          result.created
            ? `طھظ… ط¥ظ†ط´ط§ط، ظ…ط³ط§ط­ط© ط§ظ„طھظˆط§طµظ„ ط§ظ„ط®ط§طµط© ط¨ظپط±طµط© ${companyName}.`
            : `طھظ… ط§ط³طھط±ط¬ط§ط¹ ظ…ط³ط§ط­ط© ط§ظ„طھظˆط§طµظ„ ط§ظ„ط­ط§ظ„ظٹط© ظ„ظپط±طµط© ${companyName}.`,
        );

        router.push(
          `/communication?conversation=${encodeURIComponent(
            result.conversationId,
          )}`,
        );
      } catch (actionError) {
        setCommunicationError(
          actionError instanceof Error
            ? actionError.message
            : "طھط¹ط°ط± ظپطھط­ ظ…ط³ط§ط­ط© ط§ظ„طھظˆط§طµظ„ ط§ظ„ط®ط§طµط© ط¨ط§ظ„ظپط±طµط©.",
        );
      } finally {
        setActiveCommunicationOpportunityId(null);
      }
    });
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <section className={styles.panel} aria-live="polite">
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                Sales Intelligence
              </span>
              <h2>ط¬ط§ط±ظچ طھط­ظ…ظٹظ„ ط°ظƒط§ط، ط§ظ„ظ…ط¨ظٹط¹ط§طھ</h2>
              <p>
                ظٹطھظ… ط§ظ„ط¢ظ† طھط­ظ„ظٹظ„ ظپط±طµ ط§ظ„ظ…ط¨ظٹط¹ط§طھ ظˆط§ظ„ط£ظ†ط´ط·ط© ظˆط®ط·ظˆط§طھ ط§ظ„ظ…طھط§ط¨ط¹ط©
                ط§ظ„ط®ط§طµط© ط¨ط§ظ„ط´ط±ظƒط© ط§ظ„ط­ط§ظ„ظٹط©.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className={styles.page}>
        <section className={styles.panel} role="alert">
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                Sales Intelligence
              </span>
              <h2>طھط¹ط°ط± طھط­ظ…ظٹظ„ ط°ظƒط§ط، ط§ظ„ظ…ط¨ظٹط¹ط§طھ</h2>
              <p>{error || "ظ„ظ… طھطھظˆظپط± ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط¨ظٹط¹ط§طھ ط§ظ„ظ…ط·ظ„ظˆط¨ط©."}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const {
    metrics,
    pipelineStages,
    forecast,
    recommendations,
    activities,
    generatedAt,
    revenue,
  } = snapshot;

  const opportunities = [...snapshot.opportunities].sort(
    (first, second) =>
      second.probability * second.value -
      first.probability * first.value,
  );

  const activeOpportunities = opportunities.filter(
    (opportunity) =>
      opportunity.status !== "won" &&
      opportunity.status !== "lost",
  );

  const selectedOpportunity: SalesOpportunity | null =
    selectedOpportunityId
      ? opportunities.find(
          (opportunity) =>
            opportunity.id === selectedOpportunityId,
        ) || null
      : null;

  const highPriorityOpportunities = activeOpportunities.filter(
    (opportunity) =>
      opportunity.health === "critical" ||
      opportunity.health === "attention",
  );

  const totalPipelineValue = pipelineStages.reduce(
    (sum, stage) => sum + stage.value,
    0,
  );

  const revenueSummary = revenue.summary;

  const openCriticalRevenueRisks =
    revenueSummary.riskSignals.filter(
      (signal) =>
        signal.level === "critical" &&
        signal.status === "open",
    ).length;

  const openHighRevenueRisks =
    revenueSummary.riskSignals.filter(
      (signal) =>
        signal.level === "high" &&
        signal.status === "open",
    ).length;

  const revenueRiskCount =
    openCriticalRevenueRisks + openHighRevenueRisks;

  const revenueConfidencePercentage = Math.round(
    revenueSummary.forecastConfidence * 100,
  );

  const maxForecastValue = Math.max(
    1,
    ...forecast.map((period) => period.target),
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowIcon}>
              <Sparkles size={15} aria-hidden="true" />
            </span>
            ط°ظƒط§ط، ط§ظ„ظ…ط¨ظٹط¹ط§طھ ط§ظ„ظ…ط¤ط³ط³ظٹ
          </div>

          <h1 className={styles.heroTitle}>
            ط±ط¤ظٹط© ظ…ظˆط­ظ‘ط¯ط© ظ„ط£ط¯ط§ط، ط§ظ„ظ…ط¨ظٹط¹ط§طھ ظˆط§ظ„ظپط±طµ ط§ظ„ظ‚ط§ط¯ظ…ط©
          </h1>

          <p className={styles.heroDescription}>
            ظٹط­ظ„ظ„ KAFU AI ط®ط· ط§ظ„ظ…ط¨ظٹط¹ط§طھطŒ ط¥ط´ط§ط±ط§طھ ط§ظ„ط¹ظ…ظ„ط§ط،طŒ ط§ط­طھظ…ط§ظ„ط§طھ ط§ظ„ط¥ط؛ظ„ط§ظ‚طŒ
            ظˆط§ظ„ط®ط·ظˆط§طھ ط§ظ„طھط§ظ„ظٹط© ظ„ظ…ط³ط§ط¹ط¯ط© ط§ظ„ظپط±ظٹظ‚ ط¹ظ„ظ‰ طھظˆط¬ظٹظ‡ ط¬ظ‡ط¯ظ‡ ظ†ط­ظˆ ط§ظ„ظپط±طµ
            ط§ظ„ط£ط¹ظ„ظ‰ ط£ط«ط±ظ‹ط§.
          </p>
        </div>

        <div className={styles.heroSignals}>
          <div className={styles.signal}>
            <span className={styles.signalIcon}>
              <Bot size={16} aria-hidden="true" />
            </span>
            <span>
              <strong>ط§ظ„طھط­ظ„ظٹظ„ ظ…ط­ط¯ط«</strong>
              <small>{dateTimeFormatter.format(new Date(generatedAt))}</small>
            </span>
          </div>

          <div className={`${styles.signal} ${styles.signalPrimary}`}>
            <span className={styles.signalIcon}>
              <Target size={16} aria-hidden="true" />
            </span>
            <span>
              <strong>{activeOpportunities.length} ظپط±طµط© ظ†ط´ط·ط©</strong>
              <small>{highPriorityOpportunities.length} ظپط±طµ ط°ط§طھ ط£ظˆظ„ظˆظٹط© ط¹ط§ظ„ظٹط©</small>
            </span>
          </div>
        </div>
      </section>

      <section className={styles.metricsGrid} aria-label="ظ…ط¤ط´ط±ط§طھ ط§ظ„ظ…ط¨ظٹط¹ط§طھ">
        {metrics.map((metric) => (
          <article className={styles.metricCard} key={metric.id}>
            <div className={styles.metricHeader}>
              <span>{metric.label}</span>
              <span
                className={styles.trend}
                data-direction={metric.trend}
              >
                {getTrendIcon(metric.trend)}
                {metric.trendValue}
              </span>
            </div>

            <strong className={styles.metricValue}>{metric.value}</strong>
            <p className={styles.metricDetail}>{metric.detail}</p>
          </article>
        ))}
      </section>

      <section
        className={styles.panel}
        aria-labelledby="revenue-intelligence-title"
      >
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.sectionEyebrow}>
              Revenue Operations
            </span>

            <h2 id="revenue-intelligence-title">
              ذكاء الإيرادات التنفيذي
            </h2>

            <p>
              رؤية موحدة للتوقعات المرجّحة، تغطية الهدف،
              الالتزامات ومخاطر الإيرادات المفتوحة.
            </p>
          </div>

          <div className={styles.panelHeaderValue}>
            <strong>
              {formatCurrency(revenueSummary.forecastRevenue)}
            </strong>
            <span>التوقع التنفيذي</span>
          </div>
        </div>

        <div
          className={styles.metricsGrid}
          aria-label="مؤشرات عمليات الإيرادات"
        >
          <article className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span>الإيراد الملتزم</span>

              <span
                className={styles.trend}
                data-direction="neutral"
              >
                <Target size={14} aria-hidden="true" />
                Commit
              </span>
            </div>

            <strong className={styles.metricValue}>
              {formatCurrency(revenueSummary.commitRevenue)}
            </strong>

            <p className={styles.metricDetail}>
              الإيرادات المصنفة ضمن الالتزام التنفيذي الحالي.
            </p>
          </article>

          <article className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span>أفضل سيناريو</span>

              <span
                className={styles.trend}
                data-direction="up"
              >
                <TrendingUp size={14} aria-hidden="true" />
                Best Case
              </span>
            </div>

            <strong className={styles.metricValue}>
              {formatCurrency(revenueSummary.bestCaseRevenue)}
            </strong>

            <p className={styles.metricDetail}>
              القيمة المحتملة عند نجاح الفرص عالية الترجيح.
            </p>
          </article>

          <article className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span>التغطية المرجّحة</span>

              <span
                className={styles.trend}
                data-direction={
                  revenueSummary.weightedCoverage >= 1
                    ? "up"
                    : "down"
                }
              >
                {revenueSummary.weightedCoverage >= 1 ? (
                  <ArrowUp size={14} aria-hidden="true" />
                ) : (
                  <ArrowDown size={14} aria-hidden="true" />
                )}
                Coverage
              </span>
            </div>

            <strong className={styles.metricValue}>
              {revenueSummary.weightedCoverage.toFixed(2)}x
            </strong>

            <p className={styles.metricDetail}>
              نسبة خط المبيعات المرجّح إلى هدف الإيرادات.
            </p>
          </article>

          <article className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span>ثقة التوقع</span>

              <span
                className={styles.trend}
                data-direction={
                  revenueConfidencePercentage >= 70
                    ? "up"
                    : "down"
                }
              >
                {revenueConfidencePercentage >= 70 ? (
                  <CheckCircle2 size={14} aria-hidden="true" />
                ) : (
                  <CircleAlert size={14} aria-hidden="true" />
                )}
                Confidence
              </span>
            </div>

            <strong className={styles.metricValue}>
              {revenueConfidencePercentage}%
            </strong>

            <p className={styles.metricDetail}>
              {revenueRiskCount > 0
                ? `${revenueRiskCount} إشارة مخاطر إيرادات عالية أو حرجة مفتوحة.`
                : "لا توجد إشارات مخاطر إيرادات عالية أو حرجة مفتوحة."}
            </p>
          </article>
        </div>
      </section>

      <div className={styles.primaryGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                Pipeline Intelligence
              </span>
              <h2>طھظˆط²ظٹط¹ ط®ط· ط§ظ„ظ…ط¨ظٹط¹ط§طھ</h2>
              <p>ط§ظ„ظ‚ظٹظ…ط© ط§ظ„ط­ط§ظ„ظٹط© ظ„ظ„ظپط±طµ ط¨ط­ط³ط¨ ط§ظ„ظ…ط±ط­ظ„ط© ط§ظ„طھط¬ط§ط±ظٹط©.</p>
            </div>

            <div className={styles.panelHeaderValue}>
              <strong>{formatCurrency(totalPipelineValue)}</strong>
              <span>ط§ظ„ظ‚ظٹظ…ط© ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹط©</span>
            </div>
          </div>

          <div className={styles.pipeline}>
            {pipelineStages.map((stage) => (
              <div className={styles.pipelineRow} key={stage.status}>
                <div className={styles.pipelineMeta}>
                  <span>{stage.label}</span>
                  <small>{stage.opportunities} ظپط±طµ</small>
                </div>

                <div
                  className={styles.pipelineTrack}
                  role="progressbar"
                  aria-label={`${stage.label}: ${stage.percentage}%`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={stage.percentage}
                >
                  <span style={{ width: `${stage.percentage}%` }} />
                </div>

                <strong>{formatCurrency(stage.value)}</strong>
              </div>
            ))}
          </div>
        </section>

        <aside className={`${styles.panel} ${styles.aiPanel}`}>
          <div className={styles.aiPanelHeader}>
            <span className={styles.aiIcon}>
              <Bot size={19} aria-hidden="true" />
            </span>
            <div>
              <span className={styles.sectionEyebrow}>KAFU AI</span>
              <h2>طھظˆطµظٹط§طھ ط§ظ„ظٹظˆظ…</h2>
            </div>
          </div>

          <div className={styles.recommendationList}>
            {recommendations.map((recommendation, index) => (
              <article
                className={styles.recommendation}
                key={recommendation.id}
                data-priority={recommendation.priority}
              >
                <div className={styles.recommendationIndex}>
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <h3>{recommendation.title}</h3>
                  <p>{recommendation.description}</p>
                  <span className={styles.impact}>
                    <TrendingUp size={14} aria-hidden="true" />
                    {recommendation.impact}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.sectionEyebrow}>
              Opportunity Intelligence
            </span>
            <h2>ط§ظ„ظپط±طµ ط°ط§طھ ط§ظ„ط£ظˆظ„ظˆظٹط©</h2>
            <p>
              طھط±طھظٹط¨ ط°ظƒظٹ ظٹط¬ظ…ط¹ ط¨ظٹظ† ظ‚ظٹظ…ط© ط§ظ„طµظپظ‚ط©طŒ ط§ط­طھظ…ط§ظ„ظٹط© ط§ظ„ط¥ط؛ظ„ط§ظ‚طŒ ظˆطµط­ط©
              ط§ظ„ط¹ظ„ط§ظ‚ط© ظ…ط¹ ط§ظ„ط¹ظ…ظٹظ„.
            </p>
          </div>

          <button className={styles.secondaryButton} type="button">
            ط¹ط±ط¶ ط¬ظ…ظٹط¹ ط§ظ„ظپط±طµ
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
        </div>

        {(communicationMessage || communicationError) && (
          <div
            className={styles.communicationNotice}
            data-status={communicationError ? "error" : "success"}
            role={communicationError ? "alert" : "status"}
            aria-live="polite"
          >
            {communicationError || communicationMessage}
          </div>
        )}

        <div className={styles.opportunityTableWrapper}>
          <table className={styles.opportunityTable}>
            <thead>
              <tr>
                <th>ط§ظ„ط¹ظ…ظٹظ„ ظˆط§ظ„ظپط±طµط©</th>
                <th>ط§ظ„ظ…ط±ط­ظ„ط©</th>
                <th>ط§ظ„ظ‚ظٹظ…ط©</th>
                <th>ط§ط­طھظ…ط§ظ„ظٹط© ط§ظ„ط¥ط؛ظ„ط§ظ‚</th>
                <th>طµط­ط© ط§ظ„ظپط±طµط©</th>
                <th>ط§ظ„ط¥ط؛ظ„ط§ظ‚ ط§ظ„ظ…طھظˆظ‚ط¹</th>
                <th>ط§ظ„ط®ط·ظˆط© ط§ظ„طھط§ظ„ظٹط©</th>                <th>ط§ظ„طھظˆط§طµظ„</th>
              </tr>
            </thead>

            <tbody>
              {opportunities.map((opportunity) => (
                <tr
                  key={opportunity.id}
                  className={styles.opportunityRow}
                  data-selected={
                    selectedOpportunityId === opportunity.id
                  }
                  tabIndex={0}
                  role="button"
                  aria-label={`عرض التفاصيل التنفيذية لفرصة ${opportunity.companyName}`}
                  onClick={() =>
                    handleSelectOpportunity(opportunity.id)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      handleSelectOpportunity(
                        opportunity.id,
                      );
                    }
                  }}
                >
                  <td>
                    <div className={styles.companyCell}>
                      <span className={styles.companyIcon}>
                        <Building2 size={17} aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{opportunity.companyName}</strong>
                        <small>{opportunity.opportunityName}</small>
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className={styles.stageBadge}>
                      {opportunity.statusLabel}
                    </span>
                  </td>

                  <td>
                    <strong className={styles.valueCell}>
                      {formatCurrency(opportunity.value)}
                    </strong>
                  </td>

                  <td>
                    <div className={styles.probability}>
                      <div
                        className={styles.probabilityTrack}
                        role="progressbar"
                        aria-label={`ط§ط­طھظ…ط§ظ„ظٹط© ط§ظ„ط¥ط؛ظ„ط§ظ‚ ${opportunity.probability}%`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={opportunity.probability}
                      >
                        <span
                          style={{
                            width: `${opportunity.probability}%`,
                          }}
                        />
                      </div>
                      <strong>{opportunity.probability}%</strong>
                    </div>
                  </td>

                  <td>
                    <span
                      className={styles.healthBadge}
                      data-health={opportunity.health}
                    >
                      {opportunity.health === "healthy" ? (
                        <CheckCircle2 size={14} aria-hidden="true" />
                      ) : (
                        <CircleAlert size={14} aria-hidden="true" />
                      )}
                      {getHealthLabel(opportunity.health)}
                    </span>
                  </td>

                  <td>
                    <span className={styles.dateCell}>
                      <CalendarClock size={14} aria-hidden="true" />
                      {dateFormatter.format(
                        new Date(opportunity.expectedCloseDate)
                      )}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actionCell}>
                      <strong>{opportunity.nextAction}</strong>
                      <small>
                        <Clock3 size={12} aria-hidden="true" />
                        {dateTimeFormatter.format(
                          new Date(opportunity.nextActionDueAt)
                        )}
                      </small>
                    </div>
                  </td>

                  <td>
                    <button
                      className={styles.communicationButton}
                      type="button"
                      disabled={isCommunicationPending}
                      aria-label={`ظپطھط­ ط§ظ„طھظˆط§طµظ„ ظ…ط¹ ${opportunity.companyName}`}
                      onClick={() =>
                        handleOpenCommunication(
                          opportunity.id,
                          opportunity.companyName,
                        )
                      }
                    >
                      <MessageCircle size={15} aria-hidden="true" />
                      {isCommunicationPending &&
                      activeCommunicationOpportunityId ===
                        opportunity.id
                        ? "ط¬ط§ط±ظچ ط§ظ„ظپطھط­..."
                        : "ظپطھط­ ط§ظ„طھظˆط§طµظ„"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOpportunity && (
        <OpportunityExecutiveWorkspace
          opportunity={selectedOpportunity}
          onClose={handleCloseOpportunityWorkspace}
          onOpenCommunication={handleOpenCommunication}
          communicationPending={isCommunicationPending}
        />
      )}

      <div className={styles.secondaryGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                Revenue Forecast
              </span>
              <h2>طھظˆظ‚ط¹ ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ</h2>
              <p>ظ…ظ‚ط§ط±ظ†ط© ط§ظ„ط§ظ„طھط²ط§ظ…ط§طھ ظˆط§ظ„طھظˆظ‚ط¹ط§طھ ط¨ط§ظ„ظ‡ط¯ظپ ط§ظ„ط´ظ‡ط±ظٹ.</p>
            </div>
          </div>

          <div className={styles.forecastList}>
            {forecast.map((period) => {
              const committedWidth =
                (period.committed / maxForecastValue) * 100;
              const probableWidth =
                (period.probable / maxForecastValue) * 100;
              const pipelineWidth =
                (period.pipeline / maxForecastValue) * 100;
              const targetWidth =
                (period.target / maxForecastValue) * 100;

              return (
                <article className={styles.forecastRow} key={period.id}>
                  <div className={styles.forecastHeading}>
                    <strong>{period.label}</strong>
                    <span>
                      ط§ظ„ظ‡ط¯ظپ: {formatCurrency(period.target)}
                    </span>
                  </div>

                  <div className={styles.forecastChart}>
                    <div
                      className={styles.targetMarker}
                      style={{ width: `${targetWidth}%` }}
                    />

                    <span
                      className={styles.committedBar}
                      style={{ width: `${committedWidth}%` }}
                      title={`ظ…ظ„طھط²ظ…: ${formatCurrency(period.committed)}`}
                    />

                    <span
                      className={styles.probableBar}
                      style={{ width: `${probableWidth}%` }}
                      title={`ظ…ط±ط¬ط­: ${formatCurrency(period.probable)}`}
                    />

                    <span
                      className={styles.pipelineBar}
                      style={{ width: `${pipelineWidth}%` }}
                      title={`ط®ط· ط§ظ„ظ…ط¨ظٹط¹ط§طھ: ${formatCurrency(period.pipeline)}`}
                    />
                  </div>

                  <div className={styles.forecastValues}>
                    <span>
                      <i data-kind="committed" />
                      ظ…ظ„طھط²ظ… {formatCurrency(period.committed)}
                    </span>
                    <span>
                      <i data-kind="probable" />
                      ظ…ط±ط¬ظ‘ط­ {formatCurrency(period.probable)}
                    </span>
                    <span>
                      <i data-kind="pipeline" />
                      ط¥ط¶ط§ظپظٹ {formatCurrency(period.pipeline)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                Sales Activity
              </span>
              <h2>ط¢ط®ط± ط§ظ„ط£ظ†ط´ط·ط©</h2>
              <p>طھط³ظ„ط³ظ„ ظ…ظˆط­ظ‘ط¯ ظ„ظ„طھظˆط§طµظ„ ظˆط§ظ„ط§ط¬طھظ…ط§ط¹ط§طھ ظˆط§ظ„ظ…طھط§ط¨ط¹ط§طھ.</p>
            </div>
          </div>

          <div className={styles.activityList}>
            {activities.map((activity) => (
              <article className={styles.activityItem} key={activity.id}>
                <span className={styles.activityIcon}>
                  {activity.type === "demo" ? (
                    <Presentation size={16} aria-hidden="true" />
                  ) : (
                    getChannelIcon(activity.channel)
                  )}
                </span>

                <div className={styles.activityContent}>
                  <div>
                    <h3>{activity.title}</h3>
                    <time dateTime={activity.occurredAt}>
                      {dateTimeFormatter.format(
                        new Date(activity.occurredAt)
                      )}
                    </time>
                  </div>

                  <p>{activity.description}</p>
                  <span>{activity.actorName}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

