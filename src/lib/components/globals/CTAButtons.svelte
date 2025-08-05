<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';
	export let post;
	export let siteSettings;

	$: isGlobalsArray = Array.isArray(post.expand?.globals);

	$: ctaGlobals = isGlobalsArray
		? post.expand.globals.filter((global) => {
				console.log('Checking global:', global);
				console.log('Global slug:', global?.slug);
				return global?.slug?.toLowerCase().startsWith('cta-');
			})
		: [];

	$: if (ctaGlobals?.length == 0) {
		ctaGlobals = siteSettings.expand.globals.filter((global) => {
			return global?.slug?.toLowerCase().startsWith('cta-');
		});
	}

	function isExternalLink(slug) {
		return (
			slug && (slug.startsWith('http://') || slug.startsWith('https://') || slug.startsWith('www.'))
		);
	}

	$: console.log(ctaGlobals);
</script>

<div class="my-8 mt-12 flex flex-col gap-6">
	{#each ctaGlobals as cta}
		<div
			class="cta-container rounded-lg bg-gradient-to-b from-primary to-secondary px-4 py-6 text-center"
		>
			{#if cta.title || cta.name}
				<h3
					class="mx-auto mb-2 scroll-m-20 pt-2 text-center font-semibold tracking-normal text-white"
				>
					{cta.title || cta.name}
				</h3>
			{/if}

			{#if cta.content}
				<div class="mx-auto mb-4 text-center text-white/90">
					{@html cta.content}
				</div>
			{/if}

			{#if cta.slug && (cta.meta?.primaryButton || cta.meta?.secondaryButton)}
				<div class="mt-4 flex w-full flex-row justify-center gap-4">
					{#if cta.meta?.primaryButton}
						<Button
							size="lg"
							href={cta.meta?.primaryButton?.link}
							target={isExternalLink(cta.meta?.primaryButton?.link) ? '_blank' : ''}
							class=""
						>
							<span class="flex items-center justify-center gap-2">
								{cta.meta?.primaryButton?.text}
								{#if isExternalLink(cta.meta?.primaryButton?.link)}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-external-link"
										><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline
											points="15 3 21 3 21 9"
										/><line x1="10" x2="21" y1="14" y2="3" /></svg
									>
								{/if}
							</span>
						</Button>
					{/if}

					{#if cta.meta?.secondaryButton}
						<Button
							variant="secondary"
							size="lg"
							href={cta.meta?.secondaryButton?.link}
							target={isExternalLink(cta.meta?.secondaryButton?.link) ? '_blank' : ''}
							class=""
						>
							<span class="flex items-center justify-center gap-2">
								{cta.meta?.secondaryButton?.text}
								{#if isExternalLink(cta.meta?.secondaryButton?.link)}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-external-link"
										><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline
											points="15 3 21 3 21 9"
										/><line x1="10" x2="21" y1="14" y2="3" /></svg
									>
								{/if}
							</span>
						</Button>
					{/if}
				</div>
			{/if}
		</div>
		<EditRecordButton record={cta} />
	{/each}
</div>
