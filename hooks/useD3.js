import * as d3 from 'd3';
import React from 'react';

export const useD3 = (drawD3Map, dependencies) => {
    const ref = React.useRef(null);

    React.useEffect(() => {
        drawD3Map(d3.select(ref.current));
        return () => { };
    }, dependencies);

    return ref;
}