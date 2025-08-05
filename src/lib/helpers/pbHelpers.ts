import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export type Record = {
	collectionId: string;
	id: string;
	images: string[];
};

export function getPbRecordImageURL(
	record: Record,
	imageIndex: number,
	width: number = 1920,
	quality: number = 80
) {
	const collectionId = record.collectionId;
	const recordId = record.id;
	const fileName = record.images[imageIndex];

	const baseURL = PUBLIC_POCKETBASE_URL;
	// Construct the URL with proper PocketBase v0.26.6 format
	const params = new URLSearchParams({
		thumb: `${width}x0`, // Width only, let height scale proportionally
		quality: quality.toString()
	}).toString();

	return `${baseURL}/api/files/${collectionId}/${recordId}/${fileName}?${params}`;
}

export function findGlobal(record: any, slug: string) {
	const global = record.expand.globals.find((global: any) => global.slug === slug);

	if (!global) {
		console.error(`Global with slug ${slug} not found`);

		return {
			title: 'Global not found',
			content: 'Global not found'
		};
	}

	return global;
}
