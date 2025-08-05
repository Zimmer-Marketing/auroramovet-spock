<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	interface Record {
		id: string;
		collectionId: string;
		title: string;
	}

	interface Props {
		record: Record;
		photoName: string;
		alt: string;
		photoNameDark?: string;
		height?: number;
		width?: number;
		cssClass?: string;
	}

	let {
		record,
		photoName,
		alt,
		photoNameDark = '',
		height = 0,
		width = 0,
		cssClass = ''
	}: Props = $props();

	let recordId = $derived(record.id);
	let collectionId = $derived(record.collectionId);
	let src = $derived(`${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${photoName}?thumb=${width}x${height}`);
	let srcDark = $derived(`${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${photoNameDark}?thumb=${width}x${height}`);
</script>

{#if photoNameDark}
	<img {src} {width} {height} {alt} loading="lazy" class={cssClass + ' dark:hidden'} />
	<img src={srcDark} {width} {height} {alt} loading="lazy" class={cssClass + ' hidden dark:block'} />
{:else}
	<img {src} {width} {height} {alt} loading="lazy" class={cssClass} />
{/if}
