import { useEffect, useRef } from "react";

const useWorker = (src, eventHandler) => {
    const workerRef = useRef(null);
    const eventRef = useRef(eventHandler);

    useEffect(() => {
        const code = src.toString();
        const blob = new Blob(['('+code+')()']);
        const w = new Worker(URL.createObjectURL(blob));
        workerRef.current = w;
        return () => {
            w.terminate();
        };
    }, [src]);
    useEffect(() => {
        const currentEventHandler = eventRef.current;
        const w = workerRef.current;
        w.removeEventListener('message', currentEventHandler);
        w.addEventListener('message', eventHandler);
        eventRef.current = eventHandler;
    }, [eventHandler]);

    return workerRef.current;
};

export default useWorker;