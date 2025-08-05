<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from './ui/input/input.svelte';
	import { Check, Search as SearchIcon, RotateCcw } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { createTopicStore } from '$lib/helpers/topicStore';

	export const topic = createTopicStore('');

	export let postsData: object;
	export let topicsData: { slug: string; title: string }[];

	let searchQuery = '';
	$: topicQuery = '';

	let open = false;
	let value = '';

	$: currentTopic = $page.url.searchParams.get('topic') || '';

	$: findTopic = (f) => {
		if (currentTopic !== '') {
			value = currentTopic;
			return f?.title || 'Search by topic...';
		} else return 'Search by topic...';
	};

	// This is to handle the state of the topic in the combo box due to how it's being found/set
	let initLoad = true;

	$: selectedValue =
		currentTopic && initLoad
			? findTopic(topicsData.find((f) => f.slug === currentTopic))
			: topicsData
				? (topicsData.find((f) => f.slug === value)?.title ?? 'Search by topic...')
				: 'Search by topic...';
	// topicsData ? topicsData.find((f) => f.slug === value)?.title ?? "Search by topic..." : "Search by topic...";
	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		initLoad = false;
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	// Add this function to handle topic selection
	function handleTopicSelect(currentValue: string) {
		if (value === currentValue) {
			// Deselect the topic
			value = '';
			topicQuery = '';
			initLoad = false;
		} else {
			// Select the new topic
			value = currentValue;
			topicQuery = currentValue;
			initLoad = false;
		}
	}

	$: searchParams =
		topicQuery === ''
			? '/posts?search=' + searchQuery + '&page=1'
			: '/posts?search=' + searchQuery + '&topic=' + topicQuery + '&page=1';
	$: currentSearch = $page.url.searchParams.get('search') || '';

	function resetForm() {
		searchQuery = '';
		value = '';
		topicQuery = '';
		initLoad = false;
	}

	async function updateOrderStatus(orderId: string, statusUpdate: any) {
		const order = await locals.pb.collection('orders').update(orderId, {
			...statusUpdate,
			updated: new Date().toISOString()
		});

		// Send status email
		await sendOrderUpdateEmail(order.email, {
			status: order.status,
			payment_status: order.payment_status,
			access_token: order.access_token,
			order_id: order.id
		});
	}
</script>

<div class="float-right flex flex-col items-end">
	<Popover.Root bind:open let:ids>
		<Popover.Trigger asChild let:builder>
			<Button builders={[builder]} variant="ghost" size="icon">
				<SearchIcon class="h-5 w-5" />
				<span class="sr-only">Search</span>
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[400px] p-4">
			<div class="space-y-4">
				<div class="flex items-center space-x-2">
					<Input
						placeholder="Search"
						on:keydown={(e) => {
							if (e.key === 'Enter') {
								goto(searchParams);
								open = false;
							}
						}}
						bind:value={searchQuery}
						class="max-w-36 md:max-w-none"
					/>
					<Button
						class="w-fit min-w-0 md:w-fit md:min-w-0 md:px-12 md:py-4"
						on:click={() => {
							goto(searchParams);
							open = false;
						}}>Search</Button
					>
					<Button variant="ghost" size="icon" on:click={resetForm} title="Reset search">
						<RotateCcw class="h-4 w-4" />
						<span class="sr-only">Reset search form</span>
					</Button>
				</div>
				<Command.Root class="max-w-72 rounded-lg border shadow-md md:max-w-none">
					<Command.Input placeholder="Search topic..." />
					<Command.Empty>No topic found.</Command.Empty>
					<Command.Group>
						{#each topicsData as topic}
							<Command.Item value={topic.slug} onSelect={handleTopicSelect}>
								<Check
									class={cn('mr-2 h-4 w-4', value === topic.slug ? 'opacity-100' : 'opacity-0')}
								/>
								{topic.title}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.Root>
			</div>
		</Popover.Content>
	</Popover.Root>

	<!-- Search results -->
	{#if currentSearch}
		<div class="pt-4">
			{#if postsData.items.length > 0}
				<h2 class="text-base tracking-tight">
					Search results for "<span class="text-red-400">{currentSearch}</span>"
				</h2>
			{:else}
				<h2 class="text-base tracking-tight">
					No results found for "<span class="text-red-400">{currentSearch}</span>"
				</h2>
			{/if}
		</div>
	{/if}
</div>
