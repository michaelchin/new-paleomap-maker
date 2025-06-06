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
          <option value="Cao2024">Cao2024</option>
          <option value="Muller2022">Muller2022</option>
          <option value="Merdith2021">Merdith2021</option>
          <option value="Muller2019">Muller2019</option>
          <option value="Muller2016">Muller2016</option>
          <option value="Matthews2016_mantle_ref">
            Matthews2016_mantle_ref
          </option>
          <option value="Matthews2016_pmag_ref">Matthews2016_pmag_ref</option>
          <option value="Seton2012">Seton2012</option>
        </select>
      </div>
    </div>
  );
};

export default ModelSelect;
