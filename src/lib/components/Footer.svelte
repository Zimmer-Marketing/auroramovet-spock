<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	interface MenuItem {
		title: string;
		path: string;
	}

	interface Props {
		siteSettings: {
			id: string;
			collectionId: string;
			images?: string[];
			meta?: {
				siteTitle?: string;
				phone?: string[];
				address?: string[];
				hours?: string[];
				facebook?: string[];
				googleReviewLink?: string;
				directionsLink?: string;
			};
			expand?: {
				menu?: MenuItem[];
			};
		};
	}

	let { siteSettings }: Props = $props();
	let logoImage = $derived(
		siteSettings?.images?.[0]
			? `${PUBLIC_POCKETBASE_URL}/api/files/${siteSettings.collectionId}/${siteSettings.id}/${siteSettings.images[0]}?thumb=0x0`
			: '/aurora-logo.png'
	);
	let menuItems = siteSettings?.expand?.menu;
	let meta = siteSettings?.meta;
</script>

<!-- Footer -->
<footer class="relative mt-32">
	<!-- Footer SVG wave at the top -->
	<div class="absolute -top-44 z-10 w-full">
		<img src="/footer.svg" alt="Footer decoration" class=" h-full w-full" />
	</div>
	<div class="-mt-1 bg-primary text-primary-foreground md:pt-10">
		<div class="relative z-20 mx-auto max-w-screen-2xl px-6 py-12 lg:px-8">
			<div class="grid gap-8 md:grid-cols-4 lg:gap-12">
				<!-- Logo and Contact Info -->
				<div>
					<img src={logoImage} alt={meta?.siteTitle || 'Aurora Animal Clinic'} class="mb-4 h-16" />
					<div class="space-y-4 text-base">
						{#if meta?.phone?.[1]}
							<div class="flex items-start gap-3">
								<img
									src="/5fa85b511671d542e840ec073287c8f89abe0c19.svg"
									alt="Phone"
									class="mt-0.5 h-5 w-5 flex-shrink-0"
								/>
								<a href={meta.phone[0]} class="block transition-colors hover:text-secondary">
									{meta.phone[1]}
								</a>
							</div>
						{/if}
						{#if meta?.address}
							<div class="flex items-start gap-3">
								<img
									src="/b614c23a02e500d7a764ab09c99e879635bcd65f.svg"
									alt="Location"
									class="mt-0.5 h-5 w-5 flex-shrink-0"
								/>
								<div class="flex-1">
									{#if meta?.directionsLink}
										<a
											href={meta.directionsLink}
											target="_blank"
											rel="noopener noreferrer"
											class="block transition-colors hover:text-secondary"
										>
											{#each meta.address as line}
												<p>{line}</p>
											{/each}
										</a>
									{:else}
										{#each meta.address as line}
											<p>{line}</p>
										{/each}
									{/if}
								</div>
							</div>
						{/if}
						{#if meta?.hours}
							<div class="flex items-start gap-3">
								<img
									src="/7cc5e08b9a3bc3a0c3d80465be2b3166e0e784c1.svg"
									alt="Clock"
									class="mt-0.5 h-5 w-5 flex-shrink-0"
								/>
								<div class="flex-1">
									{#each meta.hours as hour}
										<p>{hour}</p>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Navigation Links -->

				<!-- Navigation Links -->
				<div>
					<h4 class="mb-4 font-bold">Navigation</h4>
					<ul class="space-y-2 text-sm">
						{#each menuItems as item}
							<li>
								<a href={item.path} class="transition-colors hover:text-secondary">
									{item.title}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Social Media -->
				<div>
					<h4 class="mb-4 font-bold">Follow Us</h4>
					<div class="flex items-center space-x-4">
						{#if meta?.facebook?.[0]}
							<div>
								<a
									href={meta.facebook[0]}
									target="_blank"
									rel="noopener noreferrer"
									class="text-2xl transition-colors hover:text-blue-400">📘</a
								>
								<p class="mt-1 text-sm">Facebook</p>
							</div>
						{/if}
						{#if meta?.googleReviewLink}
							<div>
								<a
									href={meta.googleReviewLink}
									target="_blank"
									rel="noopener noreferrer"
									class="text-2xl transition-colors hover:text-yellow-400">⭐</a
								>
								<p class="mt-1 text-sm">Google Reviews</p>
							</div>
						{/if}
					</div>
				</div>

				<!-- Review Call-to-Action -->
				<div>
					<h4 class="mb-4 font-bold">Leave us a Review!</h4>
					{#if meta?.googleReviewLink}
						<a href={meta.googleReviewLink} target="_blank" rel="noopener noreferrer" class="block">
							<div
								class="aspect-video overflow-hidden rounded-lg border border-primary-foreground/20 transition-opacity hover:opacity-80"
							>
								<img
									src="/ec316b037d8e402fcb1601e88281f7b2a405a596.png"
									alt="{meta?.siteTitle || 'Aurora Animal Clinic'} Building"
									class="h-full w-full object-cover"
								/>
							</div>
						</a>
					{:else}
						<div
							class="aspect-video overflow-hidden rounded-lg border border-primary-foreground/20"
						>
							<img
								src="/ec316b037d8e402fcb1601e88281f7b2a405a596.png"
								alt="{meta?.siteTitle || 'Aurora Animal Clinic'} Building"
								class="h-full w-full object-cover"
							/>
						</div>
					{/if}
				</div>
			</div>

			<div
				class="mt-8 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60"
			>
				<p>
					Copyright © 2025 {meta?.siteTitle || 'Aurora Animal Clinic'} | Privacy Policy | Website by
					Zimmer Marketing
				</p>
			</div>
		</div>
	</div>
</footer>
