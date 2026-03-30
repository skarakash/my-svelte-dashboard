import type { TeamPosition, SortKey, FilterItem } from "./types";
export const relegationMap: Record<string, number> = {
    "92/93": 20,
    "93/94": 20,
    "94/95": 19,
    // add more seasons here
};

export const filters: FilterItem[] = [
    { id: 1, key: 'alpha', label: 'A-Z' },
    { id: 2, key: 'points', label: 'Points' },
    { id: 3, key: 'relegations', label: 'Relegations' },
    { id: 4, key: 'titles', label: "Titles" },
]

export function getCircleClass(d: TeamPosition): string {
    if (d.position === 1) return 'champion';
    if (d.position && (relegationMap[d.season] ? d.position >= relegationMap[d.season] : d.position >= 18)) {
        return 'relegated';
    }
    if (!d.position) return 'empty';
    return '';
}

export function getSortedTeams(key: SortKey, data: TeamPosition[]): string[] {
    const unique = [...new Set(data.map(t => t.short_name))];

    switch (key) {
        case 'alpha': return unique.sort((a, b) => a.localeCompare(b));
        case 'titles':
            return unique.sort((a, b) => {
                const ca = data.filter(t => t.short_name === a && t.position === 1).length;
                const cb = data.filter(t => t.short_name === b && t.position === 1).length;
                return cb - ca;
            });
        case 'relegations':
            return unique.sort((a, b) => {
                const ca = data.filter(t => t.short_name === a && t.position >= (relegationMap[t.season] || 18)).length;
                const cb = data.filter(t => t.short_name === b && t.position >= (relegationMap[t.season] || 18)).length;
                return cb - ca;
            });
        case 'points':
            return unique.sort((a, b) => {
                const sa = data.filter(t => t.short_name === a).reduce((sum, t) => sum + t.points, 0);
                const sb = data.filter(t => t.short_name === b).reduce((sum, t) => sum + t.points, 0);
                return sb - sa;
            });
        default: return unique;
    }
}