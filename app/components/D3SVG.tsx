"use client";

import React, { useEffect, useState } from "react";

import { useDrag } from "../hooks/useDrag";
import { useDrawCoastlines } from "../hooks/useDrawCoastlines";
import { useDrawGraticule } from "../hooks/useDrawGraticule";
import { useGetProjection } from "../hooks/useGetProjection";
import { useZoom } from "../hooks/useZoom";

interface D3SVGPros {
  time: number;
  projName: string;
  svgHeight: number;
  svgWidth: number;
}

/**
 *
 * @param {*} param0
 * @returns
 */
const D3SVG: React.FC<D3SVGPros> = ({
  time,
  projName,
  svgHeight,
  svgWidth,
}: D3SVGPros) => {
  const d3SVGRef = React.useRef(null);

  const [projection, setProjection] = useState({
    name: null,
    proj: null,
  });

  useEffect(() => {
    setProjection({
      name: projName,
      proj: useGetProjection(projName, svgHeight, svgWidth),
    });
  }, [projName, svgHeight, svgWidth]);

  useDrag(d3SVGRef, projection);

  useZoom(d3SVGRef, projection);

  useDrawGraticule(d3SVGRef, projection);

  useDrawCoastlines(d3SVGRef, time, projection);

  return (
    <svg
      ref={d3SVGRef}
      style={{
        height: svgHeight,
        width: svgWidth,
        marginRight: "0px",
        marginLeft: "0px",
        background: "lightgrey",
      }}
    ></svg>
  );
};

export default D3SVG;
