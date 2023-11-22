"use client";

import Link from "next/link";
import React from "react";
import D3SVG from "../components/D3SVG";

export default function D3MapPage() {
  const [time, setTime] = React.useState(100);
  const [projName, setProjName] = React.useState("Orthographic");

  return (
    <>
      <h1>D3 Map Page</h1>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>

      <D3SVG time={time} projName={projName} svgHeight={600} svgWidth={1200} />
    </>
  );
}
