<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { ExclamationTriangle, Rocket } from 'radix-icons-svelte';
	import { toast } from 'svelte-sonner';
	import * as Fathom from 'fathom-client';

	interface Props {
		jobTitle?: string;
	}

	let { jobTitle = '' }: Props = $props();

	let submitting = $state(false);
	let success = $state(false);
	let form_errors = $state<Record<string, string>>({});
	let formData = $state({
		name: '',
		city: '',
		phone: '',
		email: '',
		teamFit: '',
		resume: '',
		note: ''
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		Fathom.trackEvent('Job Application Submitted');
		submitting = true;
		form_errors = {};

		// Check for links in resume and teamFit fields
		const linkPattern = /(https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i;
		if (linkPattern.test(formData.resume) || linkPattern.test(formData.teamFit)) {
			form_errors = { note: 'Links are not allowed in form submissions' };
			submitting = false;
			return;
		}

		// Format the note field with all job application details
		const formattedNote = `Job Application for: ${jobTitle}

RESUME/EXPERIENCE:
${formData.resume}

WHY GOOD FIT FOR TEAM:
${formData.teamFit}`;

		try {
			const response = await fetch('/api/zimmer-form', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					city: formData.city,
					note: formattedNote,
					origin: browser ? $page.url.href : undefined
				})
			});

			const result = await response.json();

			if (result.success) {
				success = true;
				toast.success('Application Sent', {
					description:
						result.message ||
						'Thank you for your application. We will review it and get back to you soon.'
				});
			} else {
				if (result.field_errors) {
					form_errors = result.field_errors;
					toast.error('Please correct the errors below');
				} else {
					toast.error(result.error || 'Failed to send application');
				}
			}
		} catch (error) {
			console.error('Form submission error:', error);
			toast.error('An unexpected error occurred');
		} finally {
			submitting = false;
		}
	}
</script>

<section class="my-5 w-full">
	<Card.Root
		class="relative rounded-lg border border-gray-200 bg-white/95 shadow-lg backdrop-blur-sm"
	>
		<Card.Header class="pb-0">
			<Card.Title class="text-gray-900 md:text-[24px]">
				Apply for {jobTitle || 'this Position'}
			</Card.Title>
			<Card.Description class="text-gray-600 md:py-2 md:text-[16px]">
				Submit your application and we'll get back to you soon
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if success}
				<Alert.Root class="mt-4 border-green-200 bg-green-50">
					<Rocket class="h-4 w-4 text-green-600" />
					<Alert.Title class="text-green-800">Application Sent!</Alert.Title>
					<Alert.Description class="text-green-700">
						Thank you for applying to {jobTitle || 'this position'}. We'll review your application
						and get back to you soon!
					</Alert.Description>
				</Alert.Root>
			{:else}
				<form onsubmit={handleSubmit} class="space-y-6 pt-4">
					<div class="space-y-2">
						<Label for="name" class="font-medium text-gray-700">Full Name</Label>
						<Input
							id="name"
							type="text"
							required
							bind:value={formData.name}
							aria-invalid={form_errors.name ? 'true' : undefined}
							placeholder="Enter your full name"
							class="border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500"
						/>
						{#if form_errors.name}
							<p class="text-sm text-red-600">{form_errors.name}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="city" class="font-medium text-gray-700">City of Residence</Label>
						<Input
							id="city"
							type="text"
							required
							bind:value={formData.city}
							aria-invalid={form_errors.city ? 'true' : undefined}
							placeholder="Enter your city"
							class="border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500"
						/>
						{#if form_errors.city}
							<p class="text-sm text-red-600">{form_errors.city}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="phone" class="font-medium text-gray-700">Contact Number</Label>
						<Input
							id="phone"
							type="tel"
							required
							bind:value={formData.phone}
							aria-invalid={form_errors.phone ? 'true' : undefined}
							placeholder="Enter your phone number"
							class="border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500"
						/>
						{#if form_errors.phone}
							<p class="text-sm text-red-600">{form_errors.phone}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="email" class="font-medium text-gray-700">Contact Email</Label>
						<Input
							id="email"
							type="email"
							required
							bind:value={formData.email}
							aria-invalid={form_errors.email ? 'true' : undefined}
							placeholder="your.email@example.com"
							class="border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500"
						/>
						{#if form_errors.email}
							<p class="text-sm text-red-600">{form_errors.email}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="teamFit" class="font-medium text-gray-700"
							>Why do you think you'd be a good fit for our team?</Label
						>
						<Textarea
							id="teamFit"
							rows="4"
							required
							bind:value={formData.teamFit}
							aria-invalid={form_errors.note ? 'true' : undefined}
							placeholder="Tell us why you think you'd be a good fit for our team..."
							class="border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500"
						/>
						{#if form_errors.note}
							<p class="text-sm text-red-600">{form_errors.note}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="resume" class="font-medium text-gray-700">Resume/Experience Summary</Label>
						<Textarea
							id="resume"
							rows="4"
							required
							bind:value={formData.resume}
							aria-invalid={form_errors.note ? 'true' : undefined}
							placeholder="Please provide a brief summary of your work experience and qualifications (no links allowed)"
							class="border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500"
						/>
						<p class="text-xs text-gray-500">
							Note: Links are not allowed and will result in form rejection
						</p>
					</div>

					<div class="flex justify-center pt-2">
						<Button
							type="submit"
							class="bg-blue-600 px-8 py-2 text-white hover:bg-blue-700"
							disabled={submitting}
						>
							{submitting ? 'Submitting Application...' : 'Submit Application'}
						</Button>
					</div>
				</form>
			{/if}
		</Card.Content>
	</Card.Root>
</section>
