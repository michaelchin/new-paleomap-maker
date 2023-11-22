"use client";

import React, { useEffect } from "react";

import { useDrag } from "../hooks/useDrag";
import { useDrawCoastlines } from "../hooks/useDrawCoastlines";
import { useDrawGraticule } from "../hooks/useDrawGraticule";
import { useGetProjection } from "../hooks/useGetProjection";

/**
 *
 * @param {*} param0
 * @returns
 */
function D3SVG({ time, projName, svgHeight, svgWidth }) {
  const d3SVGRef = React.useRef(null);

  useEffect(() => {
    let p = useGetProjection(projName, svgHeight, svgWidth);

    useDrawCoastlines(d3SVGRef.current, time, p);
    return () => {};
  }, [time, projName]);

  useEffect(() => {
    let p = useGetProjection(projName, svgHeight, svgWidth);

    useDrag(d3SVGRef.current, p);

    useDrawGraticule(d3SVGRef.current, p);

    return () => {};
  }, [projName]);

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
}

export default D3SVG;
