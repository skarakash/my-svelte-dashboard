<script lang="ts">
	import * as d3 from 'd3';
	import type { TeamPosition, SortKey } from '../types.js';
	import { getCircleClass, relegationMap, getSortedTeams, filters } from '../utils.js';
	import { onMount } from 'svelte';

	let { data } = $props<{ data: { stats: TeamPosition[] } }>();
	const margin = { top: 100, right: 220, bottom: 150, left: 150 };

	let currentSortKey = $state<SortKey>('alpha');
	let selectedTeamName = $state<string | null>(null);
	let markTooltipVisible = $state<boolean>(false);
	let markTooltipData = $state<TeamPosition | null>(null);
	let width = $state<number>(1300);
	let height = $state<number>(1200);

	let stats = $derived<TeamPosition[]>(data.stats);
	const sortedTeamNames = $derived<string[]>(stats ? getSortedTeams(currentSortKey, stats) : []);
	const seasons = $derived<string[]>(
		stats ? [...new Set(stats.map((item: TeamPosition) => item.season))] : []
	);
	const innerWidth = $derived<number>(width - margin.left - margin.right);
	const innerHeight = $derived<number>(height - margin.top - margin.bottom);

	let container: HTMLDivElement;
	let svgEl: SVGSVGElement;

	let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
	let chart: d3.Selection<SVGGElement, unknown, null, undefined>;
	let marks: d3.Selection<SVGGElement, unknown, null, undefined>;
	let labels: d3.Selection<SVGGElement, unknown, null, undefined>;

	onMount(() => {
		svg = d3.select(svgEl);
		chart = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
		chart.append('g').attr('class', 'x-axis');
		chart.append('g').attr('class', 'y-axis');
		marks = chart.append('g').attr('class', 'marks');
		labels = chart.append('g').attr('class', 'labels');
	});

	$effect(() => {
		const currentTeamNames = sortedTeamNames;
		const currentStats = stats;
		if (!currentStats?.length || !chart) return;
		const xScale = d3.scaleBand<string>().domain(seasons).range([0, innerWidth]).padding(0.12);
		const yScale = d3
			.scaleBand<string>()
			.domain(currentTeamNames)
			.range([0, innerHeight])
			.padding(0.12);

		drawAxes(xScale, yScale);
		drawMarks(xScale, yScale);
		drawPositionLabels(xScale, yScale);
	});

	function drawAxes(xScale: d3.ScaleBand<string>, yScale: d3.ScaleBand<string>) {
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

	function drawMarks(xScale: d3.ScaleBand<string>, yScale: d3.ScaleBand<string>) {
		const makrsArr = stats.filter((d: TeamPosition) => d.position);
		marks
			.selectAll<SVGCircleElement, TeamPosition>('circle.data-point')
			.data(makrsArr, (d: TeamPosition) => `${d.season}-${d.team_id}`)
			.join(
				(enter) => {
					const circles = enter
						.append('circle')
						.attr('class', (d: TeamPosition) => `data-point ${getCircleClass(d)}`)
						.attr('cx', (d: TeamPosition) => xScale(d.season)! + xScale.bandwidth() / 2)
						.attr('cy', (d: TeamPosition) => yScale(d.short_name)! + yScale.bandwidth() / 2)
						.attr('r', 0)
						.attr('cursor', 'pointer')
						.style('opacity', (d: TeamPosition) =>
							!selectedTeamName || selectedTeamName == d.short_name ? 1 : 0.15
						);
					circles.transition().duration(900).attr('r', 8);
					return circles;
				},
				(update) => {
					update
						.transition()
						.duration(1200)
						.ease(d3.easeCubicOut)
						.attr('cx', (d: TeamPosition) => (xScale(d.season) ?? 0) + xScale.bandwidth() / 2)
						.attr('cy', (d: TeamPosition) => (yScale(d.short_name) ?? 0) + yScale.bandwidth() / 2)
						.style('opacity', (d: TeamPosition) =>
							!selectedTeamName || selectedTeamName == d.short_name ? 1 : 0.15
						);
					return update;
				},
				(exit) => exit.transition().duration(600).attr('r', 0).remove()
			)
			.on('mouseover', handleMarkMouseOver)
			.on('mousemove', handleMarkMouseMove)
			.on('mouseout', handleMarkMouseOut)
			.on('click', function (event, datum) {
				console.log(datum);
			});
	}

	function handleTeamClick(teamName: string) {
		if (selectedTeamName == teamName) {
			selectedTeamName = null;
		} else {
			selectedTeamName = teamName;
		}
	}

	function drawPositionLabels(xScale: d3.ScaleBand<string>, yScale: d3.ScaleBand<string>) {
		const labelsArr = stats.filter((d: TeamPosition) => d.position);
		labels
			.selectAll<SVGTextElement, TeamPosition>('text.position')
			.data(labelsArr, (d: TeamPosition) => `${d.season}-${d.short_name}`)
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

	function handleMarkMouseOver(_: MouseEvent, d: TeamPosition) {
		if (!d.position) return;
		const relegationPosition = relegationMap[d.season] || 18;
		const isRelegated = d.position >= relegationPosition;
		const isChampion = d.position == 1;
		const icon = isChampion ? '🏆' : isRelegated ? '🔻' : '';
		markTooltipData = { ...d, icon, isRelegated, isChampion };
		markTooltipVisible = true;
	}

	function handleMarkMouseMove(event: MouseEvent) {
		if (!markTooltipVisible) return;

		const tooltip = document.querySelector('.mark-tooltip') as HTMLDivElement;
		if (!tooltip) return;

		//get tooltip size
		const tooltipHeight = tooltip.offsetHeight;
		const tooltipWidth = tooltip.offsetWidth;

		// set x and y for tooltip position
		let left = event.pageX + 15;
		let top = event.pageY + 15;

		// check if tooltip overflows container
		if (left + tooltipWidth > window.innerWidth) {
			left = event.pageX - tooltipWidth - 15;
		}

		if (top + tooltipHeight > window.innerHeight) {
			top = event.pageY - tooltipHeight - 15;
		}

		tooltip.style.left = `${left}px`;
		tooltip.style.top = `${top}px`;
	}

	function handleMarkMouseOut() {
		markTooltipData = null;
		markTooltipVisible = false;
	}
</script>

<div bind:this={container} class="chart-container">
	<div class="filters-wrapper">
		{#each filters as filter (filter.id)}
			<button
				type="button"
				onclick={() => (currentSortKey = filter.key)}
				class:active={currentSortKey == filter.key}>{filter.label}</button
			>
		{/each}
	</div>
	<div class="mark-tooltip" class:visible={markTooltipVisible}>
		{#if markTooltipData}
			<div class="tooltip-content">
				<strong
					class:champion={markTooltipData.isChampion}
					class:relegated={markTooltipData.isRelegated}
					>{markTooltipData.short_name} {markTooltipData.icon}</strong
				>
				<div class="tooltip-content-season">{markTooltipData.season}</div>
				<div class="tooltip-content-stats">
					<div>Position: <span class="highlight">{markTooltipData.position}</span></div>
					<div>Points: <span class="highlight">{markTooltipData.points}</span></div>
					<div>W{markTooltipData.won} • D{markTooltipData.drawn} • L{markTooltipData.lost}</div>
					<div>GF{markTooltipData.goals_for} : GA{markTooltipData.goals_against}</div>
				</div>
			</div>
		{/if}
	</div>
	<svg bind:this={svgEl} style="width: 100%;height:100%"></svg>
	<h1>Premier League Seasons Matrix</h1>
</div>
