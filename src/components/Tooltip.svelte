<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { TeamPosition } from '../types';

	export let visible: boolean;
	export let x = 0;
	export let y = 0;
	export let data: TeamPosition | null = null;
</script>

{#if visible && data}
	<div
		class="tooltip pointer-events-none fixed z-10 rounded bg-white p-3 shadow-lg"
		style="top: {y}px; left: {x}px"
		transition:scale={{ duration: 120, start: 0.95 }}
	>
		<strong class={data.isChampion ? 'champion' : data.isRelegated ? 'relegated' : ''}>
			{data.short_name}
			{data.icon}
		</strong>
		<div>Season: {data.season}</div>
		<div>
			Position: <span class="highlight">{data.position}</span>
		</div>
		<div>
			Points: <span class="highlight">{data.points}</span>
		</div>
		<div>W{data.won} • D{data.drawn} • L{data.lost}</div>
	</div>
{/if}
