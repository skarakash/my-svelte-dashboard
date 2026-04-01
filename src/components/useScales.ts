import * as d3 from 'd3';

export function createScales(seasons: string[], teamNames: string[], width: number, height: number) {
    const xScale = d3
        .scaleBand<string>()
        .domain(seasons)
        .range([0, width])
        .padding(0.12);
    const yScale = d3
        .scaleBand<string>()
        .domain(teamNames)
        .range([0, height])
        .padding(0.12);
    return { xScale, yScale }
}