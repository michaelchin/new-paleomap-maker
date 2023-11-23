import * as d3 from "d3";
import { useEffect } from "react";

export const useDrawGraticule = (svgRef, projection) => {
  useEffect(() => {
    if (projection.name == null) {
      return () => {};
    }

    let svg = d3.select(svgRef.current);

    var path = d3.geoPath().projection(projection.proj);

    let graticuleLayer = svg.append("g");

    var graticule = d3.geoGraticule();
    graticuleLayer
      .append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);
  }, [projection]);
};
