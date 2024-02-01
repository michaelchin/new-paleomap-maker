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
  lon: number,
  lat: number,
  projection,
  radius: number
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
        console.log(d);
        return d3.geoPath().projection(proj)(
          d3.geoCircle().center([d[0], d[1]]).radius(d[2]).precision(10)()
        );
      })
      .attr("class", "pathPoint")
      .append("svg:title")
      .text(function (d) {
        console.log(d);
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
      .attr("r", 3)
      //.attr("d",path)
      .style("fill", "red")
      .attr("class", "pathPoint")
      .append("svg:title")
      .text(function (d) {
        return "Longitude: " + d[0] + "\nLatitude: " + d[1];
      });
  }
  layer
    .append("text")
    .datum([lon, lat])
    .attr("x", function (d) {
      return proj(d)[0];
    })
    .attr("y", function (d) {
      return proj(d)[1];
    })
    .text(function (d) {
      return "test-txt";
    })
    .attr("class", "pointLabel")
    .style("font-size", "14px");
};
