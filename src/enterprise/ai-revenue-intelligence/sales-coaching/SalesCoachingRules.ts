import type {
  SalesCoachingAction,
  SalesCoachingContext,
  SalesCoachingEvidence,
  SalesCoachingRuleKey,
  SalesCoachingRuleResult,
} from "./SalesCoachingTypes";

export interface SalesCoachingRule {
  key: SalesCoachingRuleKey;
  evaluate(
    context: SalesCoachingContext,
    now: Date,
  ): SalesCoachingRuleResult;
}

const clamp = (
  value: number,
  minimum = 0,
  maximum = 100,
): number => Math.min(maximum, Math.max(minimum, value));

const normalizePercent = (
  value: number | null | undefined,
): number | null => {
  if (
    value === null
    || value === undefined
    || !Number.isFinite(value)
  ) {
    return null;
  }

  return clamp(value <= 1 ? value * 100 : value);
};

const createAction = (
  input: Omit<SalesCoachingAction, "id">,
): Omit<SalesCoachingAction, "id"> => input;

const createEvidence = (
  evidence: SalesCoachingEvidence,
): SalesCoachingEvidence => evidence;

const createNotApplicable = (
  ruleKey: SalesCoachingRuleKey,
  category: SalesCoachingRuleResult["category"],
  effort: SalesCoachingRuleResult["effort"],
): SalesCoachingRuleResult => ({
  ruleKey,
  category,
  effort,
  title: "",
  summary: "",
  rationale: "",
  expectedImpact: "",
  severity: 0,
  opportunityImpact: 0,
  evidenceConfidence: 0,
  urgency: 0,
  actions: [],
  evidence: [],
  applicable: false,
});

const resolveDaysUntil = (
  value: string | null | undefined,
  now: Date,
): number | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return Math.ceil(
    (date.getTime() - now.getTime())
    / (24 * 60 * 60 * 1000),
  );
};

const recoverEngagementRule: SalesCoachingRule = {
  key: "recover-engagement",

  evaluate(context) {
    const engagement =
      normalizePercent(context.engagementScore);

    const daysSinceActivity =
      context.daysSinceLastActivity ?? null;

    const declining =
      context.engagementTrend === "declining";

    const inactive =
      daysSinceActivity !== null
      && daysSinceActivity >= 10;

    const weakEngagement =
      engagement !== null
      && engagement < 55;

    if (!declining && !inactive && !weakEngagement) {
      return createNotApplicable(
        this.key,
        "engagement",
        "medium",
      );
    }

    const severity = clamp(
      (declining ? 30 : 0)
      + (inactive
        ? Math.min(40, daysSinceActivity ?? 0)
        : 0)
      + (engagement === null
        ? 10
        : Math.max(0, 50 - engagement)),
    );

    return {
      ruleKey: this.key,
      category: "engagement",
      effort: "medium",
      title: "Recover customer engagement",
      summary:
        "Customer engagement is weakening and requires a structured re-engagement sequence.",
      rationale:
        "Declining or inactive engagement reduces conversion confidence and increases the likelihood of opportunity stagnation.",
      expectedImpact:
        "Restore customer momentum, obtain a fresh commitment, and improve the reliability of the next commercial step.",
      severity,
      opportunityImpact: clamp(
        100 - context.winProbability.probability,
      ),
      evidenceConfidence:
        engagement === null ? 65 : 90,
      urgency: inactive && (daysSinceActivity ?? 0) >= 20
        ? 95
        : 80,
      actions: [
        createAction({
          title: "Launch a focused re-engagement outreach",
          description:
            "Send a customer-specific message that reconnects the discussion to the confirmed business objective and asks for a concrete response.",
          sequence: 1,
          ownerRole: "opportunity-owner",
          dueInHours: 8,
          completionCriteria: [
            "Outreach is personalized to the customer situation.",
            "The message requests a specific response or meeting.",
            "The outreach is recorded in the activity timeline.",
          ],
        }),
        createAction({
          title: "Escalate through an alternate stakeholder",
          description:
            "Use an existing champion, executive contact, or alternate stakeholder when the primary contact remains unresponsive.",
          sequence: 2,
          ownerRole: "opportunity-owner",
          dueInHours: 24,
          completionCriteria: [
            "An alternate stakeholder is identified.",
            "The escalation preserves the customer relationship.",
            "A new engagement path is documented.",
          ],
        }),
        createAction({
          title: "Revalidate opportunity momentum",
          description:
            "Confirm whether the opportunity remains active, delayed, deprioritized, or blocked.",
          sequence: 3,
          ownerRole: "sales-manager",
          dueInHours: 48,
          completionCriteria: [
            "Current customer priority is confirmed.",
            "Next step and expected timing are updated.",
            "The forecast is adjusted when evidence changed.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "engagement-score",
          label: "Engagement score",
          value: engagement,
          reason:
            engagement === null
              ? "No current engagement score is available."
              : "The current engagement score indicates reduced customer momentum.",
          source: "activity",
        }),
        createEvidence({
          key: "engagement-trend",
          label: "Engagement trend",
          value: context.engagementTrend,
          reason:
            declining
              ? "Engagement is explicitly trending downward."
              : "No declining trend is recorded.",
          source: "activity",
        }),
        createEvidence({
          key: "activity-recency",
          label: "Days since last activity",
          value: daysSinceActivity,
          reason:
            inactive
              ? "The opportunity has exceeded the acceptable inactivity window."
              : "Activity recency is not the primary concern.",
          source: "activity",
        }),
      ],
      applicable: true,
    };
  },
};

const expandStakeholderCoverageRule: SalesCoachingRule = {
  key: "expand-stakeholder-coverage",

  evaluate(context) {
    const stakeholderCoverage =
      normalizePercent(context.stakeholderCoverage);

    const decisionMakerCoverage =
      normalizePercent(context.decisionMakerCoverage);

    const weakStakeholderCoverage =
      stakeholderCoverage !== null
      && stakeholderCoverage < 65;

    const weakDecisionCoverage =
      decisionMakerCoverage !== null
      && decisionMakerCoverage < 60;

    if (
      !weakStakeholderCoverage
      && !weakDecisionCoverage
    ) {
      return createNotApplicable(
        this.key,
        "stakeholder",
        "medium",
      );
    }

    const weakestValue = Math.min(
      stakeholderCoverage ?? 100,
      decisionMakerCoverage ?? 100,
    );

    return {
      ruleKey: this.key,
      category: "stakeholder",
      effort: "medium",
      title: "Expand buying-committee coverage",
      summary:
        "The opportunity depends on insufficient stakeholder access or weak decision-maker coverage.",
      rationale:
        "Single-threaded opportunities are vulnerable to hidden objections, changing priorities, and internal customer politics.",
      expectedImpact:
        "Increase deal resilience, expose hidden concerns, and improve access to the people who influence approval.",
      severity: clamp(100 - weakestValue),
      opportunityImpact: 85,
      evidenceConfidence:
        stakeholderCoverage !== null
        && decisionMakerCoverage !== null
          ? 95
          : 70,
      urgency:
        context.winProbability.trend === "declining"
          ? 90
          : 75,
      actions: [
        createAction({
          title: "Map the buying committee",
          description:
            "Identify the economic buyer, decision maker, technical evaluator, procurement contact, champion, and potential blocker.",
          sequence: 1,
          ownerRole: "opportunity-owner",
          dueInHours: 24,
          completionCriteria: [
            "Required stakeholder roles are mapped.",
            "Known influence and sentiment are documented.",
            "Coverage gaps have named owners.",
          ],
        }),
        createAction({
          title: "Request a multi-stakeholder session",
          description:
            "Ask the current contact to include the missing decision participants in the next working session.",
          sequence: 2,
          ownerRole: "opportunity-owner",
          dueInHours: 48,
          completionCriteria: [
            "The request is tied to customer decision quality.",
            "At least one new decision participant is invited.",
            "The meeting objective is documented.",
          ],
        }),
        createAction({
          title: "Prepare role-specific value messages",
          description:
            "Adapt the value case for financial, operational, technical, and executive stakeholders.",
          sequence: 3,
          ownerRole: "solution-consultant",
          dueInHours: 72,
          completionCriteria: [
            "Messages are specific to each stakeholder role.",
            "Business and technical outcomes are aligned.",
            "Potential objections are addressed.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "stakeholder-coverage",
          label: "Stakeholder coverage",
          value: stakeholderCoverage,
          reason:
            "Current coverage does not sufficiently represent the customer buying committee.",
          source: "stakeholder",
        }),
        createEvidence({
          key: "decision-maker-coverage",
          label: "Decision-maker coverage",
          value: decisionMakerCoverage,
          reason:
            "Access to formal or informal decision makers remains incomplete.",
          source: "stakeholder",
        }),
      ],
      applicable: true,
    };
  },
};

const secureExecutiveSponsorRule: SalesCoachingRule = {
  key: "secure-executive-sponsor",

  evaluate(context) {
    const sponsorMissing =
      context.executiveSponsorConfirmed !== true;

    const strategicOpportunity =
      context.winProbability.probability >= 35;

    if (!sponsorMissing || !strategicOpportunity) {
      return createNotApplicable(
        this.key,
        "stakeholder",
        "high",
      );
    }

    return {
      ruleKey: this.key,
      category: "stakeholder",
      effort: "high",
      title: "Secure executive sponsorship",
      summary:
        "The opportunity lacks a confirmed executive sponsor who can protect priority and support internal approval.",
      rationale:
        "Executive sponsorship becomes increasingly important as deal complexity, organizational impact, and approval requirements increase.",
      expectedImpact:
        "Improve organizational alignment, strengthen urgency, and reduce the risk of late-stage internal rejection.",
      severity:
        context.winProbability.probabilityBand
          === "highly-probable"
          ? 85
          : 70,
      opportunityImpact: 90,
      evidenceConfidence: 80,
      urgency:
        context.winProbability.probability >= 60
          ? 90
          : 70,
      actions: [
        createAction({
          title: "Identify the executive outcome owner",
          description:
            "Determine which customer executive is accountable for the business outcome connected to this opportunity.",
          sequence: 1,
          ownerRole: "opportunity-owner",
          dueInHours: 24,
          completionCriteria: [
            "The accountable executive is identified.",
            "Their expected business outcome is documented.",
            "An introduction path is confirmed.",
          ],
        }),
        createAction({
          title: "Arrange executive-to-executive engagement",
          description:
            "Create a concise executive conversation focused on business outcomes, risk, sponsorship, and decision alignment.",
          sequence: 2,
          ownerRole: "executive-sponsor",
          dueInHours: 72,
          completionCriteria: [
            "The meeting includes appropriate seniority.",
            "The conversation avoids product-level detail.",
            "A strategic commitment or next action is captured.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "executive-sponsor",
          label: "Executive sponsor confirmed",
          value: context.executiveSponsorConfirmed,
          reason:
            "No confirmed executive sponsor is recorded for the opportunity.",
          source: "stakeholder",
        }),
        createEvidence({
          key: "win-probability",
          label: "Win probability",
          value: context.winProbability.probability,
          reason:
            "The opportunity is sufficiently viable to justify executive engagement.",
          source: "win-probability",
        }),
      ],
      applicable: true,
    };
  },
};

const stabilizeCloseDateRule: SalesCoachingRule = {
  key: "stabilize-close-date",

  evaluate(context, now) {
    const changes = context.closeDateChangeCount ?? 0;
    const daysUntilClose = resolveDaysUntil(
      context.expectedCloseDate,
      now,
    );

    const unstable = changes >= 2;
    const overdue =
      daysUntilClose !== null && daysUntilClose < 0;
    const nearClose =
      daysUntilClose !== null
      && daysUntilClose <= 14;

    if (!unstable && !overdue) {
      return createNotApplicable(
        this.key,
        "forecast",
        "medium",
      );
    }

    return {
      ruleKey: this.key,
      category: "forecast",
      effort: "medium",
      title: "Stabilize the expected close date",
      summary:
        "The expected close date has moved repeatedly or is no longer supported by current customer evidence.",
      rationale:
        "Repeated date movement is a strong indicator of incomplete decision validation, weak customer commitment, or forecast optimism.",
      expectedImpact:
        "Improve forecast reliability and create a customer-validated path to the commercial decision.",
      severity: clamp(
        changes * 20
        + (overdue ? 35 : 0)
        + (nearClose ? 10 : 0),
      ),
      opportunityImpact: 85,
      evidenceConfidence:
        context.expectedCloseDate ? 90 : 65,
      urgency: overdue ? 100 : nearClose ? 90 : 75,
      actions: [
        createAction({
          title: "Revalidate the customer decision date",
          description:
            "Ask the customer which event, approval, or business requirement determines the real decision date.",
          sequence: 1,
          ownerRole: "opportunity-owner",
          dueInHours: 12,
          completionCriteria: [
            "The date is confirmed by the customer.",
            "The business reason behind the date is documented.",
            "Internal dependencies are identified.",
          ],
        }),
        createAction({
          title: "Build a reverse close plan",
          description:
            "Create the sequence of customer and internal milestones required to reach the confirmed decision date.",
          sequence: 2,
          ownerRole: "opportunity-owner",
          dueInHours: 36,
          completionCriteria: [
            "All critical milestones have owners.",
            "Approval and procurement steps are included.",
            "The plan is shared with the customer.",
          ],
        }),
        createAction({
          title: "Correct the forecast when unsupported",
          description:
            "Move the expected date or forecast category when current evidence cannot support the existing commitment.",
          sequence: 3,
          ownerRole: "sales-manager",
          dueInHours: 48,
          completionCriteria: [
            "Forecast reflects customer evidence.",
            "Reason for the adjustment is recorded.",
            "Management assumptions are removed.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "close-date",
          label: "Expected close date",
          value: context.expectedCloseDate,
          reason:
            overdue
              ? "The recorded close date has passed."
              : "The current close date requires stronger validation.",
          source: "forecast",
        }),
        createEvidence({
          key: "close-date-changes",
          label: "Close-date changes",
          value: changes,
          reason:
            "Repeated date movement reduces forecast reliability.",
          source: "forecast",
        }),
      ],
      applicable: true,
    };
  },
};

const strengthenCommercialCaseRule: SalesCoachingRule = {
  key: "strengthen-commercial-case",

  evaluate(context) {
    const commercialConfidence =
      normalizePercent(context.commercialConfidence);

    const businessCase =
      normalizePercent(context.businessCaseStrength);

    const weakCommercial =
      commercialConfidence !== null
      && commercialConfidence < 65;

    const weakBusinessCase =
      businessCase !== null
      && businessCase < 65;

    const budgetMissing =
      context.budgetConfirmed === false;

    if (
      !weakCommercial
      && !weakBusinessCase
      && !budgetMissing
    ) {
      return createNotApplicable(
        this.key,
        "commercial",
        "high",
      );
    }

    const lowest = Math.min(
      commercialConfidence ?? 100,
      businessCase ?? 100,
      budgetMissing ? 30 : 100,
    );

    return {
      ruleKey: this.key,
      category: "commercial",
      effort: "high",
      title: "Strengthen the commercial business case",
      summary:
        "The opportunity lacks sufficient financial, budgetary, or business-value evidence.",
      rationale:
        "Customer interest does not reliably convert without a quantified value case and a credible funding path.",
      expectedImpact:
        "Improve commercial approval confidence and give the customer a defensible internal case for investment.",
      severity: clamp(100 - lowest),
      opportunityImpact: 95,
      evidenceConfidence:
        commercialConfidence !== null
        || businessCase !== null
          ? 90
          : 70,
      urgency:
        context.proposalDelivered === true
          ? 95
          : 75,
      actions: [
        createAction({
          title: "Quantify the customer business impact",
          description:
            "Translate the confirmed problem into measurable financial, operational, risk, or productivity outcomes.",
          sequence: 1,
          ownerRole: "opportunity-owner",
          dueInHours: 48,
          completionCriteria: [
            "Current-state impact is quantified.",
            "Expected improvement is documented.",
            "Customer assumptions are validated.",
          ],
        }),
        createAction({
          title: "Confirm the funding path",
          description:
            "Identify the budget owner, funding source, approval threshold, and timing.",
          sequence: 2,
          ownerRole: "opportunity-owner",
          dueInHours: 48,
          completionCriteria: [
            "Budget owner is known.",
            "Funding availability is confirmed or qualified.",
            "Approval steps are documented.",
          ],
        }),
        createAction({
          title: "Prepare an approval-ready value case",
          description:
            "Create a concise commercial narrative the customer can use with finance, procurement, and executive approvers.",
          sequence: 3,
          ownerRole: "solution-consultant",
          dueInHours: 72,
          completionCriteria: [
            "Value is linked to strategic outcomes.",
            "Costs and expected benefits are transparent.",
            "Key assumptions and risks are included.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "commercial-confidence",
          label: "Commercial confidence",
          value: commercialConfidence,
          reason:
            "Current commercial evidence is not strong enough to support reliable conversion.",
          source: "commercial",
        }),
        createEvidence({
          key: "business-case-strength",
          label: "Business-case strength",
          value: businessCase,
          reason:
            "The value case requires stronger quantified customer evidence.",
          source: "commercial",
        }),
        createEvidence({
          key: "budget-confirmed",
          label: "Budget confirmed",
          value: context.budgetConfirmed,
          reason:
            budgetMissing
              ? "The opportunity does not have a confirmed funding path."
              : "No explicit budget deficiency is recorded.",
          source: "commercial",
        }),
      ],
      applicable: true,
    };
  },
};

const improveForecastConfidenceRule: SalesCoachingRule = {
  key: "improve-forecast-confidence",

  evaluate(context) {
    const confidence =
      normalizePercent(context.forecastConfidence);

    if (confidence === null || confidence >= 65) {
      return createNotApplicable(
        this.key,
        "forecast",
        "medium",
      );
    }

    return {
      ruleKey: this.key,
      category: "forecast",
      effort: "medium",
      title: "Improve forecast confidence",
      summary:
        "The current forecast is not supported by enough verified customer evidence.",
      rationale:
        "Low forecast confidence creates planning risk and can conceal unresolved qualification gaps.",
      expectedImpact:
        "Create an evidence-based forecast and expose the specific conditions required for conversion.",
      severity: clamp(100 - confidence),
      opportunityImpact: 75,
      evidenceConfidence: 90,
      urgency:
        context.winProbability.trend === "declining"
          ? 90
          : 70,
      actions: [
        createAction({
          title: "Run an evidence-based forecast review",
          description:
            "Review customer commitments, stakeholder access, commercial validation, timing, risks, and next steps.",
          sequence: 1,
          ownerRole: "sales-manager",
          dueInHours: 24,
          completionCriteria: [
            "Every forecast assertion has supporting evidence.",
            "Assumptions are separated from customer facts.",
            "Missing evidence has an owner and deadline.",
          ],
        }),
        createAction({
          title: "Define conversion conditions",
          description:
            "Document the specific customer events that must occur before the opportunity can be treated as committed.",
          sequence: 2,
          ownerRole: "opportunity-owner",
          dueInHours: 36,
          completionCriteria: [
            "Required customer commitments are explicit.",
            "Commercial and approval conditions are included.",
            "The conditions are measurable.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "forecast-confidence",
          label: "Forecast confidence",
          value: confidence,
          reason:
            "Forecast confidence is below the required operating threshold.",
          source: "forecast",
        }),
        createEvidence({
          key: "win-probability-confidence",
          label: "AI prediction confidence",
          value: context.winProbability.confidence,
          reason:
            "AI prediction confidence provides an additional evidence-quality reference.",
          source: "win-probability",
        }),
      ],
      applicable: true,
    };
  },
};

const counterCompetitivePressureRule: SalesCoachingRule = {
  key: "counter-competitive-pressure",

  evaluate(context) {
    const pressure =
      normalizePercent(context.competitorPressureScore);

    const competitorCount =
      context.competitorCount ?? 0;

    const pressureHigh =
      pressure !== null && pressure >= 55;

    const crowded =
      competitorCount >= 2;

    const differentiationMissing =
      context.competitiveDifferentiationConfirmed
      === false;

    if (
      !pressureHigh
      && !crowded
      && !differentiationMissing
    ) {
      return createNotApplicable(
        this.key,
        "competition",
        "high",
      );
    }

    return {
      ruleKey: this.key,
      category: "competition",
      effort: "high",
      title: "Strengthen the competitive position",
      summary:
        "Competitive pressure is material and the opportunity requires sharper differentiation.",
      rationale:
        "Feature-level competition usually compresses value and increases price pressure unless the decision is reframed around customer outcomes.",
      expectedImpact:
        "Improve differentiation, reduce price-only comparison, and expose decision criteria that favor the proposed solution.",
      severity: clamp(
        (pressure ?? competitorCount * 25)
        + (differentiationMissing ? 20 : 0),
      ),
      opportunityImpact: 90,
      evidenceConfidence:
        pressure !== null ? 90 : 70,
      urgency:
        context.proposalDelivered === true
          ? 95
          : 75,
      actions: [
        createAction({
          title: "Validate the real decision criteria",
          description:
            "Confirm how the customer will compare alternatives and which outcomes carry the highest decision weight.",
          sequence: 1,
          ownerRole: "opportunity-owner",
          dueInHours: 24,
          completionCriteria: [
            "Decision criteria are customer-confirmed.",
            "Relative weighting is understood.",
            "Hidden criteria and political factors are documented.",
          ],
        }),
        createAction({
          title: "Build outcome-based differentiation",
          description:
            "Connect unique capabilities to the customer's highest-priority outcomes, implementation risk, and long-term operating value.",
          sequence: 2,
          ownerRole: "solution-consultant",
          dueInHours: 48,
          completionCriteria: [
            "Differentiation is tied to customer outcomes.",
            "Claims are supported by evidence.",
            "The message avoids generic feature comparisons.",
          ],
        }),
        createAction({
          title: "Create a competitive response plan",
          description:
            "Document likely competitor claims, vulnerabilities, customer perceptions, and the response strategy.",
          sequence: 3,
          ownerRole: "sales-manager",
          dueInHours: 72,
          completionCriteria: [
            "Known competitors are documented.",
            "Response owners are assigned.",
            "Pricing and value-defense strategy are aligned.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "competitive-pressure",
          label: "Competitive pressure",
          value: pressure,
          reason:
            "Competitive pressure is reducing the expected conversion profile.",
          source: "commercial",
        }),
        createEvidence({
          key: "competitor-count",
          label: "Known competitors",
          value: competitorCount,
          reason:
            "Multiple alternatives increase decision complexity and conversion risk.",
          source: "commercial",
        }),
        createEvidence({
          key: "differentiation-confirmed",
          label: "Differentiation confirmed",
          value:
            context.competitiveDifferentiationConfirmed,
          reason:
            differentiationMissing
              ? "Customer-validated differentiation has not been established."
              : "Differentiation is not explicitly marked as missing.",
          source: "commercial",
        }),
      ],
      applicable: true,
    };
  },
};

const accelerateNextStepRule: SalesCoachingRule = {
  key: "accelerate-next-step",

  evaluate(context, now) {
    const missingNextStep =
      !context.nextStep?.trim();

    const daysUntilNextStep = resolveDaysUntil(
      context.nextStepDueAt,
      now,
    );

    const overdue =
      daysUntilNextStep !== null
      && daysUntilNextStep < 0;

    if (!missingNextStep && !overdue) {
      return createNotApplicable(
        this.key,
        "execution",
        "low",
      );
    }

    return {
      ruleKey: this.key,
      category: "execution",
      effort: "low",
      title: "Secure a customer-owned next step",
      summary:
        "The opportunity does not have a valid, dated, and customer-supported next action.",
      rationale:
        "Opportunities without specific next steps lose momentum and become difficult to distinguish from inactive pipeline.",
      expectedImpact:
        "Create forward motion and establish an observable customer commitment.",
      severity: overdue ? 90 : 70,
      opportunityImpact: 80,
      evidenceConfidence: 95,
      urgency: overdue ? 100 : 90,
      actions: [
        createAction({
          title: "Agree the next customer commitment",
          description:
            "Define the next action, owner, date, expected output, and purpose with the customer.",
          sequence: 1,
          ownerRole: "opportunity-owner",
          dueInHours: 8,
          completionCriteria: [
            "The next step is specific and measurable.",
            "A customer owner is involved.",
            "The date is mutually confirmed.",
          ],
        }),
        createAction({
          title: "Record the commitment in the opportunity",
          description:
            "Update the opportunity and activity timeline with the agreed next step and expected outcome.",
          sequence: 2,
          ownerRole: "opportunity-owner",
          dueInHours: 12,
          completionCriteria: [
            "The next step is visible in the opportunity.",
            "The due date is recorded.",
            "The expected customer output is documented.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "next-step",
          label: "Next step",
          value: context.nextStep,
          reason:
            missingNextStep
              ? "No specific next step is recorded."
              : "A next step exists but requires timing validation.",
          source: "opportunity",
        }),
        createEvidence({
          key: "next-step-due",
          label: "Next-step due date",
          value: context.nextStepDueAt,
          reason:
            overdue
              ? "The recorded next step is overdue."
              : "No overdue date is detected.",
          source: "opportunity",
        }),
      ],
      applicable: true,
    };
  },
};

const resolveHighRiskSignalsRule: SalesCoachingRule = {
  key: "resolve-high-risk-signals",

  evaluate(context) {
    const risk =
      normalizePercent(context.predictiveRiskScore);

    const criticalRisks =
      context.criticalRiskCount ?? 0;

    const openRisks =
      context.openRiskCount ?? 0;

    const highPredictiveRisk =
      risk !== null && risk >= 60;

    if (
      !highPredictiveRisk
      && criticalRisks === 0
      && openRisks < 3
    ) {
      return createNotApplicable(
        this.key,
        "risk",
        "high",
      );
    }

    return {
      ruleKey: this.key,
      category: "risk",
      effort: "high",
      title: "Resolve material opportunity risks",
      summary:
        "The opportunity contains unresolved risks that can materially reduce conversion likelihood.",
      rationale:
        "Material risks require explicit ownership and mitigation rather than passive monitoring.",
      expectedImpact:
        "Reduce avoidable deal loss, improve management visibility, and protect the forecast from hidden failure modes.",
      severity: clamp(
        (risk ?? 0)
        + criticalRisks * 20
        + Math.min(openRisks * 5, 20),
      ),
      opportunityImpact: 100,
      evidenceConfidence:
        risk !== null ? 95 : 75,
      urgency:
        criticalRisks > 0 ? 100 : 90,
      actions: [
        createAction({
          title: "Prioritize the top conversion risks",
          description:
            "Rank risks by probability, commercial impact, urgency, and ability to mitigate.",
          sequence: 1,
          ownerRole: "sales-manager",
          dueInHours: 12,
          completionCriteria: [
            "Top risks are explicitly ranked.",
            "Each risk has supporting evidence.",
            "Critical risks are escalated.",
          ],
        }),
        createAction({
          title: "Assign mitigation owners",
          description:
            "Create a concrete mitigation action, owner, due date, and success criterion for every material risk.",
          sequence: 2,
          ownerRole: "sales-manager",
          dueInHours: 24,
          completionCriteria: [
            "Every material risk has an owner.",
            "Mitigation dates are defined.",
            "Success criteria are measurable.",
          ],
        }),
        createAction({
          title: "Validate mitigation with customer evidence",
          description:
            "Confirm that completed mitigation actions changed the underlying customer or commercial condition.",
          sequence: 3,
          ownerRole: "opportunity-owner",
          dueInHours: 72,
          completionCriteria: [
            "Risk status reflects new evidence.",
            "Residual risk is documented.",
            "Win probability assumptions are updated.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "predictive-risk",
          label: "Predictive risk score",
          value: risk,
          reason:
            "The predictive risk level indicates material conversion exposure.",
          source: "risk",
        }),
        createEvidence({
          key: "critical-risks",
          label: "Critical risks",
          value: criticalRisks,
          reason:
            "Critical unresolved risks require immediate management attention.",
          source: "risk",
        }),
        createEvidence({
          key: "open-risks",
          label: "Open risks",
          value: openRisks,
          reason:
            "The number of unresolved risks increases execution complexity.",
          source: "risk",
        }),
      ],
      applicable: true,
    };
  },
};

const validateDiscoveryRule: SalesCoachingRule = {
  key: "validate-discovery",

  evaluate(context) {
    const completeness =
      normalizePercent(context.discoveryCompleteness);

    const gaps = [
      context.businessProblemConfirmed === false,
      context.decisionCriteriaConfirmed === false,
      context.decisionProcessConfirmed === false,
      context.timelineConfirmed === false,
    ].filter(Boolean).length;

    const incomplete =
      completeness !== null
      && completeness < 70;

    if (!incomplete && gaps === 0) {
      return createNotApplicable(
        this.key,
        "discovery",
        "medium",
      );
    }

    return {
      ruleKey: this.key,
      category: "discovery",
      effort: "medium",
      title: "Close critical discovery gaps",
      summary:
        "Important customer, decision, or timing information remains unvalidated.",
      rationale:
        "Incomplete discovery creates false confidence and causes late-stage surprises during approval, commercial review, or procurement.",
      expectedImpact:
        "Improve qualification quality and align the solution, commercial case, and close plan to verified customer requirements.",
      severity: clamp(
        (completeness === null
          ? 30
          : 100 - completeness)
        + gaps * 12,
      ),
      opportunityImpact: 85,
      evidenceConfidence:
        completeness !== null ? 90 : 70,
      urgency:
        context.proposalDelivered === true
          ? 95
          : 70,
      actions: [
        createAction({
          title: "Run a focused discovery validation",
          description:
            "Validate the business problem, measurable impact, decision criteria, decision process, timeline, and consequences of inaction.",
          sequence: 1,
          ownerRole: "opportunity-owner",
          dueInHours: 36,
          completionCriteria: [
            "Customer problem is explicitly confirmed.",
            "Decision process and criteria are documented.",
            "Timeline and consequences of delay are understood.",
          ],
        }),
        createAction({
          title: "Update the opportunity evidence",
          description:
            "Replace assumptions with customer-confirmed facts and record unresolved questions.",
          sequence: 2,
          ownerRole: "opportunity-owner",
          dueInHours: 48,
          completionCriteria: [
            "Assumptions are visibly separated from evidence.",
            "Missing information has an owner.",
            "Qualification status reflects the validated position.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "discovery-completeness",
          label: "Discovery completeness",
          value: completeness,
          reason:
            "Discovery coverage is below the recommended threshold.",
          source: "opportunity",
        }),
        createEvidence({
          key: "discovery-gaps",
          label: "Explicit discovery gaps",
          value: gaps,
          reason:
            "One or more critical customer decision areas are unconfirmed.",
          source: "opportunity",
        }),
      ],
      applicable: true,
    };
  },
};

const increaseActivityCadenceRule: SalesCoachingRule = {
  key: "increase-activity-cadence",

  evaluate(context) {
    const activity7 =
      context.activityCount7Days ?? 0;

    const activity30 =
      context.activityCount30Days ?? 0;

    const lowRecentActivity =
      activity7 < 2;

    const lowMonthlyActivity =
      activity30 < 5;

    if (!lowRecentActivity && !lowMonthlyActivity) {
      return createNotApplicable(
        this.key,
        "momentum",
        "low",
      );
    }

    return {
      ruleKey: this.key,
      category: "momentum",
      effort: "low",
      title: "Increase purposeful activity cadence",
      summary:
        "The opportunity has insufficient recent activity to sustain reliable momentum.",
      rationale:
        "Low activity cadence can indicate weak customer access, unclear next actions, or passive opportunity management.",
      expectedImpact:
        "Increase customer interaction quality and surface blockers before the opportunity becomes inactive.",
      severity: clamp(
        (2 - Math.min(activity7, 2)) * 25
        + (5 - Math.min(activity30, 5)) * 8,
      ),
      opportunityImpact: 65,
      evidenceConfidence: 85,
      urgency:
        context.winProbability.trend === "declining"
          ? 85
          : 65,
      actions: [
        createAction({
          title: "Create a seven-day engagement plan",
          description:
            "Schedule a small number of purposeful customer interactions tied to discovery, stakeholder access, commercial validation, or next-step execution.",
          sequence: 1,
          ownerRole: "opportunity-owner",
          dueInHours: 12,
          completionCriteria: [
            "Each planned activity has a business purpose.",
            "Activities target different opportunity gaps.",
            "Customer value is clear in every interaction.",
          ],
        }),
        createAction({
          title: "Review activity quality with the manager",
          description:
            "Confirm that activity is advancing customer decisions rather than increasing volume without impact.",
          sequence: 2,
          ownerRole: "sales-manager",
          dueInHours: 48,
          completionCriteria: [
            "Activity outcomes are reviewed.",
            "Low-value activity is removed.",
            "The next engagement priority is agreed.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "activity-7-days",
          label: "Activities in 7 days",
          value: activity7,
          reason:
            "Recent opportunity activity is below the expected cadence.",
          source: "activity",
        }),
        createEvidence({
          key: "activity-30-days",
          label: "Activities in 30 days",
          value: activity30,
          reason:
            "Monthly activity volume indicates insufficient sustained engagement.",
          source: "activity",
        }),
      ],
      applicable: true,
    };
  },
};

const protectWinningMomentumRule: SalesCoachingRule = {
  key: "protect-winning-momentum",

  evaluate(context) {
    const strongProbability =
      context.winProbability.probability >= 75;

    const improving =
      context.winProbability.trend === "improving";

    if (!strongProbability || !improving) {
      return createNotApplicable(
        this.key,
        "momentum",
        "medium",
      );
    }

    return {
      ruleKey: this.key,
      category: "momentum",
      effort: "medium",
      title: "Protect winning momentum",
      summary:
        "The opportunity has a strong and improving conversion profile that should be converted into firm customer commitments.",
      rationale:
        "High-probability opportunities can still slip when teams become passive, skip final validation, or fail to control approval and procurement steps.",
      expectedImpact:
        "Convert positive momentum into a controlled close plan while preserving customer confidence.",
      severity: 45,
      opportunityImpact: 95,
      evidenceConfidence:
        context.winProbability.confidence,
      urgency: 85,
      actions: [
        createAction({
          title: "Secure the next irreversible commitment",
          description:
            "Obtain a customer action that materially advances the decision, such as approval, executive confirmation, procurement initiation, or signed plan.",
          sequence: 1,
          ownerRole: "opportunity-owner",
          dueInHours: 24,
          completionCriteria: [
            "The commitment is customer-owned.",
            "The action materially advances the decision.",
            "Completion is recorded with evidence.",
          ],
        }),
        createAction({
          title: "Validate the complete close path",
          description:
            "Review remaining legal, procurement, security, commercial, technical, and executive dependencies.",
          sequence: 2,
          ownerRole: "sales-manager",
          dueInHours: 48,
          completionCriteria: [
            "All close dependencies are documented.",
            "Owners and due dates are assigned.",
            "No hidden approval stage remains.",
          ],
        }),
      ],
      evidence: [
        createEvidence({
          key: "probability",
          label: "Win probability",
          value: context.winProbability.probability,
          reason:
            "The opportunity has a strong predicted conversion profile.",
          source: "win-probability",
        }),
        createEvidence({
          key: "probability-trend",
          label: "Probability trend",
          value: context.winProbability.trend,
          reason:
            "The predicted conversion profile is improving.",
          source: "win-probability",
        }),
      ],
      applicable: true,
    };
  },
};

export const salesCoachingRules:
  readonly SalesCoachingRule[] = [
    recoverEngagementRule,
    expandStakeholderCoverageRule,
    secureExecutiveSponsorRule,
    stabilizeCloseDateRule,
    strengthenCommercialCaseRule,
    improveForecastConfidenceRule,
    counterCompetitivePressureRule,
    accelerateNextStepRule,
    resolveHighRiskSignalsRule,
    validateDiscoveryRule,
    increaseActivityCadenceRule,
    protectWinningMomentumRule,
  ];

export const createSalesCoachingRules = ():
  readonly SalesCoachingRule[] =>
  salesCoachingRules.map((rule) => ({ ...rule }));
