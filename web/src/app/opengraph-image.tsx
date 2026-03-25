import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: 60,
          fontWeight: "bold",
        }}
      >
        Hooktrace
        <div style={{ fontSize: 32, marginTop: 20 }}>
          Webhook Debugging & Retry Platform
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}