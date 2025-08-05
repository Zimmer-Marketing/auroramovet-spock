<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	interface TeamMember {
		id: string;
		name: string;
		title: string;
		image?: string;
		collectionId?: string;
	}

	interface Props {
		teamMembers?: TeamMember[];
		className?: string;
	}

	let { teamMembers = [], className = '' }: Props = $props();
</script>

<section class="bg-primary py-16 text-primary-foreground {className}">
	<div class="container mx-auto px-6">
		<h2 class="mb-12 text-center text-4xl font-bold">Meet the Aurora Animal Clinic Team</h2>

		<div class="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each teamMembers as member}
				<div
					class="mx-auto w-full max-w-[400px] overflow-hidden rounded-t-md bg-white shadow-md transition-all hover:shadow-xl"
				>
					<!-- Staff Image - no bottom rounding -->
					<div class="relative h-[362px] w-full overflow-hidden rounded-t-md">
						{#if member.image && member.id}
							<img
								src={`${PUBLIC_POCKETBASE_URL}/api/files/staff/${member.id}/${member.image}?thumb=600x724`}
								alt={member.name}
								class="h-full w-full rounded-none object-cover transition-transform hover:scale-105"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center bg-muted">
								<span class="text-6xl text-muted-foreground">{member.name.charAt(0)}</span>
							</div>
						{/if}
					</div>

					<!-- Staff Info Footer - matching Figma design -->
					<div class="relative flex flex-col items-start bg-white p-5">
						<!-- Title positioned on the left -->
						<div class="">
							<p class="text-2xl font-normal leading-[35px] text-[#2b482d]">
								{member.title}
							</p>
						</div>

						<!-- Name centered in the card -->
						<div class="flex w-full justify-start">
							<h3 class="text-2xl font-bold leading-[65px] text-[#2b482d]">
								{member.name}
							</h3>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-12 text-center">
			<Button
				variant="outline"
				class="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
			>
				About Us
			</Button>
		</div>
	</div>
</section>

