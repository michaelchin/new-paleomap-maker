import React, { useEffect } from "react";

const PaleoAgeInput = ({ paleoAge, paleoAgeChangeHandler }) => {
  const inputRef = React.useRef(null);

  //console.log(allListItems);
  useEffect(() => {
    inputRef.current.value = paleoAge;
  }, [paleoAge]);

  return (
    <div className="paleo-age-input">
      <label
        htmlFor="paleo-age-input"
        className="block text-sm font-medium text-gray-900 dark:text-white"
      >
        PaleoAge
      </label>
      <div className="relative flex items-center max-w-[13rem]">
        <button
          type="button"
          id="decrement-button"
          onClick={() => paleoAgeChangeHandler(paleoAge - 1)}
          data-input-counter-decrement="paleo-age-input"
          className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
        >
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h16"
            />
          </svg>
        </button>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id="paleo-age-input"
            data-input-counter
            data-input-counter-min="0"
            data-input-counter-max="410"
            aria-describedby="helper-text-explanation"
            className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="140"
            //value={paleoAge}
            onBlur={(e) => paleoAgeChangeHandler(parseInt(e.target.value))}
            required
          />
          <span className="absolute inset-y-0 end-0 top-0 flex items-center pe-1.5 pointer-events-none">
            Ma
          </span>
          <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-1.5 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <button
          type="button"
          id="increment-button"
          data-input-counter-increment="paleo-age-input"
          onClick={() => paleoAgeChangeHandler(paleoAge + 1)}
          className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
        >
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PaleoAgeInput;
