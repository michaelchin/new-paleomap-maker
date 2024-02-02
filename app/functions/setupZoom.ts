import * as d3 from "d3";

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
    if (event.transform.k > 0.5) {
      projection.proj.scale(scale0 * event.transform.k);
      let path = d3.geoPath().projection(projection.proj);
      svg.selectAll(".coastline").attr("d", path);
      svg.selectAll(".graticule").attr("d", path);

      if (projection.name.toLowerCase() == "orthographic") {
        //keep the size of points in a globe projection
        svg.selectAll(".path-point").attr("d", function (d) {
          return d3.geoPath().projection(projection.proj)(
            d3
              .geoCircle()
              .center([d[0], d[1]])
              .radius(d[2] / event.transform.k)
              .precision(10)()
          );
        });
      } else {
        // move the points to new locations after zooming in a rectangular projection
        svg
          .selectAll(".circle-point")
          .attr("cx", function (d) {
            return projection.proj(d)[0];
          })
          .attr("cy", function (d) {
            return projection.proj(d)[1];
          });
      }

      //move the point labels to the new locations
      svg
        .selectAll(".point-label")
        .attr("x", function (d) {
          return projection.proj(d)[0];
        })
        .attr("y", function (d) {
          return projection.proj(d)[1];
        });
    }
  });

  svg.call(zoom);
};
