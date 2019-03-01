import { WIDTH } from "./rules";


export function indexOf(r, c) {
    return r * WIDTH + c;
}

export function range(n) {
    return Array.from(new Array(n), (_, i) => i);
}