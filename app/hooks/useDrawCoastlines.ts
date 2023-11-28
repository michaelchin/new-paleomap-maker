import * as d3 from "d3";
import { useEffect } from "react";

export const useDrawCoastlines = (svgRef, paleoAge, projection, modelName) => {
  useEffect(() => {
    if (projection.name == null) {
      return () => {};
    }

    let svg = d3.select(svgRef.current);
    var path = d3.geoPath().projection(projection.proj);
    svg.selectAll(".coastlines").remove();

    d3.json(
      "https://gws.gplates.org/reconstruct/coastlines_low/?time=" +
        //"http://localhost:18000/reconstruct/coastlines_low/?time=" +
        paleoAge +
        "&model=" +
        modelName +
        "&avoid_map_boundary&min_area=2000"
    ).then(function (data: any) {
      //console.log(data);
      let coastlinsLayer = svg.append("g").attr("class", "coastlines");
      coastlinsLayer
        .selectAll(".coastline")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "coastline")
        .on("mouseover", function (d, i) {
          d3.select(this).style("fill-opacity", 0.5);
          d3.select(this).style("stroke-width", "1px");
        })
        .on("mouseout", function (d, i) {
          d3.select(this).style("fill-opacity", 1);

          d3.select(this).style("stroke-width", "0px");
        });
    });
  }, [projection]);
};
