<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Alert from '$lib/components/ui/alert';
	import { ExclamationTriangle, Rocket } from 'radix-icons-svelte';
	import { toast } from 'svelte-sonner';
	import * as Fathom from 'fathom-client';

	let submitting = $state(false);
	let success = $state(false);
	let form_errors = $state<Record<string, string>>({});
	let formData = $state({
		name: '',
		email: '',
		phone: '',
		note: '',
		referrer: ''
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		Fathom.trackEvent('Contact Form Submitted');
		submitting = true;
		form_errors = {};
		if (typeof window !== 'undefined') {
			formData.referrer = sessionStorage.getItem('userReferrer') || 'direct';
		}

		try {
			const response = await fetch('/api/zimmer-form', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...formData,
					origin: browser ? $page.url.href : undefined
				})
			});

			const result = await response.json();

			if (result.success) {
				success = true;
				toast.success('Message Sent', {
					description: result.message || 'Thank you for your message. We will get back to you soon.'
				});
			} else {
				if (result.field_errors) {
					form_errors = result.field_errors;
					toast.error('Please correct the errors below');
				} else {
					toast.error(result.error || 'Failed to send message');
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

<section class="my-5 max-w-xl">
	{#if success}
		<Alert.Root>
			<Rocket class="h-4 w-4" />
			<Alert.Title>Message Sent!</Alert.Title>
			<Alert.Description>
				Thank you for your message. We will get back to you soon.
			</Alert.Description>
		</Alert.Root>
	{:else}
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="space-y-2">
				<Label for="name">Name *</Label>
				<Input
					id="name"
					type="text"
					required
					bind:value={formData.name}
					aria-invalid={form_errors.name ? 'true' : undefined}
					placeholder="Enter your name"
				/>
				{#if form_errors.name}
					<p class="text-sm text-destructive">{form_errors.name}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="email">Email *</Label>
				<Input
					id="email"
					type="email"
					required
					bind:value={formData.email}
					aria-invalid={form_errors.email ? 'true' : undefined}
					placeholder="your.email@example.com"
				/>
				{#if form_errors.email}
					<p class="text-sm text-destructive">{form_errors.email}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="phone">Phone *</Label>
				<Input
					id="phone"
					type="tel"
					required
					bind:value={formData.phone}
					aria-invalid={form_errors.phone ? 'true' : undefined}
					placeholder="Enter your phone number"
				/>
				{#if form_errors.phone}
					<p class="text-sm text-destructive">{form_errors.phone}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="note">Message *</Label>
				<Textarea
					id="note"
					rows="4"
					required
					bind:value={formData.note}
					aria-invalid={form_errors.note ? 'true' : undefined}
					placeholder="Enter your message"
				/>
				{#if form_errors.note}
					<p class="text-sm text-destructive">{form_errors.note}</p>
				{/if}
			</div>

			<Button id="contact-form-submit" type="submit" disabled={submitting}>
				{submitting ? 'Sending...' : 'Send Message'}
			</Button>
		</form>
	{/if}
</section>
