import * as d3 from "d3";
import { useEffect } from "react";

export const useZoom = (svgRef, projection) => {
  useEffect(() => {
    if (projection.name == null) {
      return () => {};
    }
    let svg = d3.select(svgRef.current);
    let svgHeight = svgRef.current.clientHeight,
      svgWidth = svgRef.current.clientWidth;

    let scale0;
    if (projection.name != "Orthographic") {
      scale0 = (svgWidth - 1) / 2 / Math.PI;
    } else {
      scale0 = (svgWidth - 40) / 4;
    }
    // zoom and pan
    var zoom = d3
      .zoom()
      //.scale(scale0)
      //.translate([width / 2, height / 2])
      //.scaleExtent([scale0, 8 * scale0])
      .on("zoom", function (event, d) {
        //console.log(event);
        projection.proj.scale(scale0 * event.transform.k);

        if (projection.name != "Orthographic") {
          projection.proj.translate(event.transform.translate());
        }
        let path = d3.geoPath().projection(projection.proj);
        svg.selectAll("path").attr("d", path);
      });

    svg.call(zoom);
  }, [projection]);
};
