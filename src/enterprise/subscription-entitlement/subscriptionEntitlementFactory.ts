import { SubscriptionWorkspaceModel } from "./subscriptionEntitlementTypes";
import { SubscriptionPlan } from "./subscriptionPlan";
import { EntitlementPolicy } from "./entitlementPolicy";
import { FeatureAccess } from "./featureAccess";
import { LicenseManagement } from "./licenseManagement";
import { SubscriptionLifecycle } from "./subscriptionLifecycle";
import { BillingEntitlement } from "./billingEntitlement";
import { QuotaManagement } from "./quotaManagement";
import { UsageTracking } from "./usageTracking";
import { EntitlementAudit } from "./entitlementAudit";

export class SubscriptionEntitlementFactory {
  static create(workspace: SubscriptionWorkspaceModel) {
    return {
      plan: new SubscriptionPlan(workspace.plan),
      policy: new EntitlementPolicy(workspace.entitlements),
      access: new FeatureAccess(workspace.entitlements),
      license: new LicenseManagement(workspace.plan),
      lifecycle: new SubscriptionLifecycle(workspace.plan),
      billing: new BillingEntitlement(workspace.plan),
      quota: new QuotaManagement(workspace.plan),
      usage: new UsageTracking(workspace.entitlements),
      audit: new EntitlementAudit(workspace.entitlements),
    };
  }
}
