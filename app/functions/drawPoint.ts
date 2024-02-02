import * as d3 from "d3";

/**
 *
 * @param layer
 * @param lon
 * @param lat
 * @param projection
 */
export const drawPoint = (
  layer,
  projection,
  lon: number,
  lat: number,
  label: string = "",
  radius: number = 1,
  className: string = ""
) => {
  let proj = projection.proj;
  let projName = projection.name;

  if (proj == null || projName == null) {
    return;
  }
  //console.log(projection);
  if (projName.toLowerCase() == "orthographic") {
    layer
      .append("path")
      .datum([lon, lat, radius])
      .attr("d", function (d) {
        return d3.geoPath().projection(proj)(
          d3.geoCircle().center([d[0], d[1]]).radius(d[2]).precision(10)()
        );
      })
      .attr("class", "path-point " + className)
      .append("svg:title")
      .text(function (d) {
        //console.log(d);
        return "Longitude: " + d[0] + "\nLatitude: " + d[1];
      });
  } else {
    layer
      .append("circle")
      .datum([lon, lat])
      .attr("cx", function (d) {
        return proj(d)[0];
      })
      .attr("cy", function (d) {
        return proj(d)[1];
      })
      .attr("r", function (d) {
        return 5;
      })
      .style("fill", "blue")
      .attr("class", "circle-point " + className)
      .append("svg:title")
      .text(function (d) {
        return "Longitude: " + d[0] + "\nLatitude: " + d[1];
      });
  }

  // add point label
  layer
    .append("text")
    .datum([lon, lat, label])
    .attr("x", function (d) {
      return proj(d)[0];
    })
    .attr("y", function (d) {
      return proj(d)[1];
    })
    .text(function (d) {
      return d[2];
    })
    .attr("class", "point-label")
    .style("font-size", "14px");
};
