<script lang="ts">
	import { cn } from '$lib/utils';

	interface Segment {
		label: string;
		emoji: string;
		percentage: number;
		color: string;
	}

	interface Props {
		segments: Segment[];
		centerValue: string;
		centerLabel: string;
		size?: number;
		strokeWidth?: number;
		class?: string;
	}

	let {
		segments,
		centerValue,
		centerLabel,
		size = 160,
		strokeWidth = 20,
		class: className
	}: Props = $props();

	const radius = $derived((size - strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const center = $derived(size / 2);

	// Calculate stroke-dasharray and stroke-dashoffset for each segment
	function getSegmentStyle(index: number): {
		dashArray: string;
		dashOffset: number;
		rotation: number;
	} {
		const segment = segments[index];
		const segmentLength = (segment.percentage / 100) * circumference;
		const gapLength = circumference - segmentLength;

		// Calculate rotation based on previous segments
		let rotationPercent = 0;
		for (let i = 0; i < index; i++) {
			rotationPercent += segments[i].percentage;
		}
		// Start from the top (-90 degrees) and add accumulated rotation
		const rotation = -90 + (rotationPercent / 100) * 360;

		return {
			dashArray: `${segmentLength} ${gapLength}`,
			dashOffset: 0,
			rotation
		};
	}
</script>

<div class={cn('flex items-center gap-8', className)}>
	<!-- SVG Donut Chart -->
	<div class="relative" style="width: {size}px; height: {size}px;">
		<svg width={size} height={size} class="rotate-0">
			{#each segments as segment, index (segment.label)}
				{@const style = getSegmentStyle(index)}
				<circle
					cx={center}
					cy={center}
					r={radius}
					fill="none"
					stroke={segment.color}
					stroke-width={strokeWidth}
					stroke-dasharray={style.dashArray}
					stroke-linecap="round"
					style="transform: rotate({style.rotation}deg); transform-origin: center;"
				/>
			{/each}
		</svg>
		<!-- Center text -->
		<div class="absolute inset-0 flex flex-col items-center justify-center">
			<span class="text-2xl font-bold text-white">{centerValue}</span>
			<span class="text-xs text-slate-400">{centerLabel}</span>
		</div>
	</div>

	<!-- Legend -->
	<div class="flex flex-col gap-3">
		{#each segments as segment (segment.label)}
			<div class="flex items-center gap-2">
				<div class="h-3 w-3 rounded-full" style="background-color: {segment.color};"></div>
				<span class="text-sm text-slate-300">{segment.label} ({segment.emoji})</span>
				<span class="text-sm font-medium text-slate-400">{segment.percentage}%</span>
			</div>
		{/each}
	</div>
</div>
