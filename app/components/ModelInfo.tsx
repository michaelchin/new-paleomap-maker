import { List } from "flowbite-react";

const ModelInfo = ({ modelName, modelList }) => {
  let currentModelDesc = "";
  let modelNameLowerCase = modelName.toLowerCase();
  if (modelNameLowerCase in modelList) {
    currentModelDesc = modelList[modelNameLowerCase]["description"];
  }
  return (
    <div>
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
    </div>
  );
};

export default ModelInfo;
