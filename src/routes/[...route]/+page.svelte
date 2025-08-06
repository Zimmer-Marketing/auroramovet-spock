<script lang="ts">
	import Breadcrumbs from '$lib/components/BreadCrumbs.svelte';
	import RouteMeta from '$lib/components/RouteMeta.svelte';
	import type { PageData } from './$types';
	import FAQCard from '$lib/components/FAQCard.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import PbImage from '$lib/components/PbImage.svelte';
	import * as Carousel from '$lib/components/ui/carousel';
	import { findGlobal } from '$lib/helpers/pbHelpers';
	import GlobalCard from '$lib/components/globals/GlobalCard.svelte';
	import * as Card from '$lib/components/ui/card';
	import ContactInfo from '$lib/components/ContactInfo.svelte';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getPbRecordImageURL } from '$lib/helpers/pbHelpers';
	import ServiceDetail from '$lib/components/ServiceDetail.svelte';
	import NewPageLayout from '$lib/components/NewPageLayout.svelte';

	let isOpen = $state(false);

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { route, siteSettings, routeType, relatedServices } = $derived(data);

	// Determine if this page should use the new layout
	const shouldUseNewLayout = $derived(() => {
		if (!route) return false;

		try {
			// Use new layout for services or pages with specific criteria
			const newLayoutPages = ['pets', 'equine', 'livestock'];
			const hasNewLayoutField = route?.useNewLayout === true;
			const hasNewLayoutSlug = route?.slug && newLayoutPages.includes(route.slug);
			const isService = routeType === 'service';

			// Debug logging
			console.log('Route debug:', {
				slug: route?.slug,
				routeType,
				hasNewLayoutField,
				hasNewLayoutSlug,
				isService,
				shouldUse: hasNewLayoutField || hasNewLayoutSlug || isService
			});

			return hasNewLayoutField || hasNewLayoutSlug || isService;
		} catch (err) {
			console.error('Error determining layout:', err);
			return false;
		}
	});
</script>

<RouteMeta {route} {siteSettings} />

{#if shouldUseNewLayout()}
	<!-- New Page Layout -->
	<NewPageLayout
		{route}
		showContactForm={true}
	/>
{:else}
	<!-- Regular Page Content -->
	<div class="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-4 md:grid-cols-6">
		<div class="col-span-full md:col-span-4">
			<div class="max-w-3xl px-4 py-3 md:px-8">
				<Breadcrumbs route={{ ...route, shortTitle: route.shortTitle }} />
				<h1>{route.title}</h1>
				{#if route.images.length === 1}
					{@const imgSrc = getPbRecordImageURL(route, 0, '800x600')}
					{@const imgSrcZoom = getPbRecordImageURL(route, 0, '1920x0')}
					<button
						onclick={() => (isOpen = true)}
						class="group relative cursor-zoom-in overflow-hidden rounded-lg"
					>
						<img
							src={imgSrc}
							alt={route.title}
							class="w-full transition-transform duration-700 ease-out group-hover:scale-110"
						/>
					</button>

					<Dialog.Root bind:open={isOpen}>
						<Dialog.Content class="max-h-fit max-w-fit bg-transparent p-0 shadow-none">
							<img
								src={imgSrcZoom}
								alt={route.title}
								class="mx-auto block h-auto max-h-[95vh] w-auto max-w-[95vw] object-contain"
							/>
						</Dialog.Content>
					</Dialog.Root>
				{:else if route.images.length > 1}
					<div class="py-3">
						<Carousel.Root class="w-full max-w-xl">
							<Carousel.Content>
								{#each route.images as image, i (i)}
									<Carousel.Item>
										<div class="p-1">
											<PbImage
												record={route}
												photoName={image}
												alt={route.title + 1}
												height={800}
												width={600}
											/>
										</div>
									</Carousel.Item>
								{/each}
							</Carousel.Content>
							<Carousel.Previous />
							<Carousel.Next />
						</Carousel.Root>
					</div>
				{/if}
				{#if route.content}
					<article class="max-w-prose">
						{@html route.content}
					</article>
				{/if}
				{#if route.expand?.faqs}
					{@const faqs = route.expand.faqs}
					<FAQCard {faqs} />
				{/if}
				{#if route.expand?.testimonials}
					{@const testimonials = route.expand.testimonials}
					<div class="grid grid-cols-1 gap-4">
						{#each testimonials as testimonial}
							<Card.Root>
								<Card.Header>
									<Card.Title>{testimonial.name}</Card.Title>
								</Card.Header>
								<Card.Content>
									<article>
										{@html testimonial.review}
									</article>
								</Card.Content>
								<EditRecordButton record={testimonial} />
							</Card.Root>
						{/each}
					</div>
				{/if}
				{#if route.slug === 'contact-us'}
					<ContactForm />
				{/if}
			</div>
		</div>
		<div
			class="col-span-full flex flex-col gap-4 p-4 md:sticky md:top-4 md:col-span-2 md:self-start"
		>
			{#if route.slug === 'contact-us'}
				<ContactInfo {siteSettings} />
			{:else}
				<GlobalCard record={findGlobal(siteSettings, 'related-pages-data')} />
			{/if}
		</div>
	</div>
{/if}
