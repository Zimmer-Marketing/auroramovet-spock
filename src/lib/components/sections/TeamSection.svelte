<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import { onMount, onDestroy } from 'svelte';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';

	interface TeamMember {
		id: string;
		name: string;
		title: string;
		image?: string;
		collectionId?: string;
	}

	interface Props {
		teamMembers?: TeamMember[];
		className?: string;
		showTitle?: boolean;
		showAboutButton?: boolean;
	}

	let {
		teamMembers = [],
		className = '',
		showTitle = true,
		showAboutButton = true
	}: Props = $props();

	// Mobile carousel state
	let currentIndex = $state(0);
	let autoPlayInterval: ReturnType<typeof setInterval> | undefined;

	// Navigation functions for mobile carousel
	const nextMember = () => {
		currentIndex = (currentIndex + 1) % teamMembers.length;
		resetAutoPlay();
	};

	const prevMember = () => {
		currentIndex = (currentIndex - 1 + teamMembers.length) % teamMembers.length;
		resetAutoPlay();
	};

	const goToMember = (index: number) => {
		currentIndex = index;
		resetAutoPlay();
	};

	// Auto-play functionality for mobile
	const startAutoPlay = () => {
		if (teamMembers.length > 1) {
			autoPlayInterval = setInterval(() => {
				nextMember();
			}, 4000);
		}
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
		startAutoPlay();
	});

	onDestroy(() => {
		stopAutoPlay();
	});

	// Calculate complete rows and remaining members for desktop grid
	const columnsPerRow = 3;
	const completeRowsCount = $derived(Math.floor(teamMembers.length / columnsPerRow));
	const completeRowsMembers = $derived(teamMembers.slice(0, completeRowsCount * columnsPerRow));
	const remainingMembers = $derived(teamMembers.slice(completeRowsCount * columnsPerRow));
</script>

<section class="relative z-10 bg-primary py-16 text-primary-foreground {className}">
	<div class="container mx-auto px-6">
		{#if showTitle}
			<h2 class="mb-12 px-14 text-center text-2xl font-bold md:text-4xl">
				Meet the Aurora Animal Clinic Team
			</h2>
		{/if}

		<!-- Desktop Grid Layout (hidden on mobile) -->
		<div class="mx-auto hidden max-w-6xl md:block">
			<!-- Complete rows in grid -->
			{#if completeRowsMembers.length > 0}
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each completeRowsMembers as member}
						<div
							class="relative mx-auto w-full max-w-[400px] overflow-hidden rounded-t-md bg-white shadow-md transition-all hover:shadow-xl"
						>
							<EditRecordButton record={member} />
							<!-- Staff Image - no bottom rounding -->
							<div class="relative h-[362px] w-full overflow-hidden rounded-t-md">
								{#if member.image && member.id}
									<img
										src={`${PUBLIC_POCKETBASE_URL}/api/files/staff/${member.id}/${member.image}?thumb=600x724`}
										alt={member.name}
										class="h-full w-full rounded-none object-cover transition-transform hover:scale-105"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center bg-muted">
										<span class="text-6xl text-muted-foreground">{member.name.charAt(0)}</span>
									</div>
								{/if}
							</div>

							<!-- Staff Info Footer - matching Figma design -->
							<div class="relative flex flex-col items-start bg-white p-5">
								<!-- Title positioned on the left -->
								<div class="">
									<p class="text-2xl font-normal leading-[35px] text-primary">
										{member.title}
									</p>
								</div>

								<!-- Name centered in the card -->
								<div class="flex w-full justify-start">
									<h3 class="text-2xl font-bold leading-[65px] text-primary">
										{member.name}
									</h3>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Remaining members centered -->
			{#if remainingMembers.length > 0}
				<div class="mt-6 flex justify-center gap-6">
					{#each remainingMembers as member}
						<div
							class="relative w-full max-w-[400px] overflow-hidden rounded-t-md bg-white shadow-md transition-all hover:shadow-xl"
						>
							<EditRecordButton record={member} />
							<!-- Staff Image - no bottom rounding -->
							<div class="relative h-[362px] w-full overflow-hidden rounded-t-md">
								{#if member.image && member.id}
									<img
										src={`${PUBLIC_POCKETBASE_URL}/api/files/staff/${member.id}/${member.image}?thumb=600x724`}
										alt={member.name}
										class="h-full w-full rounded-none object-cover transition-transform hover:scale-105"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center bg-muted">
										<span class="text-6xl text-muted-foreground">{member.name.charAt(0)}</span>
									</div>
								{/if}
							</div>

							<!-- Staff Info Footer - matching Figma design -->
							<div class="relative flex flex-col items-start bg-white p-5">
								<!-- Title positioned on the left -->
								<div class="">
									<p class="text-2xl font-normal leading-[35px] text-primary">
										{member.title}
									</p>
								</div>

								<!-- Name centered in the card -->
								<div class="flex w-full justify-start">
									<h3 class="text-2xl font-bold leading-[65px] text-primary">
										{member.name}
									</h3>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Mobile Carousel Layout (visible on mobile only) -->
		<div class="relative mx-auto w-full overflow-hidden md:hidden">
			{#if teamMembers.length > 0}
				{@const member = teamMembers[currentIndex]}
				<!-- Single card display -->
				<div class="px-6">
					<div class="mx-auto max-w-[280px]">
						<div class="relative overflow-hidden rounded-[10px] bg-white shadow-md transition-all">
							<EditRecordButton record={member} />
							<!-- Staff Image -->
							<div class="relative h-[281px] w-full overflow-hidden rounded-t-[10px]">
								{#if member.image && member.id}
									<img
										src={`${PUBLIC_POCKETBASE_URL}/api/files/staff/${member.id}/${member.image}?thumb=600x724`}
										alt={member.name}
										class="h-full w-full rounded-none object-cover"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center bg-muted">
										<span class="text-6xl text-muted-foreground">{member.name.charAt(0)}</span>
									</div>
								{/if}
							</div>

							<!-- Staff Info Footer -->
							<div class="flex h-[71px] flex-col items-start bg-white p-5">
								<p class="text-sm font-normal text-primary md:leading-[35px]">
									{member.title}
								</p>
								<h3 class="text-sm font-bold text-primary md:leading-[65px]">
									{member.name}
								</h3>
							</div>
						</div>
					</div>
				</div>

				<!-- Progress Bar -->
				{#if teamMembers.length > 1}
					<div class="mt-4 flex justify-center">
						<div class="relative h-2 w-[149px] overflow-hidden rounded-[20px] bg-[#bebebe]">
							<!-- Active progress -->
							<div
								class="absolute left-0 top-0 h-full rounded-[20px] bg-white transition-all duration-300 ease-in-out"
								style="width: {((currentIndex + 1) / teamMembers.length) * 100}%"
							></div>

							<!-- Clickable segments -->
							{#each teamMembers as _, index}
								<button
									onclick={() => goToMember(index)}
									class="absolute top-0 h-full bg-transparent transition-colors hover:bg-white/20"
									style="left: {(index / teamMembers.length) * 100}%; width: {100 /
										teamMembers.length}%"
									aria-label={`Go to team member ${index + 1}`}
								></button>
							{/each}
						</div>
					</div>
				{/if}
			{/if}
		</div>

		{#if showAboutButton}
			<div class="mt-12 text-center">
				<Button
					href="/about"
					class="rounded-[50px] bg-white px-12 py-4 text-[24px] font-bold text-[#2b482d] transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/50"
				>
					About Us
				</Button>
			</div>
		{/if}
	</div>
</section>
