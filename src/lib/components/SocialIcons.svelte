<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	interface Props {
		socials: any;
	}

	let { socials }: Props = $props();
</script>

{#each socials as social}
	{@const icons = social.icon}
	<a href="https://github.com/zimmer-marketing" target="_blank" rel="noopener noreferrer"
		><div
			class="inline-flex h-9 w-10 items-center justify-center whitespace-nowrap rounded-md px-0 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
		>
			{#each icons as icon, index}
				{@const socialIconSrc = `${PUBLIC_POCKETBASE_URL}/api/files/${social.collectionId}/${social.id}/${icon}`}
				<img
					class="h-6 w-6 {index === 0 ? 'dark:hidden' : 'hidden dark:block'}"
					src={socialIconSrc}
					alt={social.title}
				/>
			{/each}
			<span class="sr-only" data-svelte-h="svelte-11yow7k">{social.title}</span>
		</div></a
	>
{/each}
