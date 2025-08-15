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
	import TestimonialsCarousel from '$lib/components/TestimonialsCarousel.svelte';
	import TeamSection from '$lib/components/sections/TeamSection.svelte';
	import Careers from '$lib/components/sections/Careers.svelte';
	import ServiceCardsSidebar from '$lib/components/ServiceCardsSidebar.svelte';

	let isOpen = $state(false);

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { route, siteSettings, routeType, relatedServices, testimonials, teamMembers, jobs } =
		$derived(data);

	// Determine if this page should use the new layout
	const shouldUseNewLayout = $derived(() => {
		if (!route) return false;

		try {
			// Use new layout for services or pages with specific criteria
			const newLayoutPages = ['pets', 'equine', 'livestock'];
			const hasNewLayoutField = route?.useNewLayout === true;
			const hasNewLayoutSlug = route?.slug && newLayoutPages.includes(route.slug);
			const isService = routeType === 'service';

			return hasNewLayoutField || hasNewLayoutSlug || isService;
		} catch (err) {
			console.error('Error determining layout:', err);
			return false;
		}
	});
</script>

<RouteMeta {route} {siteSettings} />

{#if route.slug === 'careers'}
	<!-- Careers Page Layout -->
	<Careers data={{ route, jobs, siteSettings }} />
{:else if shouldUseNewLayout()}
	<!-- New Page Layout -->
	<NewPageLayout {route} showContactForm={true} />
{:else}
	<!-- Regular Page Content -->
	<div
		class="relative mx-auto grid w-full max-w-screen-3xl grid-cols-1 gap-4 md:grid-cols-6 3xl:min-w-[1920px]"
	>
		<div class="col-span-full md:col-span-4">
			<div class="py-3">
				<div class="px-4 md:px-8">
					<Breadcrumbs route={{ ...route, shortTitle: route.shortTitle }} />
				</div>
				<div class="relative px-4 md:px-8">
					<h1 class="text-primary">{route.title}</h1>
					<EditRecordButton record={route} />
				</div>
				{#if route.images.length === 1}
					{@const imgSrc = getPbRecordImageURL(route, 0, '800x600')}
					{@const imgSrcZoom = getPbRecordImageURL(route, 0, '1920x0')}
					<div class="px-4 md:px-8">
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
					</div>

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
					<div class="px-4 py-3 md:px-8">
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
				<article class="min-h-[1px] px-4 md:px-8">
					{#if route.content}
						{@html route.content}
					{/if}
				</article>
				{#if route.expand?.faqs}
					{@const faqs = route.expand.faqs}
					<div class="px-4 md:px-8">
						<FAQCard {faqs} />
					</div>
				{/if}
				{#if route.slug === 'contact-us'}
					<div class="px-4 md:px-8">
						<ContactForm />
					</div>
				{/if}
				{#if route.slug === 'testimonials' && testimonials && testimonials.length > 0}
					<div class="px-4 py-8 md:px-8">
						<div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{#each testimonials as testimonial}
								<div class="flex flex-col items-center text-center">
									<div
										class="relative w-full rounded-2xl bg-white px-8 py-10 text-gray-800 shadow-lg"
									>
										<!-- Review text with quote -->
										<div class="text-left">
											<div class=" mb-4 ml-8 text-5xl text-gray-300">
												<img src="/quote.svg" alt="" />
											</div>
											<p class="mb-8 min-h-[80px] pl-8 text-base leading-relaxed text-gray-700">
												{@html testimonial.review}
											</p>
										</div>
										<!-- Stars -->
										<div class="flex justify-center space-x-1">
											{#each Array(testimonial.rating || 5) as _}
												<span class="text-2xl text-primary">★</span>
											{/each}
										</div>
									</div>
									<!-- Name below card -->
									<p class="mt-6 text-lg font-bold text-gray-800">{testimonial.name}</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}
				{#if route.slug === 'about' && teamMembers && teamMembers.length > 0}
					<div class="mt-8 px-4 md:px-8">
						<TeamSection {teamMembers} className="" showTitle={false} showAboutButton={false} />
					</div>
				{/if}
			</div>
		</div>
		<div
			class="col-span-full flex flex-col gap-4 px-4 py-4 md:sticky md:top-4 md:col-span-2 md:self-start md:px-4"
		>
			{#if route.slug === 'contact-us'}
				<ContactInfo {siteSettings} />
			{:else}
				<ServiceCardsSidebar services={relatedServices} />
			{/if}
		</div>
	</div>
{/if}
