import * as d3 from "d3";
import { useGetProjection } from "./useGetProjection";

export const useDrawGraticule = (svgRef, projectionName) => {
  let svg = d3.select(svgRef);
  let svgHeight = svgRef.clientHeight,
    svgWidth = svgRef.clientWidth;

  var projection = useGetProjection(projectionName, svgHeight, svgWidth);

  var path = d3.geoPath().projection(projection);

  let graticuleLayer = svg.append("g");

  var graticule = d3.geoGraticule();
  graticuleLayer
    .append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
};
