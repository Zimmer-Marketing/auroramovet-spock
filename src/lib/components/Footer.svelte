<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import { Phone, MapPin, Clock, Facebook, Star } from 'lucide-svelte';

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
<footer class="relative z-10 mt-32 md:mt-32">
	<!-- Footer SVG wave at the top -->
	<div class="absolute -top-16 z-20 w-full md:-top-44">
		<img src="/footer.svg" alt="Footer decoration" class="h-full w-full translate-y-1" />
	</div>

	<!-- Footer background -->
	<div class="relative z-10 -mt-3 bg-primary pt-32 text-primary-foreground">
		<div class="relative z-20 mx-auto max-w-screen-xl px-6 pb-8 lg:px-8">
			<div class="grid gap-8 md:grid-cols-12 md:gap-8">
				<!-- Logo and Contact Info - spans 4 columns -->
				<div class="md:col-span-4">
					<img
						src={logoImage}
						alt={meta?.siteTitle || 'Aurora Animal Clinic'}
						class="mb-8 h-24 w-auto"
					/>
					<div class="space-y-3 text-lg">
						{#if meta?.phone?.[1]}
							<div class="flex items-center gap-3">
								<Phone class="h-5 w-5 flex-shrink-0" />
								<a href={meta.phone[0]} class="transition-colors hover:text-secondary">
									{meta.phone[1]}
								</a>
							</div>
						{/if}
						{#if meta?.address}
							<div class="flex items-start gap-3">
								<MapPin class="mt-1 h-5 w-5 flex-shrink-0" />
								<div>
									{#if meta?.directionsLink}
										<a
											href={meta.directionsLink}
											target="_blank"
											rel="noopener noreferrer"
											class="transition-colors hover:text-secondary"
										>
											{#each meta.address as line}
												<div>{line}</div>
											{/each}
										</a>
									{:else}
										{#each meta.address as line}
											<div>{line}</div>
										{/each}
									{/if}
								</div>
							</div>
						{/if}
						{#if meta?.hours}
							<div class="flex items-start gap-3">
								<Clock class="mt-1 h-5 w-5 flex-shrink-0" />
								<div>
									{#each meta.hours as hour}
										<div>{hour}</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Navigation Links - spans 2 columns -->
				<div class="md:col-span-2">
					<ul class="space-y-2 text-lg">
						{#each menuItems as item}
							<li>
								<a href={item.path} class="transition-colors hover:text-secondary">
									{item.title}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Follow Us Section - spans 3 columns -->
				<div class="md:col-span-3">
					<h4 class="mb-4 text-2xl font-bold">Follow Us</h4>
					<div class="space-y-3">
						<!-- Google Reviews -->
						{#if meta?.googleReviewLink}
							<a
								href={meta.googleReviewLink}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 text-lg transition-colors hover:text-yellow-400"
							>
								<span class="font-semibold">Google</span>
								<div class="flex">
									{#each Array(5) as _}
										<Star class="h-4 w-4 fill-current" />
									{/each}
								</div>
							</a>
						{/if}

						<!-- Facebook -->
						{#if meta?.facebook?.[0]}
							<a
								href={meta.facebook[0]}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 text-lg transition-colors hover:text-blue-400"
							>
								<Facebook class="h-5 w-5" />
								<span>Facebook</span>
							</a>
						{/if}
					</div>
				</div>

				<!-- Review Section with Image - spans 3 columns -->
				<div class="md:col-span-3">
					<div class="overflow-hidden rounded-2xl">
						<img
							src="/ec316b037d8e402fcb1601e88281f7b2a405a596.png"
							alt="{meta?.siteTitle || 'Aurora Animal Clinic'} Building"
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>

			<!-- Copyright -->
			<div
				class="mt-12 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/80"
			>
				<p>
					Copyright © 2025 {meta?.siteTitle || 'Aurora Animal Clinic'} | Privacy Policy | Website by
					Zimmer Marketing
				</p>
			</div>
		</div>
	</div>
</footer>
