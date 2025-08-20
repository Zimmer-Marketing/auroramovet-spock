<script lang="ts">
	import Breadcrumbs from '$lib/components/BreadCrumbs.svelte';
	import RouteMeta from '$lib/components/RouteMeta.svelte';
	import type { PageData } from './$types';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';
	import type { LayoutData } from '../$types';
	import TeamSection from '$lib/components/sections/TeamSection.svelte';
	import ServiceCardsSidebar from '$lib/components/ServiceCardsSidebar.svelte';
	import PbImage from '$lib/components/PbImage.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { route, teamMembers, relatedServices } = $derived(data);

	// Get siteSettings from parent layout
	const { siteSettings } = $derived(data as LayoutData);

	// Filter team members to exclude specific doctors
	const filteredTeamMembers = $derived(
		teamMembers.filter(
			(member) => !member.name.includes('Dr. Ryan Jones') && !member.name.includes('Dr. Bill Bader')
		)
	);
</script>

<RouteMeta {route} {siteSettings} />

<div
	class="relative left-1/2 mx-auto grid w-screen max-w-screen-3xl -translate-x-1/2 grid-cols-1 gap-4 px-2 md:px-0 lg:grid-cols-6"
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
			{#if route.expand?.globals && route.expand.globals.length > 0}
				{#each route.expand.globals as global}
					<div class="mb-8 px-4 md:mt-10 md:px-8">
						<div class="grid grid-cols-1 items-center gap-4 md:gap-6 xl:grid-cols-2">
							<!-- Left column: Title and Image -->
							<div class="flex flex-col items-start justify-start space-y-4 text-center">
								{#if global.title}
									<h2 class="text-2xl font-bold text-primary">{global.title}</h2>
								{/if}
								{#if global.images && global.images[0]}
									<div
										class="flex max-h-96 w-full items-center justify-center overflow-hidden rounded-lg md:w-96"
									>
										<PbImage
											record={global}
											photoName={global.images[0]}
											alt={global.title || 'Global content image'}
											width={600}
											height={250}
											cssClass="w-full h-full object-cover h-96"
										/>
									</div>
								{/if}
							</div>
							<!-- Right column: Content -->
							<div class="space-y-4">
								{#if global.content}
									<article class="prose max-w-none">
										{@html global.content}
									</article>
								{/if}
								<EditRecordButton record={global} />
							</div>
						</div>
					</div>
				{/each}
			{/if}
			<article class="min-h-[1px] max-w-prose px-4 md:px-8">
				{#if route.content}
					{@html route.content}
				{/if}
			</article>
			{#if filteredTeamMembers && filteredTeamMembers.length > 0}
				<div class="mt-8 px-4 md:px-8">
					<TeamSection
						teamMembers={filteredTeamMembers}
						className=""
						showTitle={false}
						showAboutButton={false}
					/>
				</div>
			{/if}
		</div>
	</div>
	<div
		class="col-span-full flex flex-col gap-4 px-4 py-4 md:sticky md:top-4 md:col-span-2 md:self-start md:px-4"
	>
		<ServiceCardsSidebar services={relatedServices} />
	</div>
</div>
