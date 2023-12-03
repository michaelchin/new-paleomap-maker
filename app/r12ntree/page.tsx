"use client";

import * as d3 from "d3";
import { Button, List } from "flowbite-react";
import Link from "next/link";
import React, { useEffect } from "react";
import ModelSelect from "../components/ModelSelect";
import PaleoAgeInput from "../components/PaleoAgeInput";
import { useDrawR12nTree } from "../hooks/useDrawR12nTree";

const aspectRatio = [16, 9],
  aspectRatioValue = aspectRatio[0] / aspectRatio[1];

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

  const d3R12nTreeSVGRef = React.useRef(null);

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

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useDrawR12nTree(d3R12nTreeSVGRef, paleoAge, modelName, 0);

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
