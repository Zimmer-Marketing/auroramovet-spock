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

<div class="space-y-6">
	{#if success}
		<Alert.Root class="bg-green-50 border-green-200">
			<Rocket class="h-5 w-5 text-green-600" />
			<Alert.Title class="text-green-800">Message Sent!</Alert.Title>
			<Alert.Description class="text-green-700">
				Thank you for your message. We will get back to you soon.
			</Alert.Description>
		</Alert.Root>
	{:else}
		<form onsubmit={handleSubmit} class="space-y-6">
			<!-- Name Field -->
			<div class="rounded-[15px] bg-[#f3f3f3] p-6">
				<input
					id="name"
					type="text"
					required
					bind:value={formData.name}
					aria-invalid={form_errors.name ? 'true' : undefined}
					placeholder="Your Name"
					class="w-full border-none bg-transparent text-xl text-[#2b482d] placeholder:text-[#2b482d] focus:outline-none font-normal"
				/>
				{#if form_errors.name}
					<p class="text-sm text-red-600 mt-2">{form_errors.name}</p>
				{/if}
			</div>

			<!-- Phone Field -->
			<div class="rounded-[15px] bg-[#f3f3f3] p-6">
				<input
					id="phone"
					type="tel"
					required
					bind:value={formData.phone}
					aria-invalid={form_errors.phone ? 'true' : undefined}
					placeholder="Your Phone Number"
					class="w-full border-none bg-transparent text-xl text-[#2b482d] placeholder:text-[#2b482d] focus:outline-none font-normal"
				/>
				{#if form_errors.phone}
					<p class="text-sm text-red-600 mt-2">{form_errors.phone}</p>
				{/if}
			</div>

			<!-- Email Field -->
			<div class="rounded-[15px] bg-[#f3f3f3] p-6">
				<input
					id="email"
					type="email"
					required
					bind:value={formData.email}
					aria-invalid={form_errors.email ? 'true' : undefined}
					placeholder="Your Email"
					class="w-full border-none bg-transparent text-xl text-[#2b482d] placeholder:text-[#2b482d] focus:outline-none font-normal"
				/>
				{#if form_errors.email}
					<p class="text-sm text-red-600 mt-2">{form_errors.email}</p>
				{/if}
			</div>

			<!-- Message Field -->
			<div class="rounded-[15px] bg-[#f3f3f3] p-6">
				<textarea
					id="note"
					required
					bind:value={formData.note}
					aria-invalid={form_errors.note ? 'true' : undefined}
					placeholder="Your Message"
					rows="5"
					class="w-full resize-none border-none bg-transparent text-xl text-[#2b482d] placeholder:text-[#2b482d] focus:outline-none font-normal"
				></textarea>
				{#if form_errors.note}
					<p class="text-sm text-red-600 mt-2">{form_errors.note}</p>
				{/if}
			</div>

			<!-- Submit Button -->
			<div class="flex justify-center pt-4">
				<button
					id="contact-form-submit"
					type="submit"
					disabled={submitting}
					class="relative rounded-[30px] bg-white px-8 py-3 text-lg font-bold text-[#2b482d] border-2 border-[#2b482d] transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2b482d]/20 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{submitting ? 'SENDING...' : 'SEND MESSAGE'}
				</button>
			</div>
		</form>
	{/if}
</div>
