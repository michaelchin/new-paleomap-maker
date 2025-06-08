"use client";

import * as d3 from "d3";
import { Button } from "flowbite-react";
import Link from "next/link";
import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import GCombobox from "../components/GCombobox";
import ModelInfo from "../components/ModelInfo";
import ModelSelect from "../components/ModelSelect";
import PaleoAgeInput from "../components/PaleoAgeInput";
import { useDrawR12nTree } from "../hooks/useDrawR12nTree";

ReactGA.initialize("G-SK40RD0DHH");

const aspectRatio = [16, 9];

/**
 *
 * @returns
 */
export default function R12nTreePage() {
  const [modelName, setModelName] = React.useState("Cao2024");
  const [paleoAge, setPaleoAge] = React.useState(140);
  const [dirty, setDirty] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [modelList, setModelList] = React.useState({});
  const [rootPID, setRootPID] = React.useState("0");
  const [allPIDs, setAllPIDs] = React.useState([]);
  const [maxPID, setMaxPID] = React.useState(999);

  const d3R12nTreeSVGRef = React.useRef(null);
  const maxPidInputRef = React.useRef(null);

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
   * given a set of "tree edges", find the "root".
   * the "root" does not have a parent
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

    maxPidInputRef.current.value = 999;

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useDrawR12nTree(
    d3R12nTreeSVGRef,
    paleoAge,
    modelName,
    rootPID,
    setAllPIDs,
    maxPID
  );

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

  const onMaxPidInputFocusOut = () => {
    let value = parseInt(maxPidInputRef.current.value);
    if (Number.isNaN(value)) {
      alert("Invalid Max Plate ID: " + maxPidInputRef.current.value);
    } else if (value < parseInt(rootPID)) {
      alert("Max Plate ID cannot be less than the current Root Plate ID.");
    } else {
      setMaxPID(maxPidInputRef.current.value);
    }
  };

  /*ReactGA.send({
    hitType: "pageview",
    page: "/r12ntree",
    title: "Reconstruction Tree",
  });*/

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
          <GCombobox
            allListItems={allPIDs}
            currentItem={rootPID}
            setCurrentItem={setRootPID}
          />
          <div className="max-pid-input">
            <label
              htmlFor="max-pid-input"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Max Plate ID
            </label>
            <input
              ref={maxPidInputRef}
              id="max-pid-input"
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onBlur={(e) => onMaxPidInputFocusOut()}
              required
            />
          </div>
          {false && (
            <Button
              disabled={!dirty}
              className="refresh-btn "
              size="sm"
              onClick={() => handleRefreshButtonClicked()}
            >
              Refresh Tree
            </Button>
          )}
          {dirty && false && (
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
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        See{" "}
        <a
          href="https://github.com/GPlates/gplates-web-service/blob/master/django/GWS/data/earth/Muller_etal_2019_plateID_list.csv"
          target="_blank"
          style={{
            textDecoration: "underline",
            textDecorationColor: "blue",
            fontWeight: "bold",
          }}
        >
          here
        </a>{" "}
        for a list of Plate IDs and their meanings.
      </div>
      <ModelInfo modelName={modelName} modelList={modelList} />
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </>
  );
}
