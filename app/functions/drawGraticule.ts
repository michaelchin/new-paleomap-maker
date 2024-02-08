import * as d3 from "d3";

export const drawGraticule = (svgRef, projection) => {
  if (projection.name == null || projection.proj == null) {
    return;
  }

  let svg = d3.select(svgRef.current);

  var path = d3.geoPath().projection(projection.proj);

  svg.selectAll(".graticules").remove();

  let graticuleLayer = svg
    .append("g")
    .attr("class", "graticules")
    .style("fill", "none")
    .style("stroke", "#777")
    .style("stroke-width", "0.5px")
    .style("stroke-opacity", "0.5");

  var graticule = d3.geoGraticule();
  graticuleLayer
    .append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
};
