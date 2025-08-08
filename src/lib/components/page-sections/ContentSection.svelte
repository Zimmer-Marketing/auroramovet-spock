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
	<div class="container mx-auto px-6">
		<div class="grid gap-12 items-center lg:grid-cols-2">
			<!-- Content -->
			<div class={cn('space-y-6', imagePosition === 'left' ? 'lg:order-2' : '')}>
				<h2 class={cn('text-4xl md:text-5xl font-bold leading-[65px]', textColor)}>
					{title}
				</h2>
				
				<div class={cn('prose prose-lg max-w-none leading-[35px] text-xl', textColor)}>
					{@html content}
				</div>

				{#if buttonText && buttonLink}
					<div class="pt-4">
						<Button
							size="lg"
							class={cn('px-8 py-4 text-lg rounded-[50px] shadow-lg', 
								isDark ? 'bg-white text-[#2b482d] hover:bg-gray-100' : 'bg-[#2b482d] text-white hover:bg-[#1e3d21]'
							)}
							onclick={() => window.location.href = buttonLink}
						>
							{buttonText}
						</Button>
					</div>
				{/if}
			</div>

			<!-- Image -->
			{#if image && image !== "" && record && record.images}
				{@const imageIndex = parseInt(image) - 1}
				{@const imageName = record.images[imageIndex]}
				{#if imageName}
					<div class={cn('', imagePosition === 'left' ? 'lg:order-1' : '')}>
						<div class="overflow-hidden rounded-[10px] shadow-lg">
							<PbImage
								{record}
								photoName={imageName}
								alt={title}
								width={800}
								height={400}
								cssClass="h-[300px] md:h-[400px] w-full object-cover transition-transform duration-300 hover:scale-105"
							/>
						</div>
					</div>
				{/if}
			{:else if image && !record}
				<!-- Fallback for static images -->
				<div class={cn('', imagePosition === 'left' ? 'lg:order-1' : '')}>
					<div class="overflow-hidden rounded-[10px] shadow-lg">
						<img
							src={image}
							alt={title}
							class="h-[300px] md:h-[400px] w-full object-cover transition-transform duration-300 hover:scale-105"
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>