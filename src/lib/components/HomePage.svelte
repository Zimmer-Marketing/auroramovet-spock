<script lang="ts">
	import { cn } from '$lib/utils';
	import HeroSection from './sections/HeroSection.svelte';
	import ServicesSection from './sections/ServicesSection.svelte';
	import TeamSection from './sections/TeamSection.svelte';
	import TestimonialsSection from './sections/TestimonialsSection.svelte';
	import ContactSection from './sections/ContactSection.svelte';

	interface TeamMember {
		id: string;
		name: string;
		title: string;
		image?: string;
		collectionId?: string;
	}

	interface ServiceItem {
		id: string;
		title: string;
		description?: string;
		icon?: string;
		image?: string;
		collectionId?: string;
	}

	interface Testimonial {
		id: string;
		name: string;
		review: string;
		rating?: number;
	}

	interface Props {
		heroImage?: string;
		logoImage?: string;
		teamMembers?: TeamMember[];
		services?: ServiceItem[];
		testimonials?: Testimonial[];
		className?: string;
		route: any;
	}

	let {
		heroImage,
		logoImage,
		teamMembers = [],
		services = [],
		testimonials = [],
		className = '',
		route
	}: Props = $props();
</script>

<div class={cn('min-h-screen bg-background', className)}>
	<HeroSection title={route.title} content={route.content} {heroImage} />
	<ServicesSection {services} />
	<TeamSection {teamMembers} />
	<TestimonialsSection {testimonials} />
	<ContactSection />
</div>