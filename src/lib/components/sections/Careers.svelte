<script lang="ts">
	import RouteMeta from '$lib/components/RouteMeta.svelte';
	import type { PageData } from './$types';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
	import JobsForm from '$lib/components/JobsForm.svelte';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';
	import PbImage from '$lib/components/PbImage.svelte';
	import * as Carousel from '$lib/components/ui/carousel';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getPbRecordImageURL } from '$lib/helpers/pbHelpers';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { route, jobs, siteSettings } = $derived(data);

	let isOpen = $state(false);
</script>

<RouteMeta {route} {siteSettings} />

<div
	class="relative mx-auto min-h-screen w-full max-w-screen-3xl bg-[url('/wood-grain.svg')] bg-cover bg-repeat"
>
	<EditRecordButton record={route} />
	<div class="mx-auto max-w-screen-3xl px-4 py-16">
		{#if jobs.length === 0}
			<!-- Header Section -->
			<div class="my-12 text-center">
				<h1 class="mb-4 text-5xl font-bold text-primary drop-shadow-lg">{route.title}</h1>
				<article class="mx-auto text-xl text-primary drop-shadow">
					{@html route.content}
				</article>

				<!-- Images Section -->
				{#if route.images && route.images.length === 1}
					{@const imgSrc = getPbRecordImageURL(route, 0, '800x600')}
					{@const imgSrcZoom = getPbRecordImageURL(route, 0, '1920x0')}
					<div class="mt-8">
						<button
							onclick={() => (isOpen = true)}
							class="group relative h-96 w-full cursor-zoom-in overflow-hidden rounded-lg"
						>
							<img
								src={imgSrc}
								alt={route.title}
								class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
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
				{:else if route.images && route.images.length > 1}
					<div class="mt-8">
						<Carousel.Root class="mx-auto w-full max-w-xl">
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
			</div>

			<div class="mx-auto max-w-2xl">
				<div
					class="rounded-xl border border-gray-200 bg-white/95 p-12 text-center shadow-xl backdrop-blur-sm"
				>
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
					>
						<svg
							class="h-8 w-8 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
							></path>
						</svg>
					</div>
					<h2 class="mb-4 text-3xl font-bold text-gray-900">No Active Job Openings</h2>
					<p class="text-lg leading-relaxed text-gray-600">
						We don't have any open positions at the moment, but we're always growing! Check back
						soon or reach out to us directly.
					</p>
				</div>
			</div>
		{:else}
			<!-- Desktop Layout: Two Column -->
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
				<!-- Left Column: Text Content -->
				<div class="flex flex-col justify-start">
					<div class="sticky top-8">
						<h1 class="mb-6 text-5xl font-bold text-primary drop-shadow-lg">{route.title}</h1>
						<article
							class="prose prose-lg prose-invert max-w-none text-xl text-primary drop-shadow"
						>
							{@html route.content}
						</article>

						<!-- Images Section -->
						{#if route.images && route.images.length === 1}
							{@const imgSrc = getPbRecordImageURL(route, 0, '800x600')}
							{@const imgSrcZoom = getPbRecordImageURL(route, 0, '1920x0')}
							<div class="mt-8">
								<button
									onclick={() => (isOpen = true)}
									class="group relative h-96 w-full cursor-zoom-in overflow-hidden rounded-lg"
								>
									<img
										src={imgSrc}
										alt={route.title}
										class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
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
						{:else if route.images && route.images.length > 1}
							<div class="mt-8">
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
					</div>
				</div>

				<!-- Right Column: Jobs Accordion -->
				<div class="flex flex-col">
					<div
						class="overflow-hidden rounded-xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur-sm"
					>
						<div class="p-8">
							<h2 class="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
									<svg
										class="h-5 w-5 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
										></path>
									</svg>
								</div>
								Open Positions
							</h2>

							<Accordion class="space-y-4">
								{#each jobs as job (job.id)}
									<AccordionItem
										value={job.id}
										class="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
									>
										<EditRecordButton record={job} />
										<AccordionTrigger
											class="group flex items-center justify-between border-b border-gray-100 px-6 py-4 text-left text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-50"
										>
											<span class="flex items-center gap-3">
												<div class="h-3 w-3 flex-shrink-0 rounded-full bg-green-500"></div>
												{job.title}
											</span>
										</AccordionTrigger>
										<AccordionContent class="bg-gray-50/50 px-6 py-6">
											<div
												class="prose prose-gray prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 mb-6 max-w-none"
											>
												{@html job.description}
											</div>
											<div>
												<JobsForm jobTitle={job.title} />
											</div>
										</AccordionContent>
									</AccordionItem>
								{/each}
							</Accordion>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
