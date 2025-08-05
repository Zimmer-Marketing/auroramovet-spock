import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from 'svelte/easing';
import { fly, type FlyParams } from 'svelte/transition';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const flyAndScale = (
	node: Element,
	params: FlyParams = { y: 8, duration: 150 }
) => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	return {
		duration: params.duration,
		easing: cubicOut,
		css: (t: number) => `
			transform: ${transform} scale(${t}) translate(0, ${(1 - t) * params.y}px);
			opacity: ${t}
		`
	};
};

export function serializeNonPOJOs<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}
