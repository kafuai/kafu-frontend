import { ImageResponse } from "next/og";

export const alt =
  "KAFU AI — Enterprise Intelligence for Better Decisions and Governed Execution";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at 78% 28%, rgba(105, 209, 213, 0.28), transparent 32%), linear-gradient(135deg, #071321 0%, #0a1f31 58%, #0b4651 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 82px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          KAFU AI
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              color: "#69d1d5",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.12em",
              marginBottom: 24,
              textTransform: "uppercase",
            }}
          >
            Enterprise Intelligence
          </div>

          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1.06,
              maxWidth: 960,
            }}
          >
            Connect Knowledge. Improve Decisions. Execute with Confidence.
          </div>

          <div
            style={{
              color: "#cbd5e1",
              fontSize: 25,
              lineHeight: 1.45,
              marginTop: 30,
              maxWidth: 920,
            }}
          >
            A unified enterprise platform connecting organizational knowledge,
            executive decision-making, governance, and AI-enabled execution.
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            color: "rgba(255, 255, 255, 0.72)",
            display: "flex",
            fontSize: 20,
            fontWeight: 500,
            justifyContent: "flex-end",
            letterSpacing: "0.04em",
          }}
        >
          kafuai.com
        </div>
      </div>
    ),
    size
  );
}