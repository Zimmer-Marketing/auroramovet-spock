<script lang="ts">
	interface Props {
		siteSettings: any;
	}

	let { siteSettings }: Props = $props();
</script>

<footer class="mt-auto py-6 md:px-8 md:py-0">
	<!-- CUSTOM FOOTER GOES HERE -->

	<!-- DO NOT REMOVE THIS COPYRIGHT -->
	<div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
		<!-- DO NOT REMOVE THIS COPYRIGHT OR PRIVACY POLICY LINK -->
		<p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
			Copyright &copy; {new Date().getFullYear()} | All rights reserved {siteSettings?.meta
				?.siteTitle} |
			<a href="/privacy-policy" class="font-medium underline underline-offset-4">Privacy Policy</a>
		</p>
		<p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
			<!-- DO NOT CHANGE THIS WORDING -->
			Website by
			<a
				href="https://zimmermarketing.com"
				target="_blank"
				rel="noreferrer"
				class="font-medium underline underline-offset-4">Zimmer Marketing</a
			>
		</p>
	</div>
</footer>
