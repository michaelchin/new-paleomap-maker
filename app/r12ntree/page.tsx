"use client";

import * as d3 from "d3";
import { Button, List } from "flowbite-react";
import Link from "next/link";
import React, { useEffect } from "react";
import ModelSelect from "../components/ModelSelect";
import PaleoAgeInput from "../components/PaleoAgeInput";

var c1 = { name: "c1", children: [] };
var c2 = { name: "c2", children: [] };
var c3 = { name: "c3", children: [] };
var c4 = { name: "c4", children: [c3] };
var data = { name: "root", children: [c1, c2, c4] };

const dx = 50;
const dy = 50;

const margin = 50;
const aspectRatio = [16, 9],
  aspectRatioValue = aspectRatio[0] / aspectRatio[1];
const minTreeHeight = 800,
  minTreeWidth = minTreeHeight * aspectRatioValue;

/**
 *
 * @param root
 * @returns
 */
const getTreeWidthHeight = (root) => {
  let minX = 0,
    maxX = 0,
    minY = 0,
    maxY = 0;
  root.eachBefore((node) => {
    if (node.x < minX) minX = node.x;
    if (node.x > maxX) maxX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.y > maxY) maxY = node.y;
  });
  return { width: maxX - minX, height: maxY - minY };
};

/**
 *
 * @param treeWidth
 * @param treeHeight
 * @returns
 */
const getViewBox = (treeWidth, treeHeight) => {
  let tmpWidth = treeHeight * aspectRatioValue;
  if (tmpWidth < treeWidth) {
    tmpWidth = treeWidth;
  }
  if (tmpWidth < minTreeWidth) {
    tmpWidth = minTreeWidth;
  }
  return [
    -(tmpWidth / 2),
    -margin,
    tmpWidth + margin,
    (tmpWidth + margin) / aspectRatioValue,
  ];
};

/**
 *
 * @returns
 */
export default function R12nTreePage() {
  const [modelName, setModelName] = React.useState("Muller2019");
  const [paleoAge, setPaleoAge] = React.useState(140);
  const [dirty, setDirty] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [modelList, setModelList] = React.useState({});

  const [treeHeight, setTreeHeight] = React.useState(1000);
  const [treeWidth, setTreeWidth] = React.useState(1000);

  const d3R12nTreeSVGRef = React.useRef(null);

  const drawTree = (data) => {
    const root: any = d3.hierarchy(data);

    const tree = d3.tree().nodeSize([dx, dy]);
    const diagonal = d3
      .linkVertical()
      .x((d) => d[0])
      .y((d) => d[1]);

    let svg = d3.select(d3R12nTreeSVGRef.current);
    svg.selectAll("*").remove();

    /*
    svg
      .append("g")
      .append("rect")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", "200")
      .attr("height", "200");*/

    const gLink = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg
      .append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    // Compute the new tree layout.
    tree(root);

    let treeSize = getTreeWidthHeight(root);
    setTreeHeight(treeSize["height"]);
    setTreeWidth(treeSize["width"]);

    const nodes = root.descendants().reverse();
    const links = root.links();

    const node = gNode.selectAll("g").data(nodes, (d: any) => d.id);

    root.descendants().forEach((d: any, i) => {
      d.id = i;
    });

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${root.x},${root.y})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1)
      .on("click", (event, d: any) => {});

    /*nodeEnter
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d: any) =>
        d.children ? "MediumAquaMarine" : "LightSkyBlue"
      )
      .attr("stroke-width", 10);*/

    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .text((d: any) => d.data.name.toString())
      .clone(true)
      .lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white");

    let viewBox = getViewBox(treeWidth, treeHeight);
    const duration = 2500;
    const transition = svg
      .transition()
      .duration(duration)
      .attr(
        "viewBox",
        `${viewBox[0]},${viewBox[1]}, ${viewBox[2]}, ${viewBox[3]}`
      )
      .tween(
        "resize",
        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
      );

    // Transition nodes to their new position.
    const nodeUpdate = node
      .merge(nodeEnter)
      .transition(transition)
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    //console.log(links);
    // Update the links…
    const link = gLink.selectAll("path").data(links, (d: any) => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", (d) => {
        return diagonal({ source: [root.x, root.y], target: [root.x, root.y] });
      });

    // Transition links to their new position.
    link
      .merge(linkEnter)
      .transition(transition)
      .attr("d", (d: any) => {
        return diagonal({
          source: [d.source.x, d.source.y],
          target: [d.target.x, d.target.y],
        });
      });

    svg.call(
      d3
        .zoom()
        .extent([
          [viewBox[0], viewBox[1]],
          [viewBox[2], viewBox[3]],
        ])
        .scaleExtent([1, 8])
        .on("zoom", zoomed)
    );

    function zoomed({ transform }) {
      gNode.attr("transform", transform);
      gLink.attr("transform", transform);
    }
  };

  /**
   *
   * @param node
   * @param edges
   * @returns
   */
  const getChildren = (node, edges) => {
    let children = [];
    for (let i in edges) {
      if (edges[i][0] == node) {
        children.push(edges[i][1]);
      }
    }
    let ret = [];
    for (let i in children) {
      ret.push({
        name: children[i],
        children: getChildren(children[i], edges),
      });
    }
    return ret;
  };

  /**
   *
   * @param edges
   * @returns
   */
  const findRoots = (edges) => {
    let parents = [],
      children = [];
    for (let i in edges) {
      parents.push(edges[i][0]);
      children.push(edges[i][1]);
    }
    const parentsSet = new Set(parents);
    const childrenSet = new Set(children);

    const roots = Array.from(parentsSet).filter((element) => {
      return !childrenSet.has(element);
    });
    return roots;
  };

  /**
   *
   */
  useEffect(() => {
    const onResize = () => {
      setDirty(true);
    };
    window.addEventListener("resize", onResize);
    d3.json("https://repo.gplates.org/webdav/pmm/models.json").then(function (
      data: any
    ) {
      setModelList(data);
    });

    d3.json(
      "https://gws.gplates.org/rotation/get_reconstruction_tree_edges/?model=seton2012&level=10&pids=0"
    ).then(function (edges: any) {
      console.log(edges);

      let trees = [];
      let roots: any = findRoots(edges);
      for (let r in roots) {
        let nodes = getChildren(roots[r], edges);
        trees.push({ name: roots[r], children: nodes });
      }
      console.log(trees);
      drawTree(trees[0]);
    });

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const modelChangeHandler = (newModelName) => {
    if (newModelName != modelName) {
      setModelName(newModelName);
      setDirty(true);
    }
  };

  const paleoAgeChangeHandler = (newAge) => {
    if (paleoAge != newAge) {
      setPaleoAge(newAge);
      setDirty(true);
    }
  };

  const handleRefreshButtonClicked = () => {
    setRefresh(!refresh);
    setDirty(false);
  };

  let currentModelDesc = "";
  let modelNameLowerCase = modelName.toLowerCase();
  if (modelNameLowerCase in modelList) {
    currentModelDesc = modelList[modelNameLowerCase]["description"];
  }

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
        Reconstruction Tree
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-9 svg-container">
          <svg
            ref={d3R12nTreeSVGRef}
            id="r12n-tree-svg"
            style={{
              aspectRatio: `${aspectRatio[0]}/${aspectRatio[1]}`,
              width: "100%",
              marginRight: "0px",
              marginLeft: "0px",
              background: "lightgrey",
            }}
          ></svg>
        </div>
        <div className="lg:col-span-3 control-container">
          <ModelSelect
            modelName={modelName}
            modelChangeHandler={modelChangeHandler}
          />
          <PaleoAgeInput
            paleoAge={paleoAge}
            paleoAgeChangeHandler={paleoAgeChangeHandler}
          />
          <Button
            disabled={!dirty}
            className="refresh-btn "
            size="sm"
            onClick={() => handleRefreshButtonClicked()}
          >
            Refresh Tree
          </Button>
          {dirty && (
            <div
              className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
              role="alert"
            >
              <span className="font-medium">Look Here!</span> Click the "Refresh
              Map" button to apply changes and redraw the map.
            </div>
          )}
        </div>
      </div>
      <h3 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-3xl dark:text-white text-center">
        {modelName}
      </h3>
      <div className="ps-5">
        <h4 className="font-extrabold"> Description:</h4>
        <p className="ps-10 pe-10">{currentModelDesc}</p>
      </div>
      <div className="ps-5">
        <h4 className="font-extrabold"> Download:</h4>
        <List className="ps-10">
          {modelNameLowerCase in modelList && (
            <List.Item key="Rotations">
              <a
                href={modelList[modelNameLowerCase]["Rotations"]}
                className="underline"
              >
                Rotations
              </a>
            </List.Item>
          )}
          {modelNameLowerCase in modelList &&
            Object.keys(modelList[modelNameLowerCase]["Layers"]).map(
              (layer, i) => {
                return (
                  <List.Item key={i}>
                    <a
                      href={modelList[modelNameLowerCase]["Layers"][layer]}
                      className="underline"
                    >
                      {layer}
                    </a>
                  </List.Item>
                );
              }
            )}
        </List>
        <p>
          It is recommended to use{" "}
          <a href="https://pypi.org/project/plate-model-manager/">
            <strong>Plate Model Manager</strong>
          </a>{" "}
          to download the reconstruction model.
        </p>
        <List className="ps-10 italic">
          <List.Item key="1">
            <strong>pip install plate-model-manager</strong>
          </List.Item>
          <List.Item key="2">
            <strong>pmm download {modelName}</strong>
          </List.Item>
        </List>
      </div>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </>
  );
}
