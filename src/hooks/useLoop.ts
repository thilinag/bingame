import { useRef, useEffect } from "react";

export const useLoop = (callback, gameState) => {
    const requestID = useRef();
    const previousTime = useRef();

    const loop = (time) => {
        if (previousTime.current !== undefined) {
            const deltaTime = time - previousTime.current;
            callback(time);
        }

        previousTime.current = time;
        requestID.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        requestID.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(requestID.current);
    }, [gameState]);
};
