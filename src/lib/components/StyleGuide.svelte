<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<Card.Root class="max-w-2xl">
	<Card.Content class="my-2 space-y-4 py-4">
		<Card.Root>
			<Card.Header>
				<h2>Text</h2>
				<p>src/app.css</p>
			</Card.Header>
			<Card.Content>
				<div class="mb-2 flex gap-4 py-2">
					<h1>H1</h1>
					<h2>H2</h2>
					<h3>H3</h3>
					<h4>H4</h4>
					<p>Paragraph</p>
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<h2>Buttons</h2>
				<p>src/lib/components/ui/button/button.svelte</p>
			</Card.Header>
			<Card.Content class="m-2 flex flex-wrap gap-4 p-2">
				<Button>Default</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="destructive">Destructive</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="link">Link</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<h2>Colors</h2>
				<p>src/app.css - div set rounded-lg</p>
			</Card.Header>
			<Card.Content class="m-2 flex flex-wrap gap-4 p-2">
				<div class="bg-primary p-4 text-white">Primary</div>
				<div class="bg-primary-foreground p-4">Primary-foreground</div>
				<div class="bg-secondary p-4">Secondary</div>
				<div class="bg-secondary-foreground p-4 text-white">Secondary-foreground</div>
				<div class="bg-background p-4 text-black">Background</div>
				<div class="bg-foreground p-4 text-white">Foreground</div>
				<div class="bg-accent p-4">Accent</div>
				<div class="bg-accent-foreground p-4 text-white">Accent-Foreground</div>
				<div class="bg-primary p-4 text-white">Primary</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<h2>Images</h2>
			</Card.Header>
			<Card.Content>
				<img
					src=""
					alt="Img set to rounded-lg in app.css"
					class="h-24 w-24 bg-primary text-center text-white"
				/>
			</Card.Content>
		</Card.Root>
	</Card.Content>
</Card.Root>
