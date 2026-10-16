export function readAltcha(target: EventTarget | null): string {
	if (!(target instanceof HTMLFormElement)) return '';
	const widget = target.querySelector('altcha-widget') as (HTMLElement & { value?: string }) | null;
	const fromWidget = widget && typeof widget.value === 'string' ? widget.value : '';
	if (fromWidget) return fromWidget.slice(0, 16384);
	const input = target.querySelector('input[name="altcha"]') as HTMLInputElement | null;
	return input && input.value ? input.value.slice(0, 16384) : '';
}
