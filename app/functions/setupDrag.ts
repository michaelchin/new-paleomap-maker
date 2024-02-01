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

        svg
          .selectAll(".pointLabel")
          .attr("display", function (d) {
            let p = d3.select(".pathPoint");
            if (p.attr("d") != null) {
              return "inline";
            } else {
              return "none";
            }
          })
          .attr("x", function (d) {
            return projection.proj(d)[0];
          })
          .attr("y", function (d) {
            return projection.proj(d)[1];
          });

        svg.selectAll(".pathPoint").attr("d", function (d) {
          return d3.geoPath().projection(projection.proj)(
            d3.geoCircle().center([d[0], d[1]]).radius(d[2]).precision(10)()
          );
        });
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

      svg
        .selectAll("circle")
        .attr("cx", function (d) {
          return projection.proj(d)[0];
        })
        .attr("cy", function (d) {
          return projection.proj(d)[1];
        });

      svg
        .selectAll(".pointLabel")
        .attr("x", function (d) {
          return projection.proj(d)[0];
        })
        .attr("y", function (d) {
          return projection.proj(d)[1];
        });
    })
  );
};
