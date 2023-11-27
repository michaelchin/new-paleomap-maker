"use client";

import { Button } from "flowbite-react";
import Link from "next/link";
import React, { useEffect } from "react";
import D3SVG from "../components/D3SVG";
import ModelSelect from "../components/ModelSelect";
import PaleoAgeInput from "../components/PaleoAgeInput";
import ProjSelect from "../components/ProjSelect";

export default function D3MapPage() {
  const [time, setTime] = React.useState(100);
  const [projName, setProjName] = React.useState("Orthographic");
  const [modelName, setModelName] = React.useState("Muller2019");
  const [paleoAge, setPaleoAge] = React.useState(140);
  const [dirty, setDirty] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  useEffect(() => {
    const onResize = () => {
      setDirty(true);
    };
    window.addEventListener("resize", onResize);
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

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
        New Paleomap Maker
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-9 svg-container">
          <D3SVG
            time={time}
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
              <span className="font-medium">Look Here!</span> Click the "Refresh
              Map" button to apply changes and redraw the map.
            </div>
          )}
          <Button
            className="download-btn"
            size="sm"
            color="blue"
            onClick={() => handleDownloadButtonClicked()}
          >
            Download
          </Button>
        </div>
      </div>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </>
  );
}
