const ModelSelect = ({ modelName, modelChangeHandler }) => {
  return (
    <div className="model-select">
      <label
        htmlFor="model-select"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Model
      </label>
      <div>
        <select
          id="model-select"
          name="model-select"
          value={modelName}
          onChange={(e) => modelChangeHandler(e.target.value)}
          autoComplete="on"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        >
          <option value="muller2019">Muller2019</option>
          <option value="muller2022">Muller2022</option>
        </select>
      </div>
    </div>
  );
};

export default ModelSelect;
