import * as d3 from "d3";

export const getProjection = (
  projectionName: string,
  svgHeight: number,
  svgWidth: number
) => {
  if (projectionName.toLowerCase() == "orthographic") {
    let oScale0 = (svgWidth - 40) / 4;
    return d3
      .geoOrthographic()
      .scale(oScale0)
      .translate([svgWidth / 2, svgHeight / 2])
      .clipAngle(90)
      .precision(0.1);
  } else {
    let eScale0 = (svgWidth - 1) / 2 / Math.PI;
    return d3
      .geoEquirectangular()
      .scale(eScale0)
      .rotate([0.1, 0, 0])
      .translate([svgWidth / 2, svgHeight / 2])
      .precision(0.1);
  }
};
