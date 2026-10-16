import { json } from '@sveltejs/kit';
import { contact_schema } from '$lib/schemas/contact';
import { randomBytes } from 'node:crypto';

// Site Monitor stores the message, posts the Campfire receipt, and sends the
// clinic email. The intake token stays on the Aurora PocketBase server.
// A failed check tells the visitor to try again and stores nothing.

const FORWARD_URL = 'https://auroramovet-spock.s2.zimmer.marketing/_api/aurora/form';
const FORM_VERSION = '0.0.3';
const HOME = 'https://www.auroramovet.com';
const THANK_YOU = 'Thank you for your message. We will get back to you soon.';
const NOT_SENT = 'Your message was not sent. Something went wrong — please try again.';
const VISITOR_TEXT: Record<string, string> = {
	'spam-word': 'Your message was not sent. We suspect it contains spam.',
	'phone-in-message':
		'Your message was not sent. A phone number was in your message. Put it in the phone field.',
	'email-in-message':
		'Your message was not sent. An email address was in your message. Use the email field.',
	'link-in-message': 'Your message was not sent. Links are not accepted in the message.',
	'altcha-missing': NOT_SENT,
	'altcha-failed': NOT_SENT
};

function pageOnSite(raw: unknown): string {
	if (typeof raw !== 'string' || !raw) return HOME;
	try {
		const page = new URL(raw);
		const pageHost = page.host.replace(/^www\./, '');
		if (pageHost !== 'auroramovet.com') return HOME;
		if (page.protocol !== 'https:' && page.protocol !== 'http:') return HOME;
		return (page.origin + page.pathname + page.search).slice(0, 300);
	} catch {
		return HOME;
	}
}

function oneLine(raw: unknown, max: number): string {
	if (typeof raw !== 'string') return '';
	return raw
		.replace(/[\u0000-\u001F\u007F]/g, ' ')
		.replace(/[ \t]{2,}/g, ' ')
		.trim()
		.slice(0, max);
}

async function postForward(body: string) {
	const send = () =>
		fetch(FORWARD_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body,
			signal: AbortSignal.timeout(20000)
		});
	try {
		const res = await send();
		if (res.status >= 500) return await send();
		return res;
	} catch {
		try {
			return await send();
		} catch {
			return null;
		}
	}
}

export async function POST({ request, getClientAddress }) {
	try {
		const requestData = await request.json();
		const userJourney = requestData.user_journey;
		const altcha = typeof requestData.altcha === 'string' ? requestData.altcha.slice(0, 16384) : '';
		const result = contact_schema.safeParse(requestData);

		if (!result.success) {
			return json(
				{
					success: false,
					field_errors: result.error.flatten().fieldErrors
				},
				{ status: 400 }
			);
		}

		const fields = result.data;
		let note = fields.note || '';
		if (typeof userJourney === 'string' && userJourney && !note.includes('----- User Journey -----')) {
			note += '\n\n----- User Journey -----\nPages visited: ' + userJourney.slice(0, 2000);
		}
		if (fields.referrer) {
			note += '\n\nReferrer: ' + oneLine(fields.referrer, 300);
		}

		const payload = {
			intakeKey: randomBytes(12).toString('hex'),
			name: fields.name,
			email: fields.email,
			phone: fields.phone,
			note,
			journey: oneLine(userJourney, 500),
			referrer: oneLine(fields.referrer, 300),
			ip: getClientAddress(),
			userAgent: request.headers.get('user-agent') || '',
			acceptLanguage: request.headers.get('accept-language') || '',
			origin: pageOnSite(requestData.origin),
			formVersion: FORM_VERSION,
			altcha
		};

		const forwardRes = await postForward(JSON.stringify(payload));
		let forwardData: { ok?: boolean; code?: string; status?: string; error?: string } | null = null;
		if (forwardRes) {
			try {
				forwardData = await forwardRes.json();
			} catch {
				forwardData = null;
			}
		}
		const code = forwardData && typeof forwardData.code === 'string' ? forwardData.code : '';
		if (forwardRes && forwardRes.status === 422 && VISITOR_TEXT[code]) {
			return json({ success: false, error: VISITOR_TEXT[code] }, { status: 400 });
		}
		const accepted = !!(
			forwardRes &&
			forwardRes.ok &&
			forwardData &&
			forwardData.ok === true &&
			(forwardData.status === 'held' || forwardData.status === 'sent')
		);
		if (accepted) {
			return json({ success: true, message: THANK_YOU });
		}
		return json({ success: false, error: NOT_SENT }, { status: 400 });
	} catch (error) {
		console.error('Form submission error');
		return json(
			{
				success: false,
				error: 'An unexpected error occurred'
			},
			{ status: 500 }
		);
	}
}
