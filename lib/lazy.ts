import dynamic from "next/dynamic";
import type { ComponentType } from "react";

interface LazyOptions {
  ssr?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyClient<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: LazyOptions = {}
) {
  return dynamic(factory, { ssr: options.ssr ?? true });
}
