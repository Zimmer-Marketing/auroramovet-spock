// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			pb: PocketBase;
		}
	}
}

declare module 'svelte/elements' {
	export interface SvelteHTMLElements {
		'altcha-widget': {
			challenge?: string;
			auto?: string;
			display?: string;
			name?: string;
			hidefooter?: boolean;
			hidelogo?: boolean;
		};
	}
}

export {};
