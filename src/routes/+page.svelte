<script lang="ts">
	import * as d3 from 'd3';
	import type { TeamPosition, SortKey } from '../types.js';
	import {
		getSortedTeams,
		filters,
		isChampion,
		isRelegated,
		getCircleClass,
		getIcon
	} from '../utils.js';
	import Tooltip from '../components/Tooltip.svelte';
	import Mark from '../components/Mark.svelte';

	let { data } = $props<{ data: { stats: TeamPosition[] } }>();
	const margin = { top: 100, right: 220, bottom: 150, left: 150 };

	let currentSortKey = $state<SortKey>('alpha');
	let selectedTeam = $state<string | null>(null);
	let markTooltipVisible = $state<boolean>(false);
	let tooltipX = $state<number>(0);
	let tooltipY = $state<number>(0);
	let markTooltipData = $state<TeamPosition | null>(null);
	let width = $state<number>(1300);
	let height = $state<number>(1200);

	let stats = $derived<TeamPosition[]>(
		data.stats.map((team: TeamPosition) => ({
			...team,
			isChampion: isChampion(team),
			isRelegated: isRelegated(team),
			cssClass: getCircleClass(team),
			icon: getIcon(team)
		}))
	);
	const teamNames = $derived<string[]>(stats ? getSortedTeams(currentSortKey, stats) : []);
	const seasons = $derived<string[]>(
		stats ? [...new Set(stats.map((item: TeamPosition) => item.season))] : []
	);
	const positionedStats = $derived(stats.filter((d) => d.position));
	let xScale = $state<d3.ScaleBand<string> | null>(null);
	let yScale = $state<d3.ScaleBand<string> | null>(null);

	let container: HTMLDivElement;
	let svgEl: SVGSVGElement;

	$effect(() => {
		xScale = d3
			.scaleBand<string>()
			.domain(seasons)
			.range([0, width - margin.left - margin.right])
			.padding(0.12);

		yScale = d3
			.scaleBand<string>()
			.domain(teamNames)
			.range([0, height - margin.top - margin.bottom])
			.padding(0.12);
	});

	function handleTeamClick(teamName: string) {
		if (selectedTeam == teamName) {
			selectedTeam = null;
		} else {
			selectedTeam = teamName;
		}
	}

	function handleMarkMouseOver(_: MouseEvent, d: TeamPosition) {
		if (!d.position) return;
		markTooltipData = d;
		markTooltipVisible = true;
	}

	function handleMarkMouseMove(event: MouseEvent) {
		tooltipX = event.pageX + 10;
		tooltipY = event.pageY + 10;
	}

	function handleMarkMouseOut() {
		markTooltipData = null;
		markTooltipVisible = false;
	}
</script>

<div
	bind:this={container}
	class="chart-container"
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<div class="filters-wrapper">
		{#each filters as filter (filter.id)}
			<button
				type="button"
				onclick={() => (currentSortKey = filter.key)}
				class:active={currentSortKey == filter.key}>{filter.label}</button
			>
		{/each}
	</div>
	<svg bind:this={svgEl} style="width: 100%;height:100%">
		<g transform="translate({margin.left}, {margin.top})">
			{#if yScale && xScale}
				<g class="y-axis">
					{#each teamNames as teamName (teamName)}
						<g
							role="button"
							onclick={() => handleTeamClick(teamName)}
							transform={`translate(0, ${yScale(teamName)! + yScale.bandwidth() / 2})`}
						>
							<text
								x={-10}
								style={`opacity: ${!selectedTeam || selectedTeam === teamName ? 1 : 0.15}`}
								>{teamName}</text
							>
						</g>
					{/each}
				</g>

				<g class="x-axis">
					{#each seasons as season (season)}
						<text y={xScale(season)! + xScale.bandwidth() / 2} x={10}>
							{season}
						</text>
					{/each}
				</g>

				<g class="marks">
					{#each positionedStats.filter((d: TeamPosition) => d.position) as d (d.season + '-' + d.team_id)}
						{#if d}
							<Mark
								{d}
								x={xScale(d.season)! + xScale.bandwidth() / 2}
								y={yScale(d.short_name)! + yScale.bandwidth() / 2}
								{selectedTeam}
								onHover={handleMarkMouseOver}
								onMove={handleMarkMouseMove}
								onOut={handleMarkMouseOut}
								onClick={(_, d) => console.log(d)}
							/>
						{/if}
					{/each}
				</g>
			{/if}
		</g>
	</svg>
	<h1>Premier League Seasons Matrix</h1>
	<Tooltip visible={markTooltipVisible} x={tooltipX} y={tooltipY} data={markTooltipData} />
</div>
