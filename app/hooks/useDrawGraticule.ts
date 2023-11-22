import * as d3 from "d3";

export const useDrawGraticule = (svgRef, projection) => {
  let svg = d3.select(svgRef);

  var path = d3.geoPath().projection(projection);

  let graticuleLayer = svg.append("g");

  var graticule = d3.geoGraticule();
  graticuleLayer
    .append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
};
