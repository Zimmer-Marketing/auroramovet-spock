<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import { MetaTags } from 'svelte-meta-tags';

	/**
	 * 🎭 RouteMeta - The Meta Tag Magician! 🎭
	 *
	 * This component is like a Swiss Army knife for meta tags! It handles two main scenarios:
	 * 1. 📄 Regular pages (like /about, /contact) - the classics
	 * 2. 🗂️ Collection records (like /gallery/123/cool-closet) - the fancy new stuff
	 *
	 * Think of it as your SEO sidekick that automatically generates all the boring
	 * but super important meta tags that make Google and social media happy! 🚀
	 */
	interface Props {
		route?: any; // 📄 For regular pages - the old faithful
		siteSettings: any; // ⚙️ Global site config - the source of truth
		// 🆕 New props for collection records (the cool kids):
		record?: any; // 🗂️ The actual record (property, post, product, etc.)
		parentPage?: any; // 👨‍👩‍👧‍👦 The parent page that "owns" this record
		recordType?: string; // 🏷️ What kind of record is this? (e.g., 'property', 'post')
		customSlug?: string; // 🛤️ Override auto-generated slug if needed
	}

	let { route, siteSettings, record, parentPage, recordType, customSlug }: Props = $props();

	// 🕵️ Detective work: Are we dealing with a collection record or a regular page?
	const isCollectionRecord = record && parentPage;

	// 🎯 Smart data selection: Use the record if it's a collection, otherwise fall back to route
	const pageData = isCollectionRecord ? record : route;
	const parentData = parentPage;

	// 🏠 Home base - our site's name for building titles
	let siteName = siteSettings?.meta?.siteTitle || '';

	// 📊 State management for our meta data trio
	let title = $state('');
	let description = $state('');
	let canonicalUrl = $state('');

	// 🎨 Title Generation Factory - Building beautiful, hierarchical titles!
	if (isCollectionRecord) {
		// 🗂️ Collection record titles: "Record Title | Parent Page | Site Name"
		// Example: "Modern Master Closet | Gallery | Affordable Closets"
		title =
			pageData?.seoTitle ||
			`${pageData?.title || 'Item'} | ${parentData?.title || recordType || 'Collection'} | ${siteName}`;

		// 📝 Description generation - because content is king!
		description =
			pageData?.seoDescription ||
			pageData?.description ||
			`View details about ${pageData?.title} ${recordType || 'item'} by ${siteName}.`;
	} else {
		// 📄 Regular page titles - the classic approach
		if (route?.slug === 'home') {
			// 🏠 Home page gets special treatment: "Site Name | Tagline"
			title = route.seoTitle || `${siteName} | ${siteSettings?.meta?.tagline}`;
		} else {
			// 📄 Other pages: "Page Title | Site Name"
			title = route?.seoTitle || `${route?.title || 'Page'} | ${siteName}`;
		}
		description = route?.seoDescription || siteSettings?.meta?.tagline || '';
	}

	// 🌐 Canonical URL Builder - The GPS for search engines!
	if (isCollectionRecord && pageData?.id) {
		// 🗂️ Collection records get fancy URLs: /parentSlug/recordId/recordSlug/
		// Example: /gallery/rec_123456/modern-master-closet/
		const slug = customSlug || generateSlug(pageData.title);
		const parentSlug = parentData?.slug || '';
		canonicalUrl = `${siteSettings?.meta?.siteUrl || ''}/${parentSlug}/${pageData.id}/${slug}/`;
	} else if (route?.slug) {
		// 📄 Regular pages get simple URLs
		canonicalUrl =
			route.slug === 'home'
				? `${siteSettings?.meta?.siteUrl || ''}/` // Home is just the domain
				: `${siteSettings?.meta?.siteUrl || ''}/${route.slug}/`; // Others get their slug
	}

	// 🖼️ Image handling - Because a picture is worth a thousand words (and clicks!)
	let images: { url: string; width: number; height: number; alt?: string }[] = $state([]);

	// 🎨 Image Selection Algorithm - The art of choosing the perfect thumbnail
	if (isCollectionRecord) {
		// 🗂️ For collection records, we're like image detectives looking for clues
		// Priority: cover > seoImage > image (we try the best options first!)
		const imageField = pageData?.cover || pageData?.seoImage || pageData?.image;
		if (imageField && pageData?.collectionId && pageData?.id) {
			try {
				images = [
					{
						url: `${PUBLIC_POCKETBASE_URL}/api/files/${pageData.collectionId}/${pageData.id}/${imageField}?thumb=1200x630`,
						width: 1200,
						height: 630,
						alt: `${pageData?.title || 'Image'} by ${siteName}`
					}
				];
			} catch (e) {
				console.error('🚨 Image URL creation failed for collection record:', e);
			}
		}
	} else {
		// 📄 Regular pages - simpler times, simpler image logic
		if (route?.seoImage) {
			try {
				images = [
					{
						url: `${PUBLIC_POCKETBASE_URL}/api/files/${route.collectionId}/${route.id}/${route.seoImage}?thumb=1200x630`,
						width: 1200,
						height: 630
					}
				];
			} catch (e) {
				console.error('🚨 Image URL creation failed for route seoImage:', e);
			}
		}
	}

	// 🎭 Fallback image - When all else fails, we have a backup plan!
	if (images.length === 0 && siteSettings?.defaultSeoImage) {
		try {
			images = [
				{
					url: `${PUBLIC_POCKETBASE_URL}/api/files/${siteSettings.collectionId}/${siteSettings.id}/${siteSettings.defaultSeoImage}?thumb=1200x630`,
					width: 1200,
					height: 630
				}
			];
		} catch (e) {
			console.error('🚨 Even the fallback image failed! Time to panic... or not:', e);
		}
	}

	// 🛠️ Admin Edit Link Generator - The secret developer superpower!
	let editLink = '';
	const editRecord = isCollectionRecord ? pageData : route;
	if (editRecord?.collectionId && editRecord?.id) {
		// 🔗 Creates a direct link to edit this record in PocketBase admin
		editLink = `${PUBLIC_POCKETBASE_URL}/_/#/collections?collection=${editRecord.collectionId}&filter=&sort=-@rowid&recordId=${editRecord.id}`;
	}

	/**
	 * 🏭 Slug Factory - Turning titles into URL-friendly strings!
	 *
	 * This little function takes messy titles like "My "Amazing" Project!"
	 * and turns them into clean URLs like "my-amazing-project"
	 *
	 * It's like a URL bouncer - only the good characters get in! 💪
	 */
	function generateSlug(title: string): string {
		if (!title) return '';
		return title
			.toLowerCase()
			.replace(/%22/g, '') // Bye bye encoded quotes
			.replace(/"/g, '') // Regular quotes gotta go too
			.replace(/ /g, '-'); // Spaces become dashes (URL style!)
	}

	/**
	 * 🎹 Keyboard Shortcut Handler - The developer's secret weapon!
	 *
	 * Press Alt + Shift + E to instantly open the edit page for this record.
	 * It's like having admin superpowers at your fingertips! ⚡
	 *
	 * Perfect for when you're browsing your site and think "hmm, this needs editing"
	 */
	function shortcut(event: any) {
		if (!editLink) return; // No edit link? No problem, just ignore it

		// 🎯 The magic combo: Alt + Shift + E (69 is the keycode for 'E')
		if (event.altKey && event.shiftKey && event.keyCode == 69) {
			event.preventDefault(); // Stop the browser from doing anything weird
			window.open(editLink, '_blank', 'noopener,noreferrer'); // Open in new tab like a pro
		}
	}
</script>

<!-- 👂 Global event listener - Always listening for that sweet keyboard shortcut -->
<svelte:window onkeydown={shortcut} />

<!-- 
🎭 The Grand Performance - Where all our meta tags come to life!

This is where the magic happens. All the data we've carefully prepared above
gets turned into actual HTML meta tags that search engines and social media
platforms will feast upon like it's a five-star meal! 🍽️
-->
<svelte:head>
	<!-- 📑 The basics - title and description are the bread and butter -->
	<title>{title}</title>
	<meta name="description" content={description} />

	<!-- 🌐 Canonical URL - tells search engines "this is the ONE true URL" -->
	{#if canonicalUrl}
		<link rel="canonical" href={canonicalUrl} />
	{/if}

	<!-- 📱 Open Graph tags - Making our links look pretty on social media -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	{#if canonicalUrl}
		<meta property="og:url" content={canonicalUrl} />
	{/if}

	<!-- 🖼️ Social media images - Because visual content rules the internet -->
	{#if images.length > 0}
		<meta property="og:image" content={images[0].url} />
		{#if images[0].alt}
			<meta property="og:image:alt" content={images[0].alt} />
		{/if}
	{/if}

	<!-- 🐦 Twitter Card tags - Special treatment for the bird app -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if images.length > 0}
		<meta name="twitter:image" content={images[0].url} />
	{/if}
</svelte:head>

<!-- 
🎪 The svelte-meta-tags component - Our backup dancer
This provides additional structured data that some tools prefer.
Think of it as double insurance for our SEO! 🛡️
-->
<MetaTags
	{title}
	{description}
	openGraph={{
		title,
		description,
		siteName,
		type: 'website',
		url: canonicalUrl,
		images
	}}
/>
