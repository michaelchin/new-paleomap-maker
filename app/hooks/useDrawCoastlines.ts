import * as d3 from "d3";
import { useEffect } from "react";

export const useDrawCoastlines = (svgRef, time, projection, modelName) => {
  useEffect(() => {
    if (projection.name == null) {
      return () => {};
    }

    let svg = d3.select(svgRef.current);
    var path = d3.geoPath().projection(projection.proj);
    svg.selectAll(".coastlines").remove();

    d3.json(
      "https://gws.gplates.org/reconstruct/coastlines_low/?time=" +
        time +
        "&model=" +
        modelName +
        "&avoid_map_boundary&min_area=200"
    ).then(function (data: any) {
      //console.log(data);

      let coastlinsLayer = svg.append("g").attr("class", "coastlines");
      //coastlinsLayer.selectAll(".coastline").remove();
      coastlinsLayer
        .selectAll(".coastline")
        .data(data.features)
        //.attr("class", "coastlines")
        //.attr("d", path)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "coastline")
        .on("mouseover", function (d, i) {
          d3.select(this).style("fill-opacity", 0.7);
          d3.select(this).style("stroke", "red");
          d3.select(this).style("stroke-width", "1px");
        })
        .on("mouseout", function (d, i) {
          d3.select(this).style("fill-opacity", 0.5);
          d3.select(this).style("stroke", "blue");
          d3.select(this).style("stroke-width", ".25px");
        });
    });
  }, [projection]);
};
