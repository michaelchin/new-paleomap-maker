import * as d3 from "d3";
import React, { useEffect } from "react";
const dx = 50;
const dy = 50;

const margin = 20;

let plate_names_dict = {};

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
/*
const getMaxViewBox = (treeWidth) => {
  return [
    -(treeWidth / 2),
    -margin,
    treeWidth + margin,
    (treeWidth + margin) / aspectRatioValue,
  ];
};
*/
/**
 *
 * @param svnWidth
 * @param svgHeight
 * @returns
 */
const getDefaultViewBox = (svnWidth, svgHeight) => {
  return [-(svnWidth / 2), -margin, svnWidth, svgHeight];
};

/**
 *
 * @param event
 * @param d
 */
const onNodeClick = (event, d) => {
  //console.log("tree node has been clicked.");
  //console.log(event);
  //console.log(d);
};

/**
 *
 * @param svgRef
 */
const clearTree = (svgRef) => {
  let svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();
};

/**
 *
 * @param svgRef
 * @param data
 */
const drawTree = (svgRef, data) => {
  const root: any = d3.hierarchy(data);

  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3
    .linkVertical()
    .x((d) => d[0])
    .y((d) => d[1]);

  let svg = d3.select(svgRef.current);
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
    .on("click", (event, d: any) => {
      onNodeClick(event, d);
    });

  /*
  nodeEnter
    .append("circle")
    .attr("r", 10)
    .attr("fill", (d: any) =>
      d.children ? "MediumAquaMarine" : "LightSkyBlue"
    )
    .attr("stroke-width", 10);
    */

  nodeEnter
    .append("text")
    .attr("dy", "0.31em")
    .attr("x", 0)
    .attr("text-anchor", "middle")
    .text((d: any) => d.data.pid.toString())
    .attr("font-size", (d: any) => (d.data.pid > 999 ? "0.5em" : "1em"))
    .clone(true)
    .lower()
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .attr("stroke", "white");

  // display PID name and description while mouse is over the node
  nodeEnter.on("mouseover", function (event, d: any) {
    d3.select(this).style("fill", "red");

    //console.log(d3.select(this));
    let name = "Unknown";
    let desc = "N/A";
    if (d.data.pid.toString() in plate_names_dict) {
      let name_ = plate_names_dict[d.data.pid.toString()][0];
      let desc_ = plate_names_dict[d.data.pid.toString()][1];
      if (name_.length > 0) {
        name = name_;
      }
      if (desc_.length > 0) {
        desc = desc_;
      }
    }

    const rect = d3
      .select(this)
      .append("rect")
      .attr("class", "pid-info")
      .attr("x", 20)
      .attr("y", -15)
      .attr("height", 35)
      .style("fill", "pink");

    d3.select(this)
      .append("text")
      .classed("pid-info", true)
      .attr("x", 25)
      .attr("y", 0)
      .style("fill", "black")
      .html("Name: " + name)
      .call(getTextBox);

    d3.select(this)
      .append("text")
      .classed("pid-info", true)
      .attr("x", 25)
      .attr("y", 15)
      .style("fill", "black")
      .html("Description: " + desc)
      .call(getTextBox);

    rect.attr("width", function (d: any) {
      return d.bbox.width + 10;
    });
  });

  /**
   *
   * @param selection
   */
  function getTextBox(selection) {
    selection.each(function (d) {
      if (!d.bbox || d.bbox.width < this.getBBox().width) {
        d.bbox = this.getBBox();
      }
    });
  }

  nodeEnter.on("mouseout", function (event, d: any) {
    d3.select(this).style("fill", null);
    d3.selectAll(".pid-info").remove();
  });

  /*
    let treeSize = getTreeWidthHeight(root);
    let viewBox = getDefaultViewBox(
      d3R12nTreeSVGRef.current.clientWidth,
      d3R12nTreeSVGRef.current.clientHeight
    );
    */
  const duration = 2500;
  const transition = svg
    .transition()
    .duration(duration)
    //.attr(
    //  "viewBox",
    //  `${viewBox[0]},${viewBox[1]},${viewBox[2]},${viewBox[3]}`
    //)
    .tween(
      "resize",
      window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
    );

  // Transition nodes to their new position.
  node
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

  let zoom = d3
    .zoom()
    //.extent([
    //  [viewBox[0], viewBox[1]],
    //  [viewBox[2], viewBox[3]],
    //])
    .scaleExtent([0, 100])
    .on("zoom", zoomed);

  svg.call(zoom);

  svg.call(
    zoom.transform,
    d3.zoomIdentity.translate(svgRef.current.clientWidth / 2, margin)
  );

  function zoomed({ transform }) {
    //console.log(transform);
    gNode.attr("transform", transform);
    gLink.attr("transform", transform);
    /*svg.attr(
        "viewBox",
        `${(viewBox[0] - transform.x) / transform.k},${
          (viewBox[1] - transform.y) / transform.k
        }, ${viewBox[2] / transform.k}, ${viewBox[3] / transform.k}`
      );*/
  }
};

/**
 *
 * @param children
 * @param maxPID
 * @returns
 */
const hasValidChild = (children, maxPID: number) => {
  for (let i = 0; i < children.length; i++) {
    if (children[i].pid < maxPID) {
      return true;
    }
  }
  return false;
};
/**
 *
 * @param trees
 * @returns
 */
const getNonLeavePIDs = (trees, maxPID: number) => {
  let pids = new Set();
  for (let i = 0; i < trees.length; i++) {
    depth_first_search(trees[i], (node) => {
      if (node.pid < maxPID && hasValidChild(node.children, maxPID)) {
        pids.add(node.pid.toString());
      }
      return true;
    });
  }
  return Array.from(pids).sort();
};

/**
 *
 * @param trees
 * @param rootPID
 * @returns
 */
const findSubTree = (trees, rootPID: string) => {
  let ret = {};
  for (let i = 0; i < trees.length; i++) {
    depth_first_search(trees[i], (node) => {
      if (node.pid.toString() == rootPID) {
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
 * @param maxPID
 */
const filterTree = (tree, maxPID: number) => {
  let newTree = {};
  if (tree["pid"] > maxPID) {
    return null;
  }

  newTree["pid"] = tree["pid"];
  newTree["children"] = [];
  //console.log(tree);
  for (let i = 0; i < tree["children"].length; i++) {
    let child = filterTree(tree["children"][i], maxPID);
    if (child) {
      newTree["children"].push(child);
    }
  }
  return newTree;
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
 * @param a
 * @param b
 * @returns
 */
function comparePID(a, b) {
  return a["pid"] - b["pid"];
}

/**
 * make sure the children will be rendered in consistent order.
 *
 * @param tree
 */
const sortChildren = (tree) => {
  function comparePID(a, b) {
    return a["pid"] - b["pid"];
  }
  tree["children"].sort(comparePID);
  for (let i = 0; i < tree["children"].length; i++) {
    sortChildren(tree["children"][i]);
  }
};

/**
 *
 * @param svgRef
 * @param paleoAge
 * @param modelName
 * @param rootPid
 * @param setAllPIDs
 * @param maxPID
 */
export const useDrawR12nTree = (
  svgRef,
  paleoAge,
  modelName,
  rootPid,
  setAllPIDs,
  maxPID
) => {
  const [trees, setTrees] = React.useState([]);

  /**
   *
   */
  useEffect(() => {
    d3.json(
      "https://gws.gplates.org/earth/get_plate_names"
      //"http://localhost:18000/earth/get_plate_names"
    ).then(function (data: any) {
      //console.log(data);
      plate_names_dict = data;
    });
  }, []);

  /**
   *
   */
  useEffect(() => {
    d3.json(
      "https://gws.gplates.org/rotation/get_reconstruction_tree/?model=" +
        //"http://localhost:18000/rotation/get_reconstruction_tree/?model=" +
        modelName +
        "&time=" +
        paleoAge
    ).then(function (data: any) {
      /*
        //these are the code to build trees from edges
        //keep the code, do not remove
        let trees = [];
        let roots: any = findRoots(edges);
        for (let r in roots) {
          let nodes = getChildren(roots[r], edges);
          trees.push({ name: roots[r], children: nodes });
        }
        console.log(trees);
      */
      for (let i = 0; i < data.length; i++) {
        sortChildren(data[i]);
      }
      data.sort(comparePID);
      setTrees(data);
    });
  }, [paleoAge, modelName]);

  /**
   *
   */
  useEffect(() => {
    if (trees.length > 0) {
      let subtree = findSubTree(trees, rootPid);
      let newTree = null;
      if ("children" in subtree) {
        newTree = filterTree(subtree, maxPID);
      }
      if (newTree) {
        drawTree(svgRef, newTree);
      } else {
        alert("The tree is empty!");
        clearTree(svgRef);
      }
    }
  }, [trees, rootPid, maxPID]);

  /**
   *
   */
  useEffect(() => {
    if (trees.length > 0) {
      setAllPIDs(getNonLeavePIDs(trees, maxPID));
    }
  }, [trees, maxPID]);
};
