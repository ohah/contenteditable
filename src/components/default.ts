/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-param-reassign */
import 'reflect-metadata';

export function define(name: string, options?: ElementDefinitionOptions): (constructor: CustomElementConstructor) => void {
  return (constructor: CustomElementConstructor) => {
    customElements.define(name, constructor, options);
  };
}

// export const define = (name: string) => {
//   return (constructor: CustomElementConstructor) => {
//     customElements.define(name, constructor);
//   };
// };

export interface CustomElement {
  constructor: Function & {
    observedAttributes?: string[];
  };

  attributeChangedCallback?(attributeName: string, oldValue: string, newValue: string): void;

  connectedCallback?(): void;

  disconnectedCallback?(): void;
}
