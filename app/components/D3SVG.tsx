"use client";

import React, { useEffect, useState } from "react";

import * as d3 from "d3";
import { drawCoastlines } from "../functions/drawCoastlines";
import { drawGraticule } from "../functions/drawGraticule";
import { drawPoint } from "../functions/drawPoint";
import { getProjection } from "../functions/getProjection";
import { setupDrag } from "../functions/setupDrag";
import { setupZoom } from "../functions/setupZoom";

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
      proj: getProjection(
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

  useEffect(() => {
    if (projection.name == null || projection.proj == null) {
      return () => {};
    }
    setupDrag(d3SVGRef, projection);

    setupZoom(d3SVGRef, projection);

    drawCoastlines(d3SVGRef, paleoAge, projection, modelName).then(() => {
      drawPoint(d3SVGRef, 0, 0, projection, 1);
      drawGraticule(d3SVGRef, projection);
    });
  }, [projection]);

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
