import * as d3 from 'd3';
import type { TeamPosition } from '../types';

export function drawAxes(
    chart: d3.Selection<SVGGElement, unknown, null, undefined>,
    stats: TeamPosition[],
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleBand<string>,
    handleTeamClick: (teamName: string) => void
) {
    if (!stats || !chart) return;

    const gx = chart.select<SVGGElement>('.x-axis');
    const gy = chart.select<SVGGElement>('.y-axis');

    gx.transition().duration(1200).call(d3.axisTop(xScale).tickSizeInner(0));
    gx.attr('dy', '0.45em');
    gx.select('.domain').remove().selectAll('text');

    gy.transition()
        .duration(1200)
        .ease(d3.easeCubicOut)
        .call(d3.axisLeft(yScale).tickSizeInner(0))
        .on('end', () => {
            gy.selectAll<SVGTextElement, string>('text').on('click', function (_, teamName: string) {
                handleTeamClick(teamName);
            });
        });
    gy.select('.domain').remove();
}