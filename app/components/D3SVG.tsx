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
}

/**
 *
 * @param {*} param0
 * @returns
 */
const D3SVG: React.FC<D3SVGPros> = ({ time, projName }: D3SVGPros) => {
  const d3SVGRef = React.useRef(null);

  const [projection, setProjection] = useState({
    name: null,
    proj: null,
  });

  useEffect(() => {
    setProjection({
      name: projName,
      proj: useGetProjection(
        projName,
        d3SVGRef.current.clientHeight,
        d3SVGRef.current.clientWidth
      ),
    });
  }, [projName]);

  useDrag(d3SVGRef, projection);

  useZoom(d3SVGRef, projection);

  useDrawGraticule(d3SVGRef, projection);

  useDrawCoastlines(d3SVGRef, time, projection);

  return (
    <svg
      ref={d3SVGRef}
      style={{
        height: "50vw",
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
        background: "lightgrey",
      }}
    ></svg>
  );
};

export default D3SVG;
