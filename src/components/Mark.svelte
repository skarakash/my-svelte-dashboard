<script lang="ts">
	import type { TeamPosition } from '../types';

	export let d: TeamPosition;
	export let x: number;
	export let y: number;
	export let selectedTeam: string | null;
	export let r: number = 8;

	export let onHover: (e: MouseEvent, d: TeamPosition) => void;
	export let onMove: (e: MouseEvent) => void;
	export let onOut: () => void;
	export let onClick: (e: MouseEvent | KeyboardEvent, d: TeamPosition) => void;

	$: opacity = !selectedTeam || selectedTeam === d.short_name ? 1 : 0.15;
</script>

<g transform={`translate(${x}, ${y})`}>
	<circle
		class="data-point {d.cssClass}"
		{r}
		{opacity}
		onmouseover={(e) => onHover(e, d)}
		onmousemove={onMove}
		onmouseout={onOut}
		onclick={(e) => onClick(e, d)}
	/>
	<text>{d.position}</text>
	{selectedTeam}
</g>

<style>
	g {
		transition: transform 1.2s cubic-bezier(0.33, 1, 0.68, 1);
		will-change: transform;
	}
	circle {
		cursor: pointer;
		transition: opacity 0.8s ease;
	}
	text {
		font-size: 9px;
		text-anchor: middle;
		dominant-baseline: central;
		fill: white;
		pointer-events: none;
	}
</style>
