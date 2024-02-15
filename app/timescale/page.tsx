"use client";

import * as d3 from "d3";
import { Button } from "flowbite-react";
import React, { useEffect } from "react";
import ReactGA from "react-ga4";

ReactGA.initialize("G-SK40RD0DHH");

/**
 *
 * @param trees
 * @param name
 * @returns
 */
const findSubTree = (trees, name: string) => {
  let ret = {};
  for (let i = 0; i < trees.length; i++) {
    depth_first_search(trees[i], (node) => {
      if (node.pid.toString() == name) {
        ret = node;
        return false;
      }
      return true;
    });
  }
  return ret;
};

/**
 *
 * @param tree
 * @param callback
 */
const depth_first_search = (tree, callback) => {
  let ret = callback(tree);
  if (!ret) {
    return;
  }
  for (let i = 0; i < tree["children"].length; i++) {
    depth_first_search(tree["children"][i], callback);
  }
};

/**
 *
 * @returns
 */
const TimescalePage = () => {
  const timescaleContainerDiv = React.useRef(null);

  const drawTimescalePlot = () => {
    let data = { name: "root", value: 0, children: [] };
    let phanerozoic = { name: "Phanerozoic", value: 0, children: [] };
    let proterozoic = { name: "Proterozoic", value: 0, children: [] };
    let archean = { name: "Archean", value: 0, children: [] };
    data.children.push(phanerozoic);
    data.children.push(proterozoic);
    data.children.push(archean);
    data.children.push({ name: "Hadeon", value: 1, children: [] });

    phanerozoic.children.push({ name: "Cenozoic", value: 1, children: [] });
    phanerozoic.children.push({ name: "Mesozoic", value: 1, children: [] });
    phanerozoic.children.push({ name: "Paleozoic", value: 1, children: [] });

    proterozoic.children.push({
      name: "Paleoproterozoic",
      value: 1,
      children: [],
    });
    proterozoic.children.push({
      name: "Mesoproterozoic",
      value: 1,
      children: [],
    });
    proterozoic.children.push({
      name: "Neoproterozoic",
      value: 1,
      children: [],
    });

    archean.children.push({ name: "Eoarchean", value: 1, children: [] });
    archean.children.push({ name: "Paleoarchean", value: 1, children: [] });
    archean.children.push({ name: "Mesoarchean", value: 1, children: [] });
    archean.children.push({ name: "Neoarchean", value: 1, children: [] });

    const breadcrumbs = ["root", "Phanerozoic"];

    let height = 600,
      width = 200;
    // Compute the layout.
    const hierarchy = d3.hierarchy(data).sum((d) => d.value);
    const root = d3.partition().size([height, (hierarchy.height + 1) * width])(
      hierarchy
    );

    let svgContainer = d3.select(timescaleContainerDiv.current);
    let svg = svgContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "timescale-plot-svg")
      .style("display", "block")
      .style("position", "absolute")
      .style("top", "20px")
      .style("left", "900px")
      .style("margin", "10px")
      .style("background", "white");

    // add left panel
    const leftPanel = svg.append("g").attr("class", "left-panel");
    const leftPanelWidth = 20;

    leftPanel
      .append("rect")
      .attr("width", leftPanelWidth)
      .attr("height", height)
      .attr("fill-opacity", 0.6)
      .attr("fill", "blue");

    const gBreadcrumbs = leftPanel
      .append("g")
      .attr("class", "g-breadcrumbs")
      .attr("transform", "rotate(90) translate(20,-5)");

    let breadcrumbsTxt = gBreadcrumbs.append("text");
    for (let i = 0; i < breadcrumbs.length; i++) {
      breadcrumbsTxt
        .append("tspan")
        .attr("class", "breadcrumbs")
        .text(breadcrumbs[i])
        .attr("text-decoration", "underline")
        .style("cursor", "pointer")
        .on("click", (e) => alert(e.target.innerHTML));
      breadcrumbsTxt.append("tspan").attr("class", "breadcrumbs").text(" >> ");
    }

    // Add a clipPath: everything out of this area won't be drawn.
    svg
      .append("defs")
      .append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width - leftPanelWidth)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // add right panel
    const rightPanel = svg
      .append("g")
      .attr("class", "right-panel")
      .attr("transform", "translate(" + leftPanelWidth + ",0)")
      .attr("clip-path", "url(#clip)");

    const gTimescaleCells = rightPanel
      .append("g")
      .attr("class", "timescale-cells");

    const update = (svgGroup, _root) => {
      svg.selectAll(".timescale-cell").remove();

      // add timescale cells.
      const cell = svgGroup
        .selectAll(".timescale-cell")
        .data(_root.descendants())
        .enter()
        .append("g")
        .attr("class", "timescale-cell")
        .attr("transform", (d: any) => `translate(${d.y0 - width},${d.x0})`);

      cell
        .append("rect")
        .attr("width", (d: any) => d.y1 - d.y0 - 3)
        .attr("height", (d: any) => d.x1 - d.x0 - 3)
        .attr("fill-opacity", 0.6)
        .attr("fill", "grey")
        .style("cursor", "pointer")
        .on("click", clicked);

      const text = cell
        .append("text")
        .style("user-select", "none")
        .attr("pointer-events", "none")
        .attr("x", 4)
        .attr("y", 13)
        .text((d: any) => d.data.name);
    };

    function clicked(event, node) {
      //console.log(event);
      //console.log(node);
      if (node.data.children.length > 0) {
        const hhh = d3.hierarchy(node.data).sum((d) => d.value);
        const newRoot = d3.partition().size([height, (hhh.height + 1) * width])(
          hhh
        );
        update(gTimescaleCells, newRoot);
      }
    }

    update(gTimescaleCells, root);
  };

  useEffect(() => {
    let svgContainer = d3.select(timescaleContainerDiv.current);

    d3.xml("/svg/timescl.svg").then((data) => {
      if (timescaleContainerDiv.current.querySelector("svg") == null) {
        svgContainer.node().append(data.documentElement);
        let oldSVG = svgContainer.select("svg");

        drawTimescalePlot();

        let ids = ["cenozoic", "mesozoic", "paleozoic", "precambrian"];
        let xTranlate = [-38, -232, -421, -582.5];
        let xWidth = [190, 185, 156, 170.5];

        for (let i = 0; i < ids.length; i++) {
          let newSVG = svgContainer
            .append("svg")
            .attr("width", xWidth[i])
            .attr("height", "463")
            .attr("id", ids[i] + "-svg")
            .style("display", "inline-block")
            .style("margin", "10px");

          newSVG
            .append("rect")
            .attr("width", xWidth[i])
            .attr("height", "463")
            .attr("fill", "white");

          let group = newSVG
            .append("g")
            .attr("transform", "translate(" + xTranlate[i] + ", -60)");

          var bigNode: any = oldSVG.select("#" + ids[i]).node();
          var bigBbox = bigNode.getBoundingClientRect();

          let allPath = oldSVG.selectAll("path");

          allPath.each(function (d, i) {
            let node: any = d3.select(this).node();
            let bbox = node.getBoundingClientRect();
            if (bbox.width > 200) {
              console.log(node);
            }
            if (
              bbox.x > bigBbox.x - 1 &&
              bbox.x < bigBbox.x + bigBbox.width + 1 &&
              bbox.y >= bigBbox.y - 1 &&
              bbox.y <= bigBbox.y + bigBbox.height + 1
            ) {
              group.append(() => d3.select(this).clone(true).node());
            }
          });

          let allText = oldSVG.selectAll("text");
          allText.each(function (d, i) {
            let node: any = d3.select(this).node();
            let bbox = node.getBoundingClientRect();
            if (bbox.width > 200) {
              group.append(() => d3.select(this).clone(true).node());
            } else if (
              bbox.x >= bigBbox.x &&
              bbox.x <= bigBbox.x + bigBbox.width &&
              bbox.y >= bigBbox.y &&
              bbox.y <= bigBbox.y + bigBbox.height
            ) {
              group.append(() => d3.select(this).clone(true).node());
            }
          });
        }
      }
    });

    return () => {
      svgContainer.empty();
    };
  }, []);

  const handleDownloadButtonClicked = (name) => {
    const svgData = document.getElementById(name + "-svg");
    console.log(svgData);
    const svgString = new XMLSerializer().serializeToString(svgData);
    let svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name + ".svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      <div
        ref={timescaleContainerDiv}
        id="timescale-container"
        style={{
          marginRight: "0px",
          marginLeft: "0px",
          background: "lightgrey",
        }}
      ></div>
      <div className="flex flex-wrap gap-2" style={{ width: "800px" }}>
        <Button
          className="download-btn"
          size="sm"
          color="blue"
          onClick={() => handleDownloadButtonClicked("cenozoic")}
        >
          Download cenozoic
        </Button>
        <Button
          className="download-btn"
          size="sm"
          color="blue"
          onClick={() => handleDownloadButtonClicked("mesozoic")}
        >
          Download mesozoic
        </Button>
        <Button
          className="download-btn"
          size="sm"
          color="blue"
          onClick={() => handleDownloadButtonClicked("paleozoic")}
        >
          Download paleozoic
        </Button>
        <Button
          className="download-btn"
          size="sm"
          color="blue"
          onClick={() => handleDownloadButtonClicked("precambrian")}
        >
          Download precambrian
        </Button>
      </div>
    </>
  );
};

export default TimescalePage;
