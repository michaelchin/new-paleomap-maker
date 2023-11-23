const ProjSelect = ({ projName, projChangeHandler }) => {
  return (
    <div className="sm:col-span-3">
      <label
        htmlFor="projection"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Projection
      </label>
      <div className="mt-2">
        <select
          id="projection"
          name="projection"
          value={projName}
          onChange={(e) => projChangeHandler(e.target.value)}
          autoComplete="projection-name"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        >
          <option value="Orthographic">Orthographic</option>
          <option value="Equirectangular">Equirectangular</option>
        </select>
      </div>
    </div>
  );
};

export default ProjSelect;
