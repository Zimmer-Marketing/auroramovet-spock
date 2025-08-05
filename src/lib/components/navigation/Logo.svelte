<!-- Logo.svelte -->
<script lang="ts">
	export let siteSettings: any;
	export let logoSrc: string;
	export let hidden: boolean;
	export let logoAlt: string;
	export let ariaLabel: string;
	export let shrink: number = 0;
</script>

<div
	class="relative col-span-3 flex items-center justify-center lg:justify-start {hidden
		? 'lg:hidden'
		: ''} "
>
	<a href="/" aria-label={ariaLabel}>
		<img
			src={logoSrc}
			alt={logoAlt}
			class="relative z-10 w-[10rem] transform-gpu transition-transform duration-75"
			style="transform: scale({1 - (0.4 * shrink)})"
		/>
	</a>
</div>
