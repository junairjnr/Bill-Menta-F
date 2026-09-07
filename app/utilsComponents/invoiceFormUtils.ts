export const ENTER_NAV_SELECTOR = "[data-enter-nav]:not([data-enter-nav-disabled='true'])";

export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function focusEnterNavField(el: HTMLElement) {
  if (el.dataset.enterNav === "select" || el.dataset.enterNav === "item-select") {
    const input = el.querySelector<HTMLInputElement>("input");
    input?.focus();
    return;
  }
  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  ) {
    el.focus();
    return;
  }
  el.querySelector<HTMLElement>("input, select, textarea")?.focus();
}

export function getEnterNavFields(form: HTMLElement): HTMLElement[] {
  return Array.from(form.querySelectorAll<HTMLElement>(ENTER_NAV_SELECTOR)).filter(
    (el) => el.offsetParent !== null && !el.hasAttribute("disabled")
  );
}

export function focusNextEnterNavField(form: HTMLElement, target: EventTarget | null) {
  const fields = getEnterNavFields(form);
  if (!fields.length) return false;

  let currentIdx = -1;
  const node = target as HTMLElement;
  const wrapper = node.closest<HTMLElement>(ENTER_NAV_SELECTOR);
  if (wrapper) {
    currentIdx = fields.indexOf(wrapper);
  }

  if (currentIdx < 0 || currentIdx >= fields.length - 1) return false;

  focusEnterNavField(fields[currentIdx + 1]);
  return true;
}

export function isSelectMenuOpen(target: EventTarget | null): boolean {
  const node = target as HTMLElement;
  if (node.closest('[aria-expanded="true"]')) return true;
  return !!document.querySelector('[class*="menu"] [role="option"]');
}
