"use client";

import React from "react";
import { useQRCode } from "next-qrcode";

export default function QrCode({ url }: { url: string }) {
  const { Canvas } = useQRCode();

  return (
    <Canvas
      text={url}
      options={{
        errorCorrectionLevel: "M",
        margin: 3,
        scale: 10,
        width: 200,
        color: {
          dark: "#010599FF",
          light: "#FFBF60FF",
        },
      }}
    />
  );
}
