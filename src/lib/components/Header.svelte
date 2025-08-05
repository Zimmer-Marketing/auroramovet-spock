<script lang="ts">
	import { run } from 'svelte/legacy';

	import PbImage from '$lib/components/PbImage.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Navbar from '$lib/components/Navbar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { toggleMode } from 'mode-watcher';
	import SocialIcons from './SocialIcons.svelte';
	import { navigating } from '$app/stores';
	import ContactInfo from '$lib/components/ContactInfo.svelte';
	interface Props {
		siteSettings: any;
		[key: string]: any
	}

	let { ...props }: Props = $props();

	let open = $state(false);

	run(() => {
		if ($navigating) open = false;
	});
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex max-w-screen-2xl items-center px-5 pt-1">
		<div class="mr-4 hidden md:flex">
			{#if props.siteSettings?.images?.[0]}
				<a href="/" class="mr-6 flex items-center space-x-2">
					<PbImage
						record={props.siteSettings}
						photoName={props.siteSettings.images[0]}
						photoNameDark={props.siteSettings.images[1]}
						alt={props.siteSettings.meta.siteTitle}
						height={256}
						width={256}
						cssClass="-mb-10"
					/>
				</a>
			{/if}
		</div>
		<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
			<div class="md:hidden">
				<Sheet.Root bind:open>
					<Sheet.Trigger
						><svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							viewBox="0 0 24 24"
							{...props}
							><path
								fill="currentColor"
								d="M4 18q-.425 0-.712-.288T3 17q0-.425.288-.712T4 16h16q.425 0 .713.288T21 17q0 .425-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12q0-.425.288-.712T4 11h16q.425 0 .713.288T21 12q0 .425-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7q0-.425.288-.712T4 6h16q.425 0 .713.288T21 7q0 .425-.288.713T20 8z"
							/></svg
						></Sheet.Trigger
					>
					<Sheet.Content side="bottom">
						<Sheet.Header>
							<Sheet.Title
								><PbImage
									record={props.siteSettings}
									photoName={props.siteSettings.images[0]}
									photoNameDark={props.siteSettings.images[1]}
									alt={props.siteSettings.meta.siteTitle}
									height={256}
									width={256}
								/></Sheet.Title
							>
							<Sheet.Description>
								<Navbar {props.siteSettings} />
								<div class="pl-2">
									<ContactInfo {props.siteSettings} />
								</div>
							</Sheet.Description>
						</Sheet.Header>
					</Sheet.Content>
				</Sheet.Root>
			</div>
			<a href="/" class="px-8 md:hidden">
				<PbImage
					record={props.siteSettings}
					photoName={props.siteSettings.images[0]}
					photoNameDark={props.siteSettings.images[1]}
					alt={props.siteSettings.meta.siteTitle}
					height={256}
					width={256}
				/>
			</a>
			<nav class="flex items-center">
				<div class="hidden md:block">
					{#if props.siteSettings?.expand?.socials}
						{@const socials = props.siteSettings?.expand?.socials}
						<SocialIcons {socials} />
					{/if}
				</div>

				<Button on:click={toggleMode} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</nav>
		</div>
	</div>
</header>
