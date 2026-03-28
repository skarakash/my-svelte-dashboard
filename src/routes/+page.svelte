<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { TeamPosition } from '../types.js';
	import { getCircleClass } from '../utils.js';

	export let data: { stats: TeamPosition[] };
	let container: HTMLDivElement;
	let svgEl: SVGSVGElement;

	let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
	let chart: d3.Selection<SVGGElement, unknown, null, undefined>;
	let marks: d3.Selection<SVGGElement, unknown, null, undefined>;
	let labels: d3.Selection<SVGGElement, unknown, null, undefined>;

	let width = 800;
	let height = 600;

	const margin = { top: 100, right: 100, bottom: 150, left: 150 };
	$: teams = data.stats
		? [...new Set(data.stats.map((team: TeamPosition) => team.short_name))]
		: [];
	$: seasons = data.stats ? [...new Set(data.stats.map((item: TeamPosition) => item.season))] : [];

	onMount(() => {
		svg = d3.select(svgEl);
		chart = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
		marks = chart.append('g').attr('class', 'marks');
		labels = chart.append('g').attr('class', 'labels');

		const resizeObserver = new ResizeObserver(() => updateDimensions());
		resizeObserver.observe(container);

		return () => resizeObserver.disconnect();
	});

	function updateDimensions() {
		if (!container) return;

		width = container.clientWidth;
		height = container.clientHeight;

		svg.attr('width', width).attr('height', height);

		updateChart();
	}

	function updateChart() {
		if (!data.stats || !chart) return;
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		// Scales
		const xScale = d3.scaleBand<string>().domain(seasons).range([0, innerWidth]).padding(0.12);
		const yScale = d3.scaleBand<string>().domain(teams).range([0, innerHeight]).padding(0.12);

		// Axes

		chart.selectAll('.x-axis').remove();
		chart.selectAll('.y-axis').remove();

		chart
			.append('g')
			.attr('class', 'x-axis')
			.call(d3.axisTop(xScale).tickSizeInner(0))
			.select('.domain')
			.remove();
		chart
			.append('g')
			.attr('class', 'y-axis')
			.call(d3.axisLeft(yScale).tickSizeInner(0))
			.select('.domain')
			.remove();

		drawMarks(xScale, yScale);
		drawPositionLabels(xScale, yScale);
	}

	function drawMarks(xScale: d3.ScaleBand<string>, yScale: d3.ScaleBand<string>) {
		marks
			.selectAll<SVGCircleElement, TeamPosition>('circle.data-point')
			.data(data.stats, (d: TeamPosition) => `${d.season}-${d.short_name}`)
			.join(
				(enter) => {
					const circles = enter
						.append('circle')
						.attr('class', (d: TeamPosition) => `data-point ${getCircleClass(d)}`)
						.attr('cx', (d: TeamPosition) => xScale(d.season)! + xScale.bandwidth() / 2)
						.attr('cy', (d: TeamPosition) => yScale(d.short_name)! + yScale.bandwidth() / 2)
						.attr('r', 0)
						.attr('cursor', 'pointer');
					circles
						.transition()
						.duration(900)
						.attr('r', (d: TeamPosition) => (d.position ? 8 : 1.3));
					return circles;
				},
				(update) => {
					update
						.transition()
						.duration(1200)
						.ease(d3.easeCubicOut)
						.attr('cx', (d: TeamPosition) => (xScale(d.season) ?? 0) + xScale.bandwidth() / 2)
						.attr('cy', (d: TeamPosition) => (yScale(d.short_name) ?? 0) + yScale.bandwidth() / 2);
					return update;
				},
				(exit) => exit.transition().duration(600).attr('r', 0).remove()
			);
	}

	function drawPositionLabels(xScale: d3.ScaleBand<string>, yScale: d3.ScaleBand<string>) {
		const labelsArr = data.stats.filter((d: TeamPosition) => d.position);
		labels
			.selectAll<SVGTextElement, TeamPosition>('text.position')
			.data(labelsArr)
			.join(
				(enter) => {
					const labelsData = enter
						.append('text')
						.attr('class', 'position')
						.attr('dy', '0.35em')
						.attr('x', (d: TeamPosition) => (xScale(d.season) ?? 0) + xScale.bandwidth() / 2)
						.attr('y', (d: TeamPosition) => (yScale(d.short_name) ?? 0) + yScale.bandwidth() / 2)
						.text((d: TeamPosition) => d.position)
						.style('opacity', 0);

					labelsData.transition().duration(900).style('opacity', 1);
					return labelsData;
				},
				(update) => {
					update
						.transition()
						.duration(1200)
						.ease(d3.easeCubicOut)
						.attr('x', (d: TeamPosition) => xScale(d.season)! + xScale.bandwidth() / 2)
						.attr('y', (d: TeamPosition) => yScale(d.short_name)! + yScale.bandwidth() / 2);
					return update;
				},
				(exit) => exit.transition().duration(500).attr('opacity', 0).remove()
			);
	}
</script>

<div bind:this={container} class="chart-container">
	<!-- <h1>What was the teams end of the season positions in EPL era?</h1> -->
	<svg bind:this={svgEl}></svg>
</div>
