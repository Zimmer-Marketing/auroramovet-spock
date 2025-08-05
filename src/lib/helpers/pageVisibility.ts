import { page } from '$app/state';

interface Page {
	slug: string;
	title: string;
	content: string;
}

interface Record {
	expand?: {
		pages?: Page[];
	};
	title: string;
}

// Default special pages that should always show content
export const DEFAULT_SPECIAL_PAGES = ['about', 'contact-us'] as const;

/**
 * Checks if the current page should show content based on a record
 * @param record The record to check against
 * @param specialPages Array of special pages that should always show the content (defaults to DEFAULT_SPECIAL_PAGES). If an empty array is passed, it defaults to DEFAULT_SPECIAL_PAGES.
 * @returns A function that returns true if the current page should show the content
 */
export function shouldShowOnPage(
	record: Record,
	specialPagesParam: readonly string[] = DEFAULT_SPECIAL_PAGES
) {
	// Use default special pages if an empty array is passed
	const effectiveSpecialPages = specialPagesParam.length === 0 ? DEFAULT_SPECIAL_PAGES : specialPagesParam;

	const pageSlugs = record?.expand?.pages?.map((page) => page.slug) ?? [];
	const currentSlug = page.data?.route?.slug;

	return (
		pageSlugs.includes(currentSlug ?? '') ||
		effectiveSpecialPages.includes((currentSlug as typeof effectiveSpecialPages[number]) ?? '')
	);
}
