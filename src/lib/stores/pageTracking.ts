import { browser } from '$app/environment';

interface PageVisit {
	slug: string;
	timestamp: number;
}

class PageTrackingStore {
	private storageKey = 'page_visit_history';
	private maxPages = 10;
	private visits: PageVisit[] = [];

	constructor() {
		// Only load from storage in browser environment
		if (typeof window !== 'undefined' && browser) {
			this.loadFromStorage();
		}
	}

	private extractSlug(pathname: string): string {
		const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
		return !cleanPath ? 'home' : cleanPath;
	}

	private loadFromStorage(): void {
		try {
			const stored = sessionStorage.getItem(this.storageKey);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed)) {
					this.visits = parsed;
				}
			}
		} catch (error) {
			console.warn('Failed to load page tracking data:', error);
			this.visits = [];
		}
	}

	private saveToStorage(): void {
		if (typeof window === 'undefined' || !browser) return;
		try {
			sessionStorage.setItem(this.storageKey, JSON.stringify(this.visits));
		} catch (error) {
			console.warn('Failed to save page tracking data:', error);
		}
	}

	trackPage(pathname: string): void {
		const slug = this.extractSlug(pathname);
		const timestamp = Date.now();
		const lastVisit = this.visits[this.visits.length - 1];

		// Skip if same as last slug to avoid immediate duplicates
		if (lastVisit && lastVisit.slug === slug) {
			return;
		}

		const newVisit: PageVisit = { slug, timestamp };
		this.visits = [...this.visits, newVisit];

		// Limit to max pages, keeping most recent
		if (this.visits.length > this.maxPages) {
			this.visits = this.visits.slice(-this.maxPages);
		}

		this.saveToStorage();

		// Debug logging
		if (typeof window !== 'undefined' && browser && console.debug) {
			console.debug('Page tracked:', slug, 'Journey:', this.getVisitedPagesText());
		}
	}

	getVisitedPagesText(): string {
		return this.visits.length === 0 ? '' : this.visits.map((visit) => visit.slug).join(' → ');
	}

	getVisits(): PageVisit[] {
		return [...this.visits];
	}

	clear(): void {
		this.visits = [];
		if (typeof window !== 'undefined' && browser) {
			sessionStorage.removeItem(this.storageKey);
		}
	}

	getPageCount(): number {
		return this.visits.length;
	}
}

export const pageTracking = new PageTrackingStore();

// Helper function for backward compatibility/testing
export function extractSlugFromPathname(pathname: string): string {
	const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
	return !cleanPath ? 'home' : cleanPath;
}