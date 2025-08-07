<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

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
</script>

<section class="bg-gray-50 py-24 {className}">
	<div class="container mx-auto px-6">
		<div class="mb-16 text-center">
			<h2 class="mb-6 flex text-5xl font-bold text-gray-800">
				<span class="font-light tracking-widest text-gray-600">OUR</span>
				<span class="text-gray-800">SERVICES</span>
			</h2>
			<p class="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700">
				From our facility in Aurora, MO, we provide in-clinic veterinary care as well as on-site
				visits for livestock and horses.
			</p>
		</div>

		{#if services && services.length > 0}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each services as service}
					<a
						href="/{service.slug}/"
						class="group cursor-pointer transition-transform duration-300 hover:scale-105"
					>
						<!-- Card with image background -->
						<div
							class="relative h-[280px] overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl"
						>
							{#if service.image}
								<!-- Full background image -->
								<div
									class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
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
							{#if service.icon}
								<!-- White circle background with larger ring -->
								<div
									class="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-[#f9fafb]"
								>
									<!-- Green inner circle with icon - using primary color -->
									<div class="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
										<img
											src={`${PUBLIC_POCKETBASE_URL}/api/files/services/${service.id}/${service.icon}?thumb=128x128`}
											alt={service.title}
											class="h-12 w-12 object-contain brightness-0 invert filter"
										/>
									</div>
								</div>
							{:else}
								<!-- Default paw icon if no icon provided -->
								<div
									class="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-2xl"
								>
									<div class="flex h-20 w-20 items-center justify-center rounded-full bg-[#2b482d]">
										<svg class="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
											/>
										</svg>
									</div>
								</div>
							{/if}

							<h3
								class="mb-2 text-center text-base font-bold uppercase tracking-wider text-gray-800"
							>
								{service.title}
							</h3>
							{#if service.description}
								<p class="px-4 text-center text-sm leading-relaxed text-gray-600">
									{service.description}
								</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
