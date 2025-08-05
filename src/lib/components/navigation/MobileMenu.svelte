<!-- MobileMenu.svelte -->
<script lang="ts">
	import { page, navigating } from '$app/stores';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Menu, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { goto } from '$app/navigation';
	import { derived } from 'svelte/store';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import ContactInfo from '$lib/components/ContactInfo.svelte';

	export let siteSettings: any;
	export let logoSrc: string;

	let open = false;
	let collapsibleStates = {};

	$: if ($navigating) open = false;

	function isPageActive(item: any, currentSlug: string) {
		if (item.path.startsWith('#')) {
			const globalSlug = item.path.split('#')[1];
			const globalData = siteSettings.expand.globals?.find((global) => global.slug === globalSlug);
			return globalData?.expand.pages.some((page) => page.slug === currentSlug);
		} else {
			return currentSlug === (item.path.replace('/', '') || 'home');
		}
	}

	const currentSlug = derived(page, ($page) => $page.data?.route?.slug);

	$: menuItems = siteSettings?.expand?.menu.map((item: { path: string }) => ({
		...item,
		isActive: isPageActive(item, $currentSlug),
		globalData: item.path.startsWith('#')
			? siteSettings.expand.globals?.find(
					(global: { slug: string }) => global.slug === item.path.split('#')[1]
				)
			: null
	}));

	$: {
		menuItems.forEach((item: { path: string; isActive: any }) => {
			if (item.path.startsWith('#') && item.isActive) {
				collapsibleStates[item.path] = true;
			}
		});
	}
</script>

<div class="h-full lg:hidden">
	<Sheet.Root bind:open>
		<Sheet.Trigger asChild>
			<Button variant="link" on:click={() => (open = true)}>
				<Menu class="h-10 w-10 text-white" />
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="top" class="max-h-[100vh] w-full overflow-y-auto">
			<Sheet.Header>
				<Sheet.Title>
					<a href="/" class="mx-auto block w-[11rem] lg:w-[18rem]">
						<img src={logoSrc} alt={siteSettings.name} class="relative z-10 py-3" />
					</a>
				</Sheet.Title>
				<Sheet.Description
					class="mx-auto flex w-[18rem] flex-col items-center justify-center gap-1 py-1"
				>
					{#each menuItems as item}
						{#if item.path.startsWith('#')}
							<Collapsible.Root class="w-full" bind:open={collapsibleStates[item.path]}>
								<Collapsible.Trigger class="w-full">
									<Button
										class={`flex w-full items-center justify-center gap-1 rounded-none bg-primary uppercase text-white hover:bg-primary/90 ${
											item.isActive ? 'border-b-2 border-secondary' : ''
										}`}
									>
										{item.title}
										{#if collapsibleStates[item.path]}
											<ChevronUp class="h-3 w-3" />
										{:else}
											<ChevronDown class="h-3 w-3" />
										{/if}
									</Button>
								</Collapsible.Trigger>
								<Collapsible.Content class="bg-gray-100 py-2">
									{#each item.globalData.expand.pages as page}
										{@const isPageActive = page.slug === $currentSlug}
										<Button
											on:click={() => goto(`/${page.slug}`)}
											variant="ghost"
											class={`w-full justify-start rounded-none px-6 py-2 text-sm text-black hover:bg-gray-200 hover:text-black ${
												isPageActive ? 'border-l-4 border-secondary bg-gray-200 font-medium' : ''
											}`}
										>
											<span class="line-clamp-1 overflow-hidden text-ellipsis">
												{page.shortTitle || page.title}
											</span>
										</Button>
									{/each}
								</Collapsible.Content>
							</Collapsible.Root>
						{:else}
							<Button
								on:click={() => goto(`${item.path}`)}
								variant="ghost"
								class={`w-full rounded-none bg-primary uppercase text-white hover:bg-primary/90 hover:text-gray-300 ${
									item.isActive ? 'border-b-2 border-secondary bg-primary/80' : ''
								}`}
							>
								{item.title}
							</Button>
						{/if}
					{/each}
					<div class="w-full border-b-2 pb-2 pt-1" />
					{#each siteSettings.expand.socials as item}
						{@const iconSrc = `${PUBLIC_POCKETBASE_URL}/api/files/${item.collectionId}/${item.id}/${item?.icon}`}
						<Button
							href={item.path}
							target={item.newTab ? '_blank' : '_self'}
							variant="link"
							class="flex w-full items-center gap-2 rounded-none text-black hover:text-gray-300"
						>
							{#if item.title === 'Follow Us!'}
								<img src={iconSrc} class="h-6 w-4 brightness-0" alt={item.title} />
							{:else}
								<img src={iconSrc} class="h-4 w-4 brightness-0" alt={item.title} />
							{/if}
							{@html item.title}
						</Button>
					{/each}
				</Sheet.Description>
				<Sheet.Footer>
					<ContactInfo {siteSettings} />
				</Sheet.Footer>
			</Sheet.Header>
		</Sheet.Content>
	</Sheet.Root>
</div>
