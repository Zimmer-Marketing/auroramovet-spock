<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';
	import { onMount } from 'svelte';

	interface ServiceItem {
		id: string;
		title: string;
		description?: string;
		icon?: string;
		image?: string;
		collectionId?: string;
	}

	interface Props {
		services?: ServiceItem[];
		className?: string;
	}

	let { services = [], className = '' }: Props = $props();

	let servicesVisible = $state(false);
	let sectionElement: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						servicesVisible = true;
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.2,
				rootMargin: '0px 0px -100px 0px'
			}
		);

		if (sectionElement) {
			observer.observe(sectionElement);
		}

		return () => {
			observer.disconnect();
		};
	});
</script>

<section bind:this={sectionElement} class="bg-gray-50 py-24 {className}">
	<div class=" container mx-auto px-6">
		<div class="mb-16 flex flex-col items-center text-center">
			<h2 class="text-xl text-primary md:mb-6 md:text-6xl">
				<span class="px-2 font-light md:px-5">OUR </span><span class="font-bold">SERVICES</span>
			</h2>
			<p
				class="mx-auto max-w-prose text-[14px] leading-relaxed text-primary md:px-36 md:text-[24px]"
			>
				From our facility in Aurora, MO, we provide in-clinic veterinary care as well as on-site
				visits for livestock and horses.
			</p>
		</div>

		{#if services && services.length > 0}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each services as service, index}
					<div class="relative">
						<EditRecordButton record={service} />
						<a href="/{service.slug}/" class="group relative block cursor-pointer">
							<!-- Card with image background - Fade in animation -->
							<div
								class="relative h-[280px] overflow-hidden rounded-2xl transition-all duration-700 ease-out {servicesVisible
									? 'opacity-100'
									: 'opacity-0'}"
								style="transition-delay: {index * 150}ms"
							>
								{#if service.image}
									<!-- Full background image -->
									<div
										class="absolute inset-0 bg-cover bg-center bg-no-repeat"
										style="background-image: url('{PUBLIC_POCKETBASE_URL}/api/files/services/{service.id}/{service.image}?thumb=600x400')"
									></div>
									<!-- Gradient overlay for better text visibility -->
								{:else}
									<!-- Fallback background if no image -->
									<div class="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700"></div>
								{/if}
							</div>

							<!-- Icon and Title below the card -->
							<div class="relative -mt-12 flex flex-col items-center">
								<!-- Icon with fade-in animation -->
								<div
									class="transition-all duration-700 ease-out {servicesVisible
										? 'opacity-100'
										: 'opacity-0'}"
									style="transition-delay: {index * 150 + 200}ms"
								>
									{#if service.icon}
										<!-- White circle background with larger ring -->
										<div
											class="relative mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-[#f9fafb]"
										>
											<!-- Green inner circle with icon - using primary color -->
											<div
												class="flex h-20 w-20 items-center justify-center rounded-full bg-primary"
											>
												<!--Here is the icon that needs to be growing on hoveer -->
												<img
													src={`${PUBLIC_POCKETBASE_URL}/api/files/services/${service.id}/${service.icon}?thumb=128x128`}
													alt={service.title}
													class="h-12 w-12 object-contain brightness-0 invert filter transition-transform duration-300 ease-out group-hover:scale-125"
												/>
											</div>
										</div>
									{:else}
										<!-- Default paw icon if no icon provided -->
										<div
											class="relative mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-2xl"
										>
											<div
												class="flex h-20 w-20 items-center justify-center rounded-full bg-[#2b482d]"
											>
												<svg
													class="h-12 w-12 text-white transition-transform duration-300 ease-out group-hover:scale-125"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
													/>
												</svg>
											</div>
										</div>
									{/if}
								</div>

								<!-- Text with slide-in from right animation -->
								<div
									class="transform transition-all duration-700 ease-out {servicesVisible
										? 'translate-x-0 opacity-100'
										: 'translate-x-8 opacity-0'}"
									style="transition-delay: {index * 150 + 400}ms"
								>
									<h3
										class="mb-2 text-center text-base font-bold uppercase tracking-wider text-gray-800 md:text-2xl"
									>
										{service.title}
									</h3>
									{#if service.description}
										<p class="px-4 text-center text-sm leading-relaxed text-gray-600">
											{service.description}
										</p>
									{/if}
								</div>
							</div>
						</a>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
