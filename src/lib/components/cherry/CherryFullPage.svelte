<!-- CHERRY WIDGET - Full Page -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		if (!browser) return;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const w = window as any;

		w._hw =
			w._hw ||
			function () {
				// eslint-disable-next-line prefer-rest-params
				(w._hw.q = w._hw.q || []).push(arguments);
			};

		// Use appendChild to head - more reliable than insertBefore
		const js = document.createElement('script');
		js.id = '_hw';
		js.src = 'https://files.withcherry.com/widgets/widget.js';
		js.async = true;
		document.head.appendChild(js);

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
					headerFontFamily: 'Montserrat'
				}
			},
			['hero', 'calculator', 'howitworks', 'faq']
		);
	});
</script>

<svelte:head>
	<title>Payment Plans | Aurora Animal Clinic</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@200..900&family=Slabo+27px:wght@200..900&family=Lato:wght@200..900&family=Raleway:wght@200..900&family=Montserrat:wght@200..900&family=Oswald:wght@200..900&family=Poppins:wght@200..900&family=Source+Sans+Pro:wght@200..900&family=PT+Sans:wght@200..900&family=Open+Sans:wght@200..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div id="all"></div>
<div id="hero"></div>
<div id="calculator"></div>
<div id="howitworks"></div>
<div id="testimony"></div>
<div id="faq"></div>
