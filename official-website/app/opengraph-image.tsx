import { ImageResponse } from "next/og";

export const alt = "KAFU AI Enterprise Intelligence Platform";

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

        <div style={{ display: "flex", flexDirection: "column" }}>
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
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1.06,
              maxWidth: 900,
            }}
          >
            Turn organizational knowledge into executive clarity.
          </div>

          <div
            style={{
              color: "#cbd5e1",
              fontSize: 25,
              lineHeight: 1.45,
              marginTop: 30,
              maxWidth: 850,
            }}
          >
            Knowledge, decision intelligence and coordinated AI execution in one
            governed enterprise environment.
          </div>
        </div>
      </div>
    ),
    size,
  );
}