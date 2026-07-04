export const foundationConfig = {
  executive: {
    defaultTheme: "executive",
    animations: true,
    printEnabled: true,
    shareEnabled: true,
  },

  ai: {
    confidenceThreshold: 80,
    recommendationLimit: 5,
  },

  ui: {
    rounded: "2rem",
    spacing: "comfortable",
  },
} as const;