import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(145deg, #071321 0%, #0b3441 65%, #0c7d88 100%)",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "rgba(255,255,255,0.05)",
            border: "4px solid rgba(255,255,255,0.12)",
            borderRadius: 30,
            color: "#ffffff",
            display: "flex",
            fontSize: 74,
            fontWeight: 700,
            height: 122,
            justifyContent: "center",
            letterSpacing: "-0.08em",
            width: 122,
          }}
        >
          K
        </div>
      </div>
    ),
    size,
  );
}