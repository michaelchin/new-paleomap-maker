import * as d3 from "d3";

export const useDrag = (svgRef, projection) => {
  let svg = d3.select(svgRef);
  svg.call(
    d3.drag().on("drag", (event, d) => {
      const sensitivity = 75;
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
      let path = d3.geoPath().projection(projection);
      svg.selectAll("path").attr("d", path);
    })
  );
};
