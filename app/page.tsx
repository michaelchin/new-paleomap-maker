"use client";

import * as d3 from "d3";
import { Button, List } from "flowbite-react";
import Link from "next/link";
import React, { useEffect } from "react";
import D3SVG from "./components/D3SVG";
import ModelSelect from "./components/ModelSelect";
import PaleoAgeInput from "./components/PaleoAgeInput";
import ProjSelect from "./components/ProjSelect";

export default function D3MapPage() {
  const [projName, setProjName] = React.useState("Orthographic");
  const [modelName, setModelName] = React.useState("Muller2019");
  const [paleoAge, setPaleoAge] = React.useState(140);
  const [dirty, setDirty] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [modelList, setModelList] = React.useState({});

  useEffect(() => {
    const onResize = () => {
      setDirty(true);
    };
    window.addEventListener("resize", onResize);
    d3.json("https://repo.gplates.org/webdav/pmm/models.json").then(function (
      data: any
    ) {
      console.log(data);
      setModelList(data);
    });
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const projChangeHandler = (newProjName) => {
    if (newProjName != projName) {
      setProjName(newProjName);
      setDirty(true);
    }
  };

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

  /**
   * TODO: get computed CSS?
   * https://github.com/Hypercubed/svgsaver
   * https://github.com/exupero/saveSvgAsPng
   * https://takuti.me/note/javascript-save-svg-as-image/
   */
  const handleDownloadButtonClicked = () => {
    let svgData = document.getElementById("map-svg").outerHTML;
    let svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "newesttree.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  let currentModelDesc = "";
  let modelNameLowerCase = modelName.toLowerCase();
  if (modelNameLowerCase in modelList) {
    currentModelDesc = modelList[modelNameLowerCase]["description"];
  }

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
        New Paleomap Maker
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-9 svg-container">
          <D3SVG
            paleoAge={paleoAge}
            projName={projName}
            modelName={modelName}
            refresh={refresh}
          />
        </div>
        <div className="lg:col-span-3 control-container">
          <ProjSelect
            projName={projName}
            projChangeHandler={projChangeHandler}
          />
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
            Refresh Map
          </Button>
          {dirty && (
            <div
              className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
              role="alert"
            >
              <span className="font-medium">Look Here!</span>{" "}
              <span style={{ fontFamily: "emoji" }}>⚠️⚠️⚠️</span>Click the
              "Refresh Map" button to apply changes and redraw the map.
            </div>
          )}
          {false && (
            <Button
              className="download-btn"
              size="sm"
              color="blue"
              onClick={() => handleDownloadButtonClicked()}
            >
              Download
            </Button>
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
