<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	interface Props {
		title: string;
		content: string;
		heroImage?: string;
		className?: string;
	}

	let { title, content, heroImage = '/hero-building.jpg', className = '' }: Props = $props();
</script>

<section class="relative -mt-44 h-screen overflow-hidden md:pt-24 {className}">
	<div
		class="absolute inset-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('{heroImage}')"
	></div>
	<div class="absolute inset-0 bg-black/35"></div>

	<div
		class="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-primary-foreground"
	>
		<h1
			class="mb-6 text-center text-xl font-bold md:text-6xl"
			style="text-shadow: rgba(0,0,0,0.5) 0px 4px 7px"
		>
			{title}
		</h1>
		<p
			class="mx-auto mb-8 max-w-4xl text-sm md:text-lg"
			style="text-shadow: rgba(0,0,0,0.5) 0px 4px 4px"
		>
			{@html content}
		</p>
		<Button size="lg" class="px-8 py-3">Contact Us</Button>
	</div>
</section>

