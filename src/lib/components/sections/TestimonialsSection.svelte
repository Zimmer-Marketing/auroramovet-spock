<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Testimonial {
		id?: string;
		name: string;
		review: string;
		rating?: number;
	}

	interface Props {
		testimonials?: Testimonial[];
		className?: string;
	}

	let { testimonials = [], className = '' }: Props = $props();

	// Default to 5 stars if rating is not provided
	const getRating = (testimonial: Testimonial) => testimonial.rating || 5;

	// Carousel state
	let currentIndex = $state(0);
	let autoPlayInterval: ReturnType<typeof setInterval> | undefined;

	// Number of testimonials to show at once
	const testimonialsPerView = 3;

	// Calculate the number of pages
	const totalPages = $derived(Math.ceil(testimonials.length / testimonialsPerView));

	// Get the current set of testimonials to display
	const visibleTestimonials = $derived(
		testimonials.slice(currentIndex * testimonialsPerView, (currentIndex + 1) * testimonialsPerView)
	);

	// Navigation functions
	const goToPage = (index: number) => {
		currentIndex = index;
		resetAutoPlay();
	};

	const nextPage = () => {
		currentIndex = (currentIndex + 1) % totalPages;
		resetAutoPlay();
	};

	const prevPage = () => {
		currentIndex = (currentIndex - 1 + totalPages) % totalPages;
		resetAutoPlay();
	};

	// Auto-play functionality
	const startAutoPlay = () => {
		autoPlayInterval = setInterval(() => {
			nextPage();
		}, 5000); // Change slide every 5 seconds
	};

	const stopAutoPlay = () => {
		if (autoPlayInterval) {
			clearInterval(autoPlayInterval);
		}
	};

	const resetAutoPlay = () => {
		stopAutoPlay();
		startAutoPlay();
	};

	onMount(() => {
		if (testimonials.length > testimonialsPerView) {
			startAutoPlay();
		}
	});

	onDestroy(() => {
		stopAutoPlay();
	});
</script>

<!-- Testimonials Section with flowing wave design -->
<section class="relative bg-[#2b482d] py-12 {className}">
	<!-- Decorative wave backgrounds like in Figma -->
	<div class="pointer-events-none absolute inset-0">
		<!-- Top wave with rotation -->
		<div class="absolute -top-20 left-0 right-0 h-64 w-full overflow-hidden opacity-30">
			<img
				src="/03267d81b22af4c48f998cfa906042bed8183496.png"
				alt=""
				class="h-full w-full rotate-[2.553deg] scale-110 transform object-cover"
			/>
		</div>

		<!-- Bottom wave with opposite rotation - extends beyond section -->
		<div class="absolute -bottom-40 left-0 right-0 z-20 h-80 w-full opacity-30">
			<img
				src="/03267d81b22af4c48f998cfa906042bed8183496.png"
				alt=""
				class="h-full w-full rotate-[182.543deg] scale-110 transform object-cover"
			/>
		</div>

		<!-- Additional middle wave layers for depth -->
		<div class="absolute left-0 right-0 top-1/4 h-48 w-full opacity-10">
			<svg
				viewBox="0 0 1440 200"
				class="h-full w-full"
				preserveAspectRatio="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0,100 C360,50 720,150 1080,100 C1260,75 1380,125 1440,100 L1440,0 L0,0 Z"
					fill="#5a7d5f"
				/>
			</svg>
		</div>
	</div>

	<div class="container relative z-10 mx-auto px-6">
		<h2 class="mb-16 text-center text-4xl font-bold text-white md:text-5xl">
			Maintaining Outstanding<br />
			Standards of Veterinary Care!
		</h2>

		<!-- Carousel Container -->
		<div class="relative mx-auto max-w-7xl">
			<!-- Previous Button -->
			{#if testimonials.length > testimonialsPerView}
				<button
					onclick={() => prevPage()}
					class="absolute left-0 top-1/2 z-20 -translate-x-12 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
					aria-label="Previous testimonials"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
			{/if}

			<!-- Testimonials Grid -->
			<div class="grid min-h-[400px] items-center gap-8 md:grid-cols-3">
				{#each visibleTestimonials as testimonial, index}
					{#if index === 1}
						<!-- Center testimonial with white card and speech bubble -->
						<div class="relative w-96 text-center">
							<div class="relative mx-8 rounded-2xl bg-white p-8 text-gray-800 shadow-2xl">
								<!-- Speech bubble pointer -->
								<div
									class="absolute -bottom-4 left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-white"
								></div>

								<p class="mb-6 text-base leading-relaxed text-gray-700">
									{@html testimonial.review}
								</p>
								<div class="mb-4 flex justify-center space-x-1">
									{#each Array(getRating(testimonial)) as _}
										<span class="text-2xl text-gray-600">★</span>
									{/each}
								</div>
							</div>
							<!-- Name below the card -->
							<p class="mt-8 text-xl font-bold text-white">{testimonial.name}</p>
						</div>
					{:else}
						<!-- Side testimonials blending with background -->
						<div class="w-96 px-4 text-center text-white/90">
							<!-- Large decorative quote -->
							<div class="mb-4 text-8xl opacity-20">"</div>
							<p class="mx-auto mb-6 max-w-xs text-base leading-relaxed">
								{@html testimonial.review}
							</p>
							<div class="mb-4 flex justify-center space-x-1">
								{#each Array(getRating(testimonial)) as _}
									<span class="text-xl text-white/80">★</span>
								{/each}
							</div>
							<p class="text-lg font-semibold">{testimonial.name}</p>
						</div>
					{/if}
				{/each}
			</div>

			<!-- Next Button -->
			{#if testimonials.length > testimonialsPerView}
				<button
					onclick={() => nextPage()}
					class="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-12 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
					aria-label="Next testimonials"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			{/if}
		</div>

		<!-- Navigation Dots -->
		{#if totalPages > 1}
			<div class="mt-16 flex justify-center space-x-3">
				{#each Array(totalPages) as _, pageIndex}
					<button
						onclick={() => goToPage(pageIndex)}
						class={`h-2 w-16 rounded-full transition-all ${
							pageIndex === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
						}`}
						aria-label={`Go to testimonials page ${pageIndex + 1}`}
					></button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Wave transition to next section -->
	<div class="absolute -bottom-1 left-0 right-0 w-full">
		<svg
			viewBox="0 0 1440 120"
			class="w-full"
			preserveAspectRatio="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0,40 C360,100 720,20 1080,60 C1260,85 1380,65 1440,80 L1440,120 L0,120 Z"
				fill="#f9fafb"
			/>
		</svg>
	</div>
</section>

