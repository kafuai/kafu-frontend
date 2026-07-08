export type MarketingPersonalizationProfile = {
  contactId: string;
  attributes: Record<string, string>;
};

export function personalizeTemplate(
  template: string,
  profile: MarketingPersonalizationProfile,
): string {
  return Object.entries(profile.attributes).reduce(
    (content, [key, value]) =>
      content.replaceAll(`{{${key}}}`, value),
    template,
  );
}
