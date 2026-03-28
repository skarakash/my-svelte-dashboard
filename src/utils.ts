import type { TeamPosition } from "./types";
export const relegationMap: Record<string, number> = {
    "92/93": 20,
    "93/94": 20,
    "94/95": 19,
    // add more seasons here
};

export function getCircleClass(d: TeamPosition): string {
    if (d.position === 1) return 'champion';
    if (d.position && (relegationMap[d.season] ? d.position >= relegationMap[d.season] : d.position >= 18)) {
        return 'relegated';
    }
    if (!d.position) return 'empty';
    return '';
}