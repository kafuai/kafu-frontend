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
  getPriorityOpportunities,
  salesIntelligenceSnapshot,
} from "@/data/sales-intelligence/salesIntelligenceDemoData";

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
  return `${currencyFormatter.format(value)} د.ب`;
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
    healthy: "صحية",
    attention: "تحتاج متابعة",
    critical: "معرضة للخطر",
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
  const {
    metrics,
    pipelineStages,
    forecast,
    recommendations,
    activities,
    generatedAt,
  } = salesIntelligenceSnapshot;

  const opportunities = getPriorityOpportunities();
  const maxForecastValue = Math.max(
    ...forecast.map((period) => period.target)
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowIcon}>
              <Sparkles size={15} aria-hidden="true" />
            </span>
            ذكاء المبيعات المؤسسي
          </div>

          <h1 className={styles.heroTitle}>
            رؤية موحّدة لأداء المبيعات والفرص القادمة
          </h1>

          <p className={styles.heroDescription}>
            يحلل KAFU AI خط المبيعات، إشارات العملاء، احتمالات الإغلاق،
            والخطوات التالية لمساعدة الفريق على توجيه جهده نحو الفرص
            الأعلى أثرًا.
          </p>
        </div>

        <div className={styles.heroSignals}>
          <div className={styles.signal}>
            <span className={styles.signalIcon}>
              <Bot size={16} aria-hidden="true" />
            </span>
            <span>
              <strong>التحليل محدث</strong>
              <small>{dateTimeFormatter.format(new Date(generatedAt))}</small>
            </span>
          </div>

          <div className={`${styles.signal} ${styles.signalPrimary}`}>
            <span className={styles.signalIcon}>
              <Target size={16} aria-hidden="true" />
            </span>
            <span>
              <strong>27 فرصة نشطة</strong>
              <small>3 فرص ذات أولوية عالية</small>
            </span>
          </div>
        </div>
      </section>

      <section className={styles.metricsGrid} aria-label="مؤشرات المبيعات">
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

      <div className={styles.primaryGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                Pipeline Intelligence
              </span>
              <h2>توزيع خط المبيعات</h2>
              <p>القيمة الحالية للفرص بحسب المرحلة التجارية.</p>
            </div>

            <div className={styles.panelHeaderValue}>
              <strong>248,500 د.ب</strong>
              <span>القيمة الإجمالية</span>
            </div>
          </div>

          <div className={styles.pipeline}>
            {pipelineStages.map((stage) => (
              <div className={styles.pipelineRow} key={stage.status}>
                <div className={styles.pipelineMeta}>
                  <span>{stage.label}</span>
                  <small>{stage.opportunities} فرص</small>
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
              <h2>توصيات اليوم</h2>
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
            <h2>الفرص ذات الأولوية</h2>
            <p>
              ترتيب ذكي يجمع بين قيمة الصفقة، احتمالية الإغلاق، وصحة
              العلاقة مع العميل.
            </p>
          </div>

          <button className={styles.secondaryButton} type="button">
            عرض جميع الفرص
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.opportunityTableWrapper}>
          <table className={styles.opportunityTable}>
            <thead>
              <tr>
                <th>العميل والفرصة</th>
                <th>المرحلة</th>
                <th>القيمة</th>
                <th>احتمالية الإغلاق</th>
                <th>صحة الفرصة</th>
                <th>الإغلاق المتوقع</th>
                <th>الخطوة التالية</th>
              </tr>
            </thead>

            <tbody>
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id}>
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
                        aria-label={`احتمالية الإغلاق ${opportunity.probability}%`}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className={styles.secondaryGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                Revenue Forecast
              </span>
              <h2>توقع الإيرادات</h2>
              <p>مقارنة الالتزامات والتوقعات بالهدف الشهري.</p>
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
                      الهدف: {formatCurrency(period.target)}
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
                      title={`ملتزم: ${formatCurrency(period.committed)}`}
                    />

                    <span
                      className={styles.probableBar}
                      style={{ width: `${probableWidth}%` }}
                      title={`مرجح: ${formatCurrency(period.probable)}`}
                    />

                    <span
                      className={styles.pipelineBar}
                      style={{ width: `${pipelineWidth}%` }}
                      title={`خط المبيعات: ${formatCurrency(period.pipeline)}`}
                    />
                  </div>

                  <div className={styles.forecastValues}>
                    <span>
                      <i data-kind="committed" />
                      ملتزم {formatCurrency(period.committed)}
                    </span>
                    <span>
                      <i data-kind="probable" />
                      مرجّح {formatCurrency(period.probable)}
                    </span>
                    <span>
                      <i data-kind="pipeline" />
                      إضافي {formatCurrency(period.pipeline)}
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
              <h2>آخر الأنشطة</h2>
              <p>تسلسل موحّد للتواصل والاجتماعات والمتابعات.</p>
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

