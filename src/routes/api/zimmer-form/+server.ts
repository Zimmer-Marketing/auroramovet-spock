import { json } from '@sveltejs/kit';
import { contact_schema } from '$lib/schemas/contact';
import PocketBase from 'pocketbase';
import { PUBLIC_ZIMBOT_PB, PUBLIC_POCKETBASE_URL, PUBLIC_FATHOM_ID } from '$env/static/public';
import {
	PRIVATE_BC_PROJECT_ID,
	PRIVATE_BC_CAMPFIRE_ID,
	PRIVATE_BC_CAMPFIRE_MENTIONS
} from '$env/static/private';

export async function POST({ request, getClientAddress }) {
	try {
		const requestData = await request.json();
		
		// Extract user journey before validation
		const userJourney = requestData.user_journey;
		
		// Create clean form data for validation (without journey)
		const { user_journey, ...formData } = requestData;

		// Validate using the schema
		const result = contact_schema.safeParse(formData);

		if (!result.success) {
			return json(
				{
					success: false,
					field_errors: result.error.flatten().fieldErrors
				},
				{ status: 400 }
			);
		}

		// Create enhanced form data for submission with journey appended
		const formDataForSubmission = { ...result.data };
		
		// Append journey to note if provided and not already included
		if (userJourney && typeof userJourney === 'string') {
			const currentNote = formDataForSubmission.note || '';
			const journeyDelimiter = '\n\n----- User Journey -----\n';
			const journeyText = `${journeyDelimiter}Pages visited: ${userJourney}`;
			if (!currentNote.includes('----- User Journey -----')) {
				formDataForSubmission.note = currentNote + journeyText;
			}
		}

		// Get site settings from PocketBase - exactly as in original
		const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
		const globals = await pb.collection('globals').getList(1, 20);
		const siteSettings = globals.items.filter((item) => item.slug === 'siteSettings')[0];
		const formSettings = globals.items.filter((item) => item.slug === 'formSettings')[0];

		let sendEmails;
		let sendTexts;

		if (PUBLIC_FATHOM_ID !== 'DEV' && formSettings?.meta) {
			if (formSettings.meta?.sendEmails) {
				sendEmails = formSettings.meta.sendEmails;
			}

			if (formSettings.meta?.sendTexts) {
				sendTexts = formSettings.meta.sendTexts;
			}
		}

		// Send to message relay with exact same structure as original
		const response = await fetch(`${PUBLIC_ZIMBOT_PB}/zimmer/v2/message-relay`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				campfireId: PRIVATE_BC_CAMPFIRE_ID,
				projectId: PRIVATE_BC_PROJECT_ID,
				mentions: PRIVATE_BC_CAMPFIRE_MENTIONS,
				formData: formDataForSubmission,
				userIp: getClientAddress(),
				origin: request.headers.get('referer'),
				appDomain: siteSettings.meta.appDomain,
				sendEmails,
				sendTexts
			})
		});

		const data = await response.json();

		if (!response.ok) {
			console.error('Relay error:', data);
			return json(
				{
					success: false,
					error: 'Failed to send message'
				},
				{ status: 500 }
			);
		}

		if (!data.valid) {
			return json(
				{
					success: false,
					error: data.returnMessage
				},
				{ status: 403 }
			);
		}

		return json({
			success: true,
			message: data.returnMessage
		});
	} catch (error) {
		console.error('Form submission error:', error);
		return json(
			{
				success: false,
				error: 'An unexpected error occurred'
			},
			{ status: 500 }
		);
	}
}
