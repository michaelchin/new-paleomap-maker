import * as d3 from "d3";

/**
 *
 * @param svgRef
 * @param lon
 * @param lat
 * @param projection
 */
export const drawPoint = (svgRef, lon, lat, projection, radius) => {
  let svg = d3.select(svgRef.current);
  let layer = svg.append("g").attr("class", "points");
  let proj = projection.proj;
  let projName = projection.name;

  if (!proj) {
    return;
  }
  console.log(projection);
  if (projName.toLowerCase() == "orthographic") {
    let circle = d3.geoCircle();
    let path = d3.geoPath().projection(proj);

    layer
      .append("path")
      //.datum({type: "Point", coordinates: [d[1], d[0]]})
      .datum(circle.center([lon, lat]).radius(radius).precision(10))
      .attr("d", path)
      .attr("class", "pathPoint")
      .append("svg:title")
      .text(function (d) {
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
};
