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

        //hide the label when it is on the other side of the globe
        svg.selectAll(".point-label").attr("display", function (d) {
          //get the location of the label
          let point = d3.geoPath().projection(projection.proj)(
            d3.geoCircle().center([d[0], d[1]]).radius(1).precision(10)()
          );
          //if the location is not visible, not show label
          if (point != null) {
            return "inline";
          } else {
            return "none";
          }
        });

        //calculate the new geoCircle path with an appropiate radius
        svg.selectAll(".path-point").attr("d", function (d) {
          let scale0 = (svgRef.current.clientWidth - 40) / 4;
          return d3.geoPath().projection(projection.proj)(
            d3
              .geoCircle()
              .center([d[0], d[1]])
              .radius((d[2] / projection.proj.scale()) * scale0)
              .precision(10)()
          );
        });
      } else {
        // for rectangular projection
        let translate = projection.proj.translate();
        var tx = event.dx + translate[0];
        var ty = event.dy + translate[1];
        projection.proj.translate([tx, ty]);
      }

      let path = d3.geoPath().projection(projection.proj);
      //coastline and graticule do not need special treatement
      svg.selectAll(".coastline").attr("d", path);
      svg.selectAll(".graticule").attr("d", path);

      //move the circle points to the new locations
      svg
        .selectAll(".circle-point")
        .attr("cx", function (d) {
          return projection.proj(d)[0];
        })
        .attr("cy", function (d) {
          return projection.proj(d)[1];
        });

      //move the point labels to the new locations
      svg
        .selectAll(".point-label")
        .attr("x", function (d) {
          return projection.proj(d)[0];
        })
        .attr("y", function (d) {
          return projection.proj(d)[1];
        });
    })
  );
};
