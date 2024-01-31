import * as d3 from "d3";

export const setupDrag = (svgRef, projection) => {
  if (projection.name == null || projection.proj == null) {
    return;
  }
  let svg = d3.select(svgRef.current);

  svg.call(
    d3.drag().on("drag", (event, d) => {
      if (projection.name.toLowerCase() == "orthographic") {
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
      //svg.selectAll("path").attr("d", path);
      svg.selectAll(".coastline").attr("d", path);
      svg.selectAll(".graticule").attr("d", path);
      svg.selectAll(".pathPoint").attr("d", path);

      svg
        .selectAll("circle")
        .attr("cx", function (d) {
          return projection.proj(d)[0];
        })
        .attr("cy", function (d) {
          return projection.proj(d)[1];
        });
    })
  );
};
