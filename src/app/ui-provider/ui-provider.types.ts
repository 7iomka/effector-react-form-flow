import type { ReactNode } from "react";
import type { EmotionCache } from "@emotion/react";

export interface DOMProps {
  id?: string;
  className?: string;
}

export type ValidationState = "valid" | "invalid";

export interface DOMRefValue<T extends HTMLElement = HTMLElement> {
  UNSAFE_getDOMNode(): T;
}

export interface FocusableRefValue<
  T extends HTMLElement = HTMLElement,
  D extends HTMLElement = T
> extends DOMRefValue<D> {
  focus(): void;
}

export type ColorScheme = "light" | "dark";
export type Theme = "default" | string;

interface UIContextProps {
  /** Whether descendants should be disabled. */
  isDisabled?: boolean;
  /** Whether descendants should be displayed with the required style. */
  isRequired?: boolean;
  /** Whether descendants should be read only. */
  isReadOnly?: boolean;
  /** Whether descendants should be displayed with the validation state style. */
  validationState?: ValidationState;
}

export interface UIProviderProps extends UIContextProps, DOMProps {
  /** The content of the Provider. */
  children: ReactNode;
  cache: EmotionCache;
}

export interface UIProviderContext extends UIContextProps {}
