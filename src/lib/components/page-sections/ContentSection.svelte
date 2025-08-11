<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import PbImage from '$lib/components/PbImage.svelte';

	interface Props {
		title: string;
		content: string;
		image?: string;
		imagePosition?: 'left' | 'right';
		backgroundColor?: 'light' | 'dark';
		buttonText?: string;
		buttonLink?: string;
		className?: string;
		record?: any; // PocketBase record for image access
	}

	let {
		title,
		content,
		image = '',
		imagePosition = 'right',
		backgroundColor = 'light',
		buttonText = '',
		buttonLink = '',
		className = '',
		record = null
	}: Props = $props();

	const isDark = backgroundColor === 'dark';
	const textColor = isDark ? 'text-white' : 'text-[#2b482d]';
	const bgColor = isDark ? 'bg-[#2b482d]' : 'bg-white';

	// Debug logging
	$effect(() => {
		if (image && record) {
			const imageIndex = parseInt(image);
			console.log('ContentSection debug:', {
				image,
				imageIndex,
				record,
				images: record?.images,
				imageName: record?.images?.[imageIndex],
				hasImages: !!record?.images,
				imageType: typeof image
			});
		}
	});
</script>

<section class={cn('py-16', bgColor, className)}>
	<div class="mx-auto w-full max-w-[1920px]">
		<div class="grid items-center gap-0 lg:grid-cols-2">
			<!-- Content -->
			<div class={cn('px-12 py-8 lg:px-2 lg:py-12', imagePosition === 'left' ? 'lg:order-2' : '')}>
				<h2 class={cn('mb-6 text-3xl font-bold md:text-5xl', textColor)}>
					{title}
				</h2>

				<div
					class={cn('prose prose-lg max-w-none text-base leading-relaxed md:text-lg', textColor)}
				>
					{@html content}
				</div>

				{#if buttonText && buttonLink}
					<div class="pt-4">
						<Button
							size="lg"
							class={cn(
								'rounded-[50px] px-8 py-4 text-lg shadow-lg',
								isDark
									? 'bg-white text-[#2b482d] hover:bg-gray-100'
									: 'bg-[#2b482d] text-white hover:bg-[#1e3d21]'
							)}
							onclick={() => (window.location.href = buttonLink)}
						>
							{buttonText}
						</Button>
					</div>
				{/if}
			</div>

			<!-- Image -->
			{#if image && image !== '' && record && record.images}
				{@const imageIndex = parseInt(image) - 1}
				{@const imageName = record.images[imageIndex]}
				{#if imageName}
					<div
						class={cn(
							'relative m-5 h-full min-h-[400px] lg:min-h-[500px]',
							imagePosition === 'left' ? 'lg:order-1' : ''
						)}
					>
						<PbImage
							{record}
							photoName={imageName}
							alt={title}
							width={960}
							height={600}
							cssClass="absolute inset-0 h-full w-full object-cover"
						/>
					</div>
				{/if}
			{:else if image && !record}
				<!-- Fallback for static images -->
				<div
					class={cn(
						'relative h-full min-h-[400px] lg:min-h-[500px]',
						imagePosition === 'left' ? 'lg:order-1' : ''
					)}
				>
					<img src={image} alt={title} class="absolute inset-0 h-full w-full object-cover px-5" />
				</div>
			{/if}
		</div>
	</div>
</section>

