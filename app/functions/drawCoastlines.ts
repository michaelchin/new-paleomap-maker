import * as d3 from "d3";
import { GWS_SERVER_URL } from "../gSettings";
/**
 *
 * @param svgRef
 * @param paleoAge
 * @param projection
 * @param modelName
 */
export const drawCoastlines = async (
  svgRef,
  paleoAge,
  projection,
  modelName
) => {
  let svg = d3.select(svgRef.current);
  var path = d3.geoPath().projection(projection.proj);
  svg.selectAll(".coastlines").remove();

  return d3
    .json(
      GWS_SERVER_URL +
        "/reconstruct/coastlines_low/?time=" +
        paleoAge +
        "&model=" +
        modelName +
        "&avoid_map_boundary&min_area=2000"
    )
    .then(function (data: any) {
      //console.log(data);
      let coastlinsLayer = svg.append("g").attr("class", "coastlines");
      coastlinsLayer
        .selectAll(".coastline")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "coastline")
        .style("fill-opacity", 1)
        .style("stroke", "blue")
        .style("stroke-width", "0px")
        .style("fill", "gray")
        .on("mouseover", function (d, i) {
          d3.select(this).style("fill-opacity", 0.5);
          d3.select(this).style("stroke-width", "1px");
        })
        .on("mouseout", function (d, i) {
          d3.select(this).style("fill-opacity", 1);
          d3.select(this).style("stroke-width", "0px");
        });
    });
};
