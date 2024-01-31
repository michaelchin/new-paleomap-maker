import * as d3 from "d3";
import { drawPoint } from "./drawPoint";

export const setupZoom = (svgRef, projection) => {
  if (projection.name == null || projection.proj == null) {
    return;
  }
  let svg = d3.select(svgRef.current);
  let svgHeight = svgRef.current.clientHeight,
    svgWidth = svgRef.current.clientWidth;

  let scale0;
  if (projection.name.toLowerCase() != "orthographic") {
    scale0 = (svgWidth - 1) / 2 / Math.PI;
  } else {
    scale0 = (svgWidth - 40) / 4;
  }

  var zoom = d3.zoom().on("zoom", function (event, d) {
    //console.log(event);
    if (event.transform.k > 0.3) {
      /*
      let translate = projection.proj.translate();
      var tx = translate[0];
      var ty = translate[1];
      projection.proj.translate([
        tx + event.transform.x,
        ty + event.transform.y,
      ]);
      let path = d3.geoPath().projection(projection.proj);
     
      projection.proj.translate([tx, ty]);
    */
      projection.proj.scale(scale0 * event.transform.k);
      let path = d3.geoPath().projection(projection.proj);
      svg.selectAll(".coastline").attr("d", path);
      svg.selectAll(".graticule").attr("d", path);
      //svg.selectAll(".pathPoint").attr("d", path);
      svg.selectAll(".pathPoint").remove();
      drawPoint(svgRef, 0, 0, projection, 1 / event.transform.k);

      console.log(event.transform);
    }
  });

  svg.call(zoom);
};
