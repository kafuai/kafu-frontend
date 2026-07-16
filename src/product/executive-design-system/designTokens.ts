export const executiveDesignTokens = {
  colors: {
    light: {
      background: {
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
        muted: "#F1F5F9",
        elevated: "#FFFFFF",
      },
      text: {
        primary: "#0F172A",
        secondary: "#475569",
        muted: "#64748B",
        inverse: "#F8FAFC",
      },
      border: {
        default: "#E2E8F0",
        strong: "#CBD5E1",
        focus: "#3B82F6",
      },
    },
    dark: {
      background: {
        canvas: "#07111F",
        surface: "#0F1B2D",
        muted: "#162338",
        elevated: "#18263B",
      },
      text: {
        primary: "#F8FAFC",
        secondary: "#CBD5E1",
        muted: "#94A3B8",
        inverse: "#0F172A",
      },
      border: {
        default: "#26364E",
        strong: "#3A4B64",
        focus: "#60A5FA",
      },
    },
    brand: {
      primary: "#2563EB",
      hover: "#1D4ED8",
      pressed: "#1E40AF",
      subtle: "#EFF6FF",
    },
    semantic: {
      success: "#15803D",
      successBackground: "#F0FDF4",
      warning: "#B45309",
      warningBackground: "#FFFBEB",
      critical: "#B91C1C",
      criticalBackground: "#FEF2F2",
      information: "#1D4ED8",
      informationBackground: "#EFF6FF",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    xxxl: "64px",
  },
  radius: {
    small: "8px",
    card: "16px",
    dialog: "20px",
    container: "24px",
    pill: "9999px",
  },
  typography: {
    hero: {
      fontSize: "48px",
      lineHeight: "1.1",
      fontWeight: 700,
    },
    pageTitle: {
      fontSize: "36px",
      lineHeight: "1.2",
      fontWeight: 700,
    },
    sectionTitle: {
      fontSize: "28px",
      lineHeight: "1.3",
      fontWeight: 650,
    },
    cardTitle: {
      fontSize: "20px",
      lineHeight: "1.4",
      fontWeight: 600,
    },
    body: {
      fontSize: "16px",
      lineHeight: "1.6",
      fontWeight: 400,
    },
    caption: {
      fontSize: "14px",
      lineHeight: "1.5",
      fontWeight: 400,
    },
    label: {
      fontSize: "12px",
      lineHeight: "1.4",
      fontWeight: 600,
    },
  },
  shadow: {
    small: "0 1px 2px rgba(15, 23, 42, 0.06)",
    medium: "0 8px 24px rgba(15, 23, 42, 0.08)",
    large: "0 20px 48px rgba(15, 23, 42, 0.12)",
  },
  motion: {
    fast: "150ms",
    normal: "220ms",
    slow: "320ms",
  },
} as const;

export type ExecutiveDesignTokens = typeof executiveDesignTokens;