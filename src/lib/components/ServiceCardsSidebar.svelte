<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import EditRecordButton from './pocketbase/EditRecordButton.svelte';
	import * as Card from './ui/card';

	interface ServiceItem {
		id: string;
		title: string;
		description?: string;
		icon?: string;
		image?: string;
		slug?: string;
		collectionId?: string;
	}

	interface Props {
		services?: ServiceItem[];
		className?: string;
	}

	let { services = [], className = '' }: Props = $props();
</script>

{#if services && services.length > 0}
	<Card.Root class="relative md:mt-20 {className}">
		<Card.Header class="pb-4">
			<Card.Title class="text-lg font-bold text-primary">Our Services</Card.Title>
			<Card.Description class="text-sm text-muted-foreground">
				Professional veterinary care for your animals
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-3">
			{#each services as service}
				<div class="relative">
					<EditRecordButton record={service} />
					<a
						href="/{service.slug}/"
						class="group block rounded-lg border border-border p-3 transition-all duration-200 hover:border-primary hover:shadow-sm"
					>
						<div class="flex items-start space-x-3">
							<!-- Icon -->
							<div class="flex-shrink-0">
								{#if service.icon}
									<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
										<img
											src={`${PUBLIC_POCKETBASE_URL}/api/files/services/${service.id}/${service.icon}?thumb=64x64`}
											alt={service.title}
											class="h-5 w-5 object-contain brightness-0 invert filter"
										/>
									</div>
								{:else}
									<!-- Default icon -->
									<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
										<svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
											/>
										</svg>
									</div>
								{/if}
							</div>

							<!-- Content -->
							<div class="min-w-0 flex-1">
								<h4
									class="text-sm font-semibold text-primary transition-colors group-hover:text-primary/90"
								>
									{service.title}
								</h4>
								{#if service.description}
									<p class="mt-1 line-clamp-2 text-xs text-muted-foreground">
										{service.description}
									</p>
								{/if}
							</div>

							<!-- Arrow -->
							<div class="flex-shrink-0">
								<svg
									class="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>
						</div>
					</a>
				</div>
			{/each}
		</Card.Content>
	</Card.Root>
{/if}

