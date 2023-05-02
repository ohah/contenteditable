/* eslint-disable new-cap */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-constructor-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */

import { Editor, Grid } from 'core';

import Caret from './caret';

import { define } from 'components/default';
import { json2EditorNode } from 'utils';

export interface EditorFiberNode extends EditorNode {
  key: string;
}

export interface EditorNode {
  children?: EditorNode[];
  type?: string;
  tag?: string;
  format?: string[];
  text?: string;
  indent?: number;
  url?: string;
  target?: string;
}

interface Options {
  data: EditorNode[];
}

export type FiberNodeWeakMap = WeakMap<Node | HTMLElement | Text, EditorFiberNode>;

@define('web-editor')
class EditorElement extends HTMLElement {
  /**
   * 해당 엘리먼트에 포커스가 가면 json 데이터를 불러온다.
   */
  #FiberNodeWeakMap: FiberNodeWeakMap;

  #Caret: Caret;

  #view: HTMLDivElement;

  #textArea: HTMLTextAreaElement;

  #observers: Set<any>;

  static get observedAttributes() {
    return ['test', 'l'];
  }

  constructor(options?: Partial<Options>) {
    super();
    this.#Caret = new Caret();
    this.#FiberNodeWeakMap = new WeakMap();
    this.#textArea = document.createElement('textarea');
    this.#observers = new Set();

    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.innerHTML = `
      html{
        outline: none;
        white-space: pre-wrap;
        word-break: break-word;
        user-select: none;
        cursor: text;
        overflow-wrap: break-word;
      }
    `;
    shadow.appendChild(style);
    if (options?.data) {
      const { fragment, node } = json2EditorNode(options.data, this.#FiberNodeWeakMap);
      shadow.appendChild(fragment);
      Grid.create(this);
      // (shadow as HTMLElement).contentEditable = true;
      node.addEventListener('mousedown', e => {
        const element = shadow.elementFromPoint(e.pageX, e.pageY);
        console.log('e', e.pageX, e.pageY, element);
        Editor.setCaret(this, e.pageX, e.pageY);
        this.notifyObservers();
      });
      this.#view = node;
    } else {
      this.#view = document.createElement('div');
      this.#view.classList.add('editor');
      shadow.appendChild(this.#view);
    }
    // shadow.appendChild(this.#textArea);
    shadow.appendChild(this.#Caret);
    this.#Caret.setAttribute('height', '21px');
    console.log('textarea', this.#textArea.getBoundingClientRect());
    console.log(this.#FiberNodeWeakMap);
    setTimeout(() => {
      this.setAttribute('test', 'test');
    }, 1000);
  }

  addObserver(observer: any) {
    this.#observers.add(observer);
  }

  notifyObservers() {
    this.#observers.forEach(observer => observer(this));
  }

  removeObserver(observer: any) {
    this.#observers.delete(observer);
  }

  get weakMap() {
    return this.#FiberNodeWeakMap;
  }

  get view() {
    return this.#view;
  }

  connectedCallback() {
    console.log('Custom square element added to page.');
    this.notifyObservers();
  }

  disconnectedCallback() {
    console.log('Custom square element removed from page.');
    this.#observers.clear();
  }

  adoptedCallback() {
    console.log('Custom square element moved to new page.');
  }

  attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    this.notifyObservers();
    console.log('Custom square element attributes changed.');
  }
}

export default EditorElement;
