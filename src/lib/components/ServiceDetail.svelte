<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	interface Service {
		id: string;
		title: string;
		slug: string;
		description?: string;
		content?: string;
		image?: string;
		icon?: string;
		collectionId?: string;
	}

	interface Props {
		service: Service;
		relatedServices?: Service[];
		className?: string;
	}

	let { service, relatedServices = [], className = '' }: Props = $props();

	const getImageUrl = (svc: Service) => {
		if (svc.image) {
			return `${PUBLIC_POCKETBASE_URL}/api/files/services/${svc.id}/${svc.image}`;
		}
		return '/placeholder-service.jpg';
	};

	const getIconUrl = (svc: Service) => {
		if (svc.icon) {
			return `${PUBLIC_POCKETBASE_URL}/api/files/services/${svc.id}/${svc.icon}`;
		}
		return null;
	};
</script>

<div class={cn('min-h-screen bg-background', className)}>
	<!-- Hero Section with Service Image -->
	<section class="relative h-[500px] overflow-hidden">
		<div
			class="absolute inset-0 bg-cover bg-center bg-no-repeat"
			style="background-image: url('{getImageUrl(service)}')"
		>
			<!-- Gradient overlay -->
			<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
		</div>
		
		<div class="relative z-10 flex h-full flex-col items-center justify-end pb-20 text-white">
			{#if getIconUrl(service)}
				<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">
					<div class="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
						<img
							src={getIconUrl(service)}
							alt={service.title}
							class="h-12 w-12 object-contain brightness-0 invert filter"
						/>
					</div>
				</div>
			{/if}
			<h1 class="mb-4 text-center text-5xl font-bold uppercase tracking-wider text-white drop-shadow-lg">
				{service.title}
			</h1>
			{#if service.description}
				<p class="max-w-3xl text-center text-lg text-white/90">
					{service.description}
				</p>
			{/if}
		</div>
	</section>

	<!-- Main Content Section -->
	<section class="py-16">
		<div class="container mx-auto px-6">
			<div class="mx-auto max-w-4xl">
				{#if service.content}
					<article class="prose prose-lg max-w-none">
						{@html service.content}
					</article>
				{/if}

				<!-- Call to Action -->
				<div class="mt-12 rounded-2xl bg-primary p-8 text-center text-white">
					<h2 class="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
					<p class="mb-6 text-lg">
						Contact us today to schedule an appointment for {service.title.toLowerCase()} services.
					</p>
					<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button
							variant="secondary"
							size="lg"
							class="px-8"
							onclick={() => window.location.href = '/contact-us'}
						>
							Schedule Appointment
						</Button>
						<Button
							variant="outline"
							size="lg"
							class="border-white bg-transparent text-white hover:bg-white hover:text-primary"
							onclick={() => window.location.href = 'tel:417-678-3112'}
						>
							Call (417) 678-3112
						</Button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Related Services Section -->
	{#if relatedServices.length > 0}
		<section class="bg-gray-50 py-16">
			<div class="container mx-auto px-6">
				<h2 class="mb-12 text-center text-4xl font-bold text-gray-800">
					Other Services We Offer
				</h2>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each relatedServices as relatedService}
						<a
							href="/{relatedService.slug}/"
							class="group cursor-pointer"
						>
							<div
								class="relative h-[280px] overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
							>
								{#if relatedService.image}
									<div
										class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
										style="background-image: url('{getImageUrl(relatedService)}')"
									></div>
									<div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
								{:else}
									<div class="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700"></div>
								{/if}
							</div>

							<div class="relative -mt-12 flex flex-col items-center">
								{#if getIconUrl(relatedService)}
									<div class="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-[#f9fafb]">
										<div class="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
											<img
												src={getIconUrl(relatedService)}
												alt={relatedService.title}
												class="h-12 w-12 object-contain brightness-0 invert filter"
											/>
										</div>
									</div>
								{:else}
									<div class="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-2xl">
										<div class="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
											<svg class="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
												<path
													d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
												/>
											</svg>
										</div>
									</div>
								{/if}

								<h3 class="mb-2 text-center text-base font-bold uppercase tracking-wider text-gray-800">
									{relatedService.title}
								</h3>
								{#if relatedService.description}
									<p class="px-4 text-center text-sm leading-relaxed text-gray-600">
										{relatedService.description}
									</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</div>