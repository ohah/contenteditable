/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import { Editor, Selection } from 'core';
import { RowLocation } from 'core/Row';

import { define } from 'components/default';
import EditorElement from 'components/Editor';

@define('editor-range')
class Range extends HTMLElement {
  interval: ReturnType<typeof setInterval> | undefined;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['height', 'width', 'top', 'left'];
  }

  connectedCallback(): void {
    this.style.width = '5px';
    // this.style.height = `21px`;
    this.style.position = 'absolute';
    this.style.backgroundColor = 'rgba(100,100,100,0.75)';
    this.style.borderColor = '#000000';
    this.style.userSelect = 'none';
    // this.interval = setInterval(() => {
    //   this.style.visibility = this.style.visibility === 'hidden' ? 'inherit' : 'hidden';
    // }, 500);
  }

  disconnectedCallback(): void {
    // console.log('Custom square element removed from page.');
    clearInterval(this.interval);
  }

  adoptedCallback(): void {
    // console.log('Custom square element moved to new page.');
  }

  attributeChangedCallback(name: any, oldValue: any, newValue: any): void {
    if (name === 'height') {
      this.style.height = newValue;
    }
    if (name === 'width') {
      this.style.width = newValue;
    }
    if (name === 'top') {
      this.style.top = newValue;
    }
    if (name === 'left') {
      this.style.left = newValue;
    }
    // console.log(name, oldValue, newValue);
    // console.log('Custom square element attributes changed.');
  }
}
// customElements.define('editor-cursor', CursorElement);
export default Range;
