<!-- CHERRY WIDGET - Floating Button -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		if (!browser) return;

		// This is the Cherry widget code converted for Svelte
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const w = window as any;
		const d = document;

		w._hw =
			w._hw ||
			function () {
				// eslint-disable-next-line prefer-rest-params
				(w._hw.q = w._hw.q || []).push(arguments);
			};

		const js = d.createElement('script');
		const fjs = d.getElementsByTagName('script')[0];
		js.id = '_hw';
		js.src = 'https://files.withcherry.com/widgets/widget.js';
		js.async = true;
		fjs?.parentNode?.insertBefore(js, fjs);

		w._hw(
			'init',
			{
				debug: false,
				variables: {
					slug: 'aurora-animal-clinic',
					name: 'Aurora Animal Clinic',
					images: [36],
					customLogo: '',
					defaultPurchaseAmount: 750,
					customImage: '',
					imageCategory: 'veterinary',
					language: 'en'
				},
				styles: {
					primaryColor: '#2b482d',
					secondaryColor: '#2b482d10',
					fontFamily: 'Montserrat',
					headerFontFamily: 'Montserrat',
					floatingEstimator: {
						position: 'bottom-right',
						offset: {
							x: '0px',
							y: '0px'
						},
						zIndex: 9999,
						ctaFontFamily: 'Montserrat',
						bodyFontFamily: 'Montserrat',
						ctaColor: '#2b482d',
						ctaTextColor: '#FFFFFF'
					}
				}
			},
			['floatingEstimator']
		);
	});
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@200..900&family=Slabo+27px:wght@200..900&family=Lato:wght@200..900&family=Raleway:wght@200..900&family=Montserrat:wght@200..900&family=Oswald:wght@200..900&family=Poppins:wght@200..900&family=Source+Sans+Pro:wght@200..900&family=PT+Sans:wght@200..900&family=Open+Sans:wght@200..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div id="floatingEstimator"></div>
