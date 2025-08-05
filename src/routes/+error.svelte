<script>
	import { page } from '$app/stores';
</script>

<div class="bg-base-100 flex min-h-screen flex-col items-center justify-center p-4">
	<div class="rounded-lg bg-accent p-8 shadow-lg">
		<h1>{$page.status}</h1>
		<p class="mb-6 text-lg">{$page.error?.message}</p>
	</div>
</div>
