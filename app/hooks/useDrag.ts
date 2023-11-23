import * as d3 from "d3";
import { useEffect } from "react";

export const useDrag = (svgRef, projection) => {
  useEffect(() => {
    if (projection.name == null) {
      return () => {};
    }
    let svg = d3.select(svgRef.current);

    svg.call(
      d3.drag().on("drag", (event, d) => {
        if (projection.name == "Orthographic") {
          const sensitivity = 75;
          const rotate = projection.proj.rotate();
          const k = sensitivity / projection.proj.scale();
          projection.proj.rotate([
            rotate[0] + event.dx * k,
            rotate[1] - event.dy * k,
          ]);
        } else {
          let translate = projection.proj.translate();
          var tx = event.dx + translate[0];
          var ty = event.dy + translate[1];
          projection.proj.translate([tx, ty]);
        }
        let path = d3.geoPath().projection(projection.proj);
        svg.selectAll("path").attr("d", path);
      })
    );
  }, [projection]);
};
