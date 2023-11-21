import * as d3 from 'd3';

export const useDrawCoastlines = (svgRef, time, projection) => {
    let svg = d3.select(svgRef)

    let svgHeight = svgRef.clientHeight, svgWidth = svgRef.clientWidth

    const eScale0 = (svgWidth - 1) / 2 / Math.PI, oScale0 = (svgHeight - 1) / 4;

    var projOrtho = d3.geoOrthographic()
        .scale(oScale0)
        .translate([svgWidth / 2, svgHeight / 2])
        .clipAngle(90)
        .precision(.1);
    var projRect = d3.geoEquirectangular()
        .scale(eScale0)
        .rotate([0.1, 0, 0])
        .translate([svgWidth / 2, svgHeight / 2])
        .precision(.1);

    var projection = projOrtho;

    var path = d3.geoPath().projection(projection);

    let coastlinsLayer = svg.append('g');

    d3.json("https://gws.gplates.org/reconstruct/coastlines_low/?time=" + time + '&avoid_map_boundary')
        .then(function (data) {
            //console.log(data)

            coastlinsLayer.selectAll(".coastline").remove();
            coastlinsLayer.selectAll(".coastline")
                .data(data.features)
                //.attr("class", "coastlines")
                //.attr("d", path)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", "coastline")
                .on('mouseover', function (d, i) {
                    d3.select(this).style('fill-opacity', .7);
                    d3.select(this).style('stroke', 'red');
                    d3.select(this).style('stroke-width', '1px');
                })
                .on('mouseout', function (d, i) {
                    d3.select(this).style({ 'fill-opacity': .5 });
                    d3.select(this).style('stroke', 'blue');
                    d3.select(this).style('stroke-width', '.25px');
                });
        });

}
