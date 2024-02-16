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
const findSubTree = (root, name: string) => {
  let ret = {};

  depth_first_search(root, (node) => {
    if (node.name.toString() == name) {
      ret = node;
      return false;
    }
    return true;
  });

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
  const timescaleIcicleContainerDiv = React.useRef(null);
  var timescaleData;

  /**
   *
   * @param data
   */
  const drawTimescalePlot = (data) => {
    //do not redraw the svg if it has already been done.
    if (timescaleIcicleContainerDiv.current.querySelector("svg") != null) {
      return;
    }

    var breadcrumbs = ["root"];

    let height = 600,
      width = 240;

    let svg = d3
      .select(timescaleIcicleContainerDiv.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "timescale-icicle-svg")
      .style("display", "block")
      .style("margin", "10px auto")
      .style("background", "red");

    // add left panel
    const leftPanel = svg.append("g").attr("class", "left-panel");
    const leftPanelWidth = 20;
    leftPanel
      .append("rect")
      .attr("width", leftPanelWidth)
      .attr("height", height)
      .attr("fill-opacity", 1)
      .attr("fill", "cyan");

    // add left panel
    const rightPanel = svg.append("g").attr("class", "right-panel");
    const rightPanelWidth = 40;
    rightPanel
      .append("rect")
      .attr("width", rightPanelWidth)
      .attr("height", height)
      .attr("fill-opacity", 1)
      .attr("fill", "lightgrey")
      .attr("transform", `translate(${width - rightPanelWidth} ,0)`);

    // add breadcrumbs
    const gBreadcrumbs = leftPanel
      .append("g")
      .attr("class", "g-breadcrumbs")
      .attr("transform", "rotate(90) translate(20,-5)");
    var breadcrumbsTxt = gBreadcrumbs.append("text");
    /**
     * update breadcrumbs
     */
    const updateBreadcrumbs = () => {
      breadcrumbsTxt.selectAll(".breadcrumbs").remove();
      for (let i = 0; i < breadcrumbs.length; i++) {
        breadcrumbsTxt
          .append("tspan")
          .attr("class", "breadcrumbs")
          .text(breadcrumbs[i])
          .attr("text-decoration", (d) => {
            if (i < breadcrumbs.length - 1) {
              return "underline";
            } else {
              return "";
            }
          })
          .style("cursor", (d) => {
            if (i < breadcrumbs.length - 1) {
              return "pointer";
            } else {
              return "";
            }
          })
          .on("click", (e) => breadcrumbsClicked(e.target.innerHTML));
        breadcrumbsTxt
          .append("tspan")
          .attr("class", "breadcrumbs")
          .text(" >> ");
      }
    };

    // Add a clipPath: everything out of this area won't be drawn.
    svg
      .append("defs")
      .append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width - leftPanelWidth - rightPanelWidth)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // add central panel
    const centralPanel = svg
      .append("g")
      .attr("class", "central-panel")
      .attr("transform", "translate(" + leftPanelWidth + ",0)")
      .attr("clip-path", "url(#clip)");

    const gTimescaleCells = centralPanel
      .append("g")
      .attr("class", "timescale-cells");

    /**
     *
     * @param timescaleGroup
     * @param _root
     */
    const update = (timescaleGroup, data) => {
      svg.selectAll(".timescale-cell").remove();

      // Compute the layout.
      const hierarchy = d3.hierarchy(data).sum((d) => d.value);
      const _root = d3
        .partition()
        .size([
          height,
          (hierarchy.height + 1) * (width - rightPanelWidth - leftPanelWidth),
        ])(hierarchy);

      // add timescale cells.
      const cell = timescaleGroup
        .selectAll(".timescale-cell")
        .data(_root.descendants())
        .enter()
        .append("g")
        .attr("class", "timescale-cell")
        .attr(
          "transform",
          (d: any) =>
            `translate(${d.y0 - width + rightPanelWidth + leftPanelWidth},${
              d.x0
            })`
        );

      cell
        .append("rect")
        .attr("width", (d: any) => d.y1 - d.y0)
        .attr("height", (d: any) => d.x1 - d.x0)
        .attr("fill-opacity", 1)
        .attr("fill", (d: any) => d.data.color)
        .style("cursor", (d: any) => {
          if (d.data.children.length) {
            return "pointer";
          } else {
            return "";
          }
        })
        .on("click", cellClicked);

      let fontSize = Number(
        window
          .getComputedStyle(cell.node())
          .getPropertyValue("font-size")
          .match(/\d+/)[0]
      );
      const text = cell
        .append("text")
        .style("user-select", "none")
        .attr("pointer-events", "none")
        .attr("x", (d: any) => (d.y1 - d.y0) / 2)
        .attr("y", (d: any) => (d.x1 - d.x0 + fontSize) / 2)
        .attr("text-anchor", "middle")
        .text((d: any) => d.data.name);
    };

    /**
     * timescale cell was clicked
     * @param event
     * @param node
     */
    function cellClicked(event, node) {
      //console.log(event);
      //console.log(node);

      if (node.data.children.length > 0) {
        update(gTimescaleCells, node.data);
        breadcrumbs.push(node.data.name);
        updateBreadcrumbs();
      }
    }

    /**
     * breadcrumbs was clicked
     * @param name
     */
    function breadcrumbsClicked(name) {
      let subtree = findSubTree(data, name);
      update(gTimescaleCells, subtree);
      let newBreadcrumbs = [];
      for (let i = 0; i < breadcrumbs.length; i++) {
        newBreadcrumbs.push(breadcrumbs[i]);
        if (name == breadcrumbs[i]) {
          break;
        }
      }
      breadcrumbs = newBreadcrumbs;
      updateBreadcrumbs();
    }

    update(gTimescaleCells, data);
    updateBreadcrumbs();
  };

  useEffect(() => {
    //draw the time scale icicle
    let svgIcicleContainer = d3.select(timescaleIcicleContainerDiv.current);
    d3.json("/json/timescale-gsa-0.6.json")
      .then((data) => {
        timescaleData = data;
        drawTimescalePlot(data);
      })
      .catch((e) => console.log(e));

    //draw GSA time scale v0.6....
    let svgContainer = d3.select(timescaleContainerDiv.current);
    d3.xml("/svg/timescl.svg").then((data) => {
      if (timescaleContainerDiv.current.querySelector("svg") == null) {
        svgContainer.node().append(data.documentElement);
        let oldSVG = svgContainer.select("svg");

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

    return () => {};
  }, []);

  /**
   *
   * @param name
   */
  const handleDownloadButtonClicked = (name) => {
    const svgData = document.getElementById(name + "-svg");
    //console.log(svgData);
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

  /**
   *
   */
  const downloadJSON = () => {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(timescaleData)], { type: "application/json" })
    );
    a.download = "timescale-gsa-v0.6.json";
    a.click();
  };

  return (
    <>
      <div
        ref={timescaleIcicleContainerDiv}
        id="timescale-icicle-container"
        style={{
          marginRight: "0px",
          marginLeft: "0px",
        }}
      ></div>
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
        {false && (
          <Button
            className="download-btn"
            size="sm"
            color="blue"
            onClick={() => downloadJSON()}
          >
            Download Timescale JSON
          </Button>
        )}
      </div>
    </>
  );
};

export default TimescalePage;
