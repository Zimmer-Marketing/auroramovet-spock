<script lang="ts">
	import PageHero from './page-sections/PageHero.svelte';
	import ContentSection from './page-sections/ContentSection.svelte';
	import ContactFormSection from './page-sections/ContactFormSection.svelte';
	import { cn } from '$lib/utils';
	import { getPbRecordImageURL } from '$lib/helpers/pbHelpers';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';

	interface ContentBlock {
		id?: string;
		title: string;
		content: string;
		image?: string;
		imagePosition?: 'left' | 'right';
		backgroundColor?: 'light' | 'dark';
		buttonText?: string;
		buttonLink?: string;
		sortOrder?: number;
	}

	interface Props {
		route: any;
		showContactForm?: boolean;
		className?: string;
	}

	let { route, showContactForm = true, className = '' }: Props = $props();

	// Get content blocks from route.expand.globals
	const blocksToRender = route?.expand?.globals || [];

	// Generate hero image URL
	const heroImageUrl = $derived(() => {
		if (route?.heroImage) return route.heroImage;
		if (route?.images?.[0]) return getPbRecordImageURL(route, 0, '1920x0');
		return '';
	});
</script>

<div class={cn('min-h-screen bg-white', className)}>
	<!-- Hero Section -->
	<PageHero
		title={route?.title || 'Page Title'}
		subtitle={route?.subtitle || ''}
		content={route?.content || ''}
		backgroundImage={heroImageUrl()}
		record={route}
	/>

	<!-- Content Sections -->
	{#each blocksToRender as global, index}
		<ContentSection
			title={global.title}
			content={global.content}
			image={global.images?.[0] || ''}
			imagePosition={global.imagePosition}
			backgroundColor={global.backgroundColor}
			buttonText={global.buttonText}
			buttonLink={global.buttonLink}
			record={global}
		/>
	{/each}

	<!-- Contact Form Section -->
	{#if showContactForm}
		<ContactFormSection />
	{/if}
</div>
