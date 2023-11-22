import React, { useEffect } from 'react';
import { useDrawCoastlines } from "../hooks/useDrawCoastlines";

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function D3SVG({ time, projection, svgHeight, svgWidth }) {
    const d3SVGRef = React.useRef(null);

    useEffect(() => { useDrawCoastlines(d3SVGRef.current, time, projection); return () => { }; }, [time, projection])


    return (
        <svg
            ref={d3SVGRef}
            style={{
                height: svgHeight,
                width: svgWidth,
                marginRight: "0px",
                marginLeft: "0px",
                background: "lightgrey"
            }}
        >
        </svg>
    )
}

export default D3SVG