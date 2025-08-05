<!-- DesktopMenu.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import * as Menubar from '$lib/components/ui/menubar';
	import { ChevronDown } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/navigation/Logo.svelte';

	export let siteSettings: any;
	export let logoSrc: string;
	export let shrink: number = 0;

	function isPageActive(item: any, currentSlug: string) {
		if (item.path.startsWith('#')) {
			const globalSlug = item.path.split('#')[1];
			const globalData = siteSettings.expand.globals?.find(
				(global: any) => global.slug === globalSlug
			);
			return globalData?.expand.pages.some((page: any) => page.slug === currentSlug);
		} else {
			return currentSlug === (item.path.replace('/', '') || 'home');
		}
	}

	const currentSlug = derived(page, ($page) => $page.data?.route?.slug);

	// Split menu items into two groups
	const menuItems = siteSettings?.expand?.menu || [];
	const midpoint = Math.ceil(menuItems.length / 2);
	let leftMenuItems = menuItems.slice(0, midpoint);
	let rightMenuItems = menuItems.slice(midpoint);
</script>

<Menubar.Root
	class="hidden h-auto w-full justify-between gap-8 border-none bg-transparent px-8 tracking-wide lg:flex"
	role="navigation"
	aria-label="Main navigation"
>
	<Logo
		{siteSettings}
		{logoSrc}
		logoAlt="logo"
		hidden={false}
		ariaLabel="Go to home page"
		{shrink}
	/>
	<!-- Left menu items -->
	<div class="flex items-center" role="menubar">
		{#each menuItems as item}
			<Menubar.Menu>
				{#if item.path.startsWith('#')}
					{@const globalSlug = item.path.split('#')[1]}
					{@const globalData = siteSettings.expand.globals?.find(
						(global: any) => global.slug === globalSlug
					)}
					{@const isActive = isPageActive(item, $currentSlug)}
					<Menubar.Trigger
						class="m-0 p-0 text-white data-[highlighted]:bg-transparent data-[state=open]:bg-transparent data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground"
						role="menuitem"
					>
						<a
							href={item.path}
							class={`group relative mx-2 flex flex-row items-center gap-2 text-lg transition-colors ${
								isActive ? 'text-[#F25522]' : 'text-white hover:text-[#932631]'
							}`}
							aria-label={`Go to ${item.title} page`}
						>
							{item.title}
							<ChevronDown class="h-3 w-3" />
							<span
								class="absolute bottom-0 left-0 h-px w-1/2 max-w-16 bg-transparent transition-all group-hover:bg-[#932631]"
							></span>
						</a>
					</Menubar.Trigger>
					<Menubar.Content class="bg-secondary" role="menu">
						{#each globalData.expand.pages as page}
							{@const isPageActive = $currentSlug === page.slug}
							{@const title = page.shortTitle || page.title}
							<Menubar.Item class="mb-1 p-0">
								<Button
									on:click={() => goto(`/${page.slug}`)}
									variant="link"
									class={`group relative w-full justify-start rounded-none bg-primary text-lg text-white hover:bg-primary/90 hover:no-underline ${isPageActive ? 'text-white/50' : ''}`}
									aria-label={`Go to ${title} page`}
								>
									<span class="relative">
										{title}
										<span
											class="absolute bottom-0 left-0 h-px w-1/2 max-w-16 bg-transparent transition-all group-hover:bg-white"
										></span>
									</span>
								</Button>
							</Menubar.Item>
						{/each}
					</Menubar.Content>
				{:else}
					{@const isActive = isPageActive(item, $currentSlug)}
					<Menubar.Item>
						<a
							href={item.path}
							class={`group relative mx-2 text-lg transition-colors ${isActive ? 'text-[#F25522]' : 'text-white hover:text-[#932631]'}`}
							aria-label={`Go to ${item.title} page`}
						>
							{item.title}
							<span
								class="absolute bottom-0 left-0 h-px w-1/2 max-w-16 bg-transparent transition-all group-hover:bg-[#932631]"
							></span>
						</a>
					</Menubar.Item>
				{/if}
			</Menubar.Menu>
		{/each}
	</div>
</Menubar.Root>
