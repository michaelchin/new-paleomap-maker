"use client";

import React, { useEffect, useState } from "react";

import * as d3 from "d3";
import { drawCities } from "../functions/drawCities";
import { drawCoastlines } from "../functions/drawCoastlines";
import { drawGraticule } from "../functions/drawGraticule";
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
    svg.attr("width", d3SVGRef.current.clientWidth);
    svg.attr("height", d3SVGRef.current.clientHeight);
    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white");
  }, []);

  useEffect(() => {
    if (projection.name == null || projection.proj == null) {
      return () => {};
    }
    setupDrag(d3SVGRef, projection);

    setupZoom(d3SVGRef, projection);

    drawCoastlines(d3SVGRef, paleoAge, projection, modelName).then(() => {
      drawGraticule(d3SVGRef, projection);
      drawCities(d3SVGRef, paleoAge, projection, modelName);
    });
  }, [projection]);

  return (
    <div
      id="svg-container"
      style={{
        aspectRatio: "2/1",
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
        background: "white",
      }}
    >
      <svg ref={d3SVGRef} id="map-svg" width="100%" height="100%"></svg>
    </div>
  );
};

export default D3SVG;
