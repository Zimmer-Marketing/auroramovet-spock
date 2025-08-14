<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import EditRecordButton from './pocketbase/EditRecordButton.svelte';

	interface Testimonial {
		id?: string;
		name: string;
		review: string;
		rating?: number;
	}

	interface Props {
		testimonials?: Testimonial[];
		className?: string;
		testimonialsPerView?: number;
		showTitle?: boolean;
	}

	let { testimonials = [], className = '', testimonialsPerView = 3, showTitle = true }: Props = $props();

	// Default to 5 stars if rating is not provided
	const getRating = (testimonial: Testimonial) => testimonial.rating || 5;

	// Carousel state - now tracks individual testimonial index, not page
	let currentIndex = $state(0);
	let autoPlayInterval: ReturnType<typeof setInterval> | undefined;

	// Number of testimonials to show at once is now controlled by prop

	// Get the current set of testimonials to display (sliding window)
	const visibleTestimonials = $derived(
		testimonials.length <= testimonialsPerView
			? testimonials
			: (() => {
					const result = [];
					for (let i = 0; i < testimonialsPerView; i++) {
						const index = (currentIndex + i) % testimonials.length;
						result.push(testimonials[index]);
					}
					return result;
				})()
	);

	// For mobile, show only the first testimonial from visibleTestimonials
	const mobileVisibleTestimonials = $derived([visibleTestimonials[0]].filter(Boolean));

	// Calculate total pages for dots
	const totalPages = $derived(testimonials.length);

	// Navigation functions
	const goToPage = (index: number) => {
		currentIndex = index;
		resetAutoPlay();
	};

	const nextPage = () => {
		currentIndex = (currentIndex + 1) % testimonials.length;
		resetAutoPlay();
	};

	const prevPage = () => {
		currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
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

<!-- Simplified Testimonials Section without wave backgrounds -->
<section class="relative bg-gray-50 py-20 {className}">
	<div class="relative z-10 w-full px-6 lg:px-12 xl:px-20">
		{#if showTitle}
			<h2 class="mb-16 text-center text-2xl font-bold text-gray-800 md:text-5xl">
				What Our Clients Say
			</h2>
		{/if}

		<!-- Carousel Container -->
		<div class="relative mx-auto w-full max-w-screen-xl">
			<!-- Previous Button -->
			{#if testimonials.length > testimonialsPerView}
				<button
					onclick={() => prevPage()}
					class="absolute -left-16 top-1/2 z-20 -translate-y-1/2 rounded-full bg-gray-200 p-3 text-gray-600 transition-all hover:bg-gray-300 lg:-left-20"
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
			<!-- Mobile: Show 1 testimonial -->
			<div class="block md:hidden">
				<div class="grid min-h-[300px] grid-cols-1 items-center gap-8">
					{#each mobileVisibleTestimonials as testimonial, index}
						<!-- All testimonials with white cards -->
						<div class="flex flex-col items-center text-center">
							<div class="relative w-full rounded-2xl bg-white px-8 py-10 text-gray-800 shadow-lg">
								<EditRecordButton record={testimonial} />
								<!-- Review text with quote -->
								<div class="text-left">
									<!-- Large decorative quote positioned right above text -->
									<div class="-mb-4 text-5xl text-gray-300">"</div>
									<p class="mb-8 min-h-[80px] pl-8 text-base leading-relaxed text-gray-700">
										{@html testimonial.review}
									</p>
								</div>

								<!-- Stars -->
								<div class="flex justify-center space-x-1">
									{#each Array(getRating(testimonial)) as _}
										<span class="text-2xl text-yellow-400">★</span>
									{/each}
								</div>
							</div>
							<!-- Name below the card -->
							<p class="mt-6 text-lg font-bold text-gray-800">{testimonial.name}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Desktop: Show multiple testimonials -->
			<div class="hidden md:block">
				<div
					class="grid min-h-[300px] items-center gap-8 {testimonialsPerView === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-8 lg:gap-12"
				>
					{#each visibleTestimonials as testimonial, index}
					<!-- All testimonials with white cards -->
					<div class="flex flex-col items-center text-center">
						<div class="relative w-full rounded-2xl bg-white px-8 py-10 text-gray-800 shadow-lg">
							<EditRecordButton record={testimonial} />
							<!-- Review text with quote -->
							<div class="text-left">
								<!-- Large decorative quote positioned right above text -->
								<div class="-mb-4 text-5xl text-gray-300">"</div>
								<p class="mb-8 min-h-[80px] pl-8 text-base leading-relaxed text-gray-700">
									{@html testimonial.review}
								</p>
							</div>

							<!-- Stars -->
							<div class="flex justify-center space-x-1">
								{#each Array(getRating(testimonial)) as _}
									<span class="text-2xl text-yellow-400">★</span>
								{/each}
							</div>
						</div>
						<!-- Name below the card -->
						<p class="mt-6 text-lg font-bold text-gray-800">{testimonial.name}</p>
					</div>
					{/each}
				</div>
			</div>

			<!-- Next Button -->
			{#if testimonials.length > testimonialsPerView}
				<button
					onclick={() => nextPage()}
					class="absolute -right-16 top-1/2 z-20 -translate-y-1/2 rounded-full bg-gray-200 p-3 text-gray-600 transition-all hover:bg-gray-300 lg:-right-20"
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

		<!-- Navigation Dots - show dots for number of testimonials -->
		{#if testimonials.length > testimonialsPerView}
			<div class="mt-12 flex justify-center space-x-3">
				{#each Array(testimonials.length) as _, dotIndex}
					<button
						onclick={() => goToPage(dotIndex)}
						class={`h-2 w-2 rounded-full transition-all ${
							dotIndex === currentIndex ? 'w-8 bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
						}`}
						aria-label={`Go to testimonial ${dotIndex + 1}`}
					></button>
				{/each}
			</div>
		{/if}
	</div>
</section>