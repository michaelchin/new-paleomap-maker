import assert from "assert";
import * as d3 from "d3";
import { drawPoint } from "./drawPoint";

export const drawCities = (svgRef, paleoAge, projection, modelName) => {
  let svg = d3.select(svgRef.current);
  svg.selectAll(".cities").remove();

  return d3
    .json(
      //"https://gws.gplates.org/reconstruct/get_cities/?time=" +
      "http://localhost:18000/earth/get_cities?time=" +
        paleoAge +
        "&model=" +
        modelName
    )
    .then(function (data: any) {
      console.log(data);
      assert(data["names"].length == data["lons"].length);
      assert(data["lats"].length == data["lons"].length);
      let cityLayer = svg.append("g").attr("class", "cities");
      for (let i = 0; i < data["names"].length; i++) {
        if (data["lons"][i] == null || data["lats"][i] == null) continue;
        drawPoint(
          cityLayer,
          projection,
          data["lons"][i],
          data["lats"][i],
          data["names"][i],
          1,
          "city"
        );
      }
    });
};
