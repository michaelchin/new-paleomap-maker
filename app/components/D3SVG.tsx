"use client";

import React, { useEffect, useState } from "react";

import * as d3 from "d3";
import { useDrag } from "../hooks/useDrag";
import { useDrawCoastlines } from "../hooks/useDrawCoastlines";
import { useDrawGraticule } from "../hooks/useDrawGraticule";
import { useGetProjection } from "../hooks/useGetProjection";
import { useZoom } from "../hooks/useZoom";

interface D3SVGPros {
  paleoAge: number;
  projName: string;
  modelName: string;
  refresh: boolean;
}

/**
 *
 * @param {*} param0
 * @returns
 */
const D3SVG: React.FC<D3SVGPros> = ({
  paleoAge,
  projName,
  modelName,
  refresh,
}: D3SVGPros) => {
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
  }, [refresh]);

  useEffect(() => {
    let svg = d3.select(d3SVGRef.current);
    svg
      .transition()
      .tween(
        "resize",
        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
      );
  }, []);

  useDrag(d3SVGRef, projection);

  useZoom(d3SVGRef, projection);

  useDrawGraticule(d3SVGRef, projection);

  useDrawCoastlines(d3SVGRef, paleoAge, projection, modelName);

  return (
    <svg
      ref={d3SVGRef}
      id="map-svg"
      style={{
        aspectRatio: "2/1",
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
        background: "lightgrey",
      }}
    ></svg>
  );
};

export default D3SVG;
