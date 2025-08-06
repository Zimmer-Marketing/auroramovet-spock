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
	$inspect(menuItems);
</script>

<!-- Footer -->
<footer class="bg-primary py-12 text-primary-foreground">
	<div class="container mx-auto px-6">
		<div class="grid gap-8 md:grid-cols-4">
			<!-- Logo and Contact Info -->
			<div>
				<img src={logoImage} alt="Aurora Animal Clinic" class="mb-4 h-16" />
				<div class="space-y-3 text-base">
					<div class="flex items-start gap-3">
						<img src="/5fa85b511671d542e840ec073287c8f89abe0c19.svg" alt="Phone" class="w-5 h-5 mt-0.5 flex-shrink-0" />
						<p>(417) 678-3112</p>
					</div>
					<div class="flex items-start gap-3">
						<img src="/b614c23a02e500d7a764ab09c99e879635bcd65f.svg" alt="Location" class="w-5 h-5 mt-0.5 flex-shrink-0" />
						<p>1510 E Church St, Aurora, MO 65605</p>
					</div>
					<div class="space-y-1">
						<div class="flex items-start gap-3">
							<img src="/7cc5e08b9a3bc3a0c3d80465be2b3166e0e784c1.svg" alt="Clock" class="w-5 h-5 mt-0.5 flex-shrink-0" />
							<div>
								<p>Mon-Fri 7:30am - 5:30pm</p>
								<p>Saturday 8:00am - 2:00pm</p>
							</div>
						</div>
					</div>
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
				<div class="flex space-x-4">
					<a href="#" class="text-2xl transition-colors hover:text-blue-400">📘</a>
				</div>
				<p class="mt-2 text-sm">Facebook</p>
			</div>

			<!-- Review Call-to-Action -->
			<div>
				<h4 class="mb-4 font-bold">Leave us a Review!</h4>
				<div class="aspect-video overflow-hidden rounded-lg border border-primary-foreground/20">
					<img
						src="/ec316b037d8e402fcb1601e88281f7b2a405a596.png"
						alt="Aurora Animal Clinic Building"
						class="h-full w-full object-cover"
					/>
				</div>
			</div>
		</div>

		<div
			class="mt-8 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60"
		>
			<p>Copyright © 2025 Aurora Animal Clinic | Privacy Policy | Website by Zimmer Marketing</p>
		</div>
	</div>
</footer>
