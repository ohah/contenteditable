/* eslint-disable new-cap */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-constructor-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */

import { Grid } from 'core';
import { ViewNode } from 'core/Grid';

import { Selection } from 'components';
import { define } from 'components/default';
import { json2EditorFiberNode, json2EditorNode } from 'utils';

export interface EditorFiberNode extends EditorNode {
  children?: EditorFiberNode[];
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

export type FiberNodeWeakMap = WeakMap<ViewNode, EditorFiberNode>;
export type FiberNodeMap = Map<string, ViewNode>;

@define('web-editor')
class EditorElement extends HTMLElement {
  /**
   * 해당 엘리먼트에 포커스가 가면 json 데이터를 불러온다.
   */
  #FiberNodeWeakMap: FiberNodeWeakMap;

  #FiberNodeMap: FiberNodeMap;

  #Selection: Selection;

  data: EditorNode[];

  FiberData: EditorFiberNode[];

  /**
   * 스크롤. 이벤트 등의 편의를 위해 모든 요소의 부모 wrapper 요소를 하나 추가.
   */
  wrapper: HTMLDivElement;

  #view: HTMLDivElement;

  #observers: Set<any>;

  static get observedAttributes() {
    return ['test', 'l'];
  }

  constructor(options?: Partial<Options>) {
    super();
    this.#FiberNodeWeakMap = new WeakMap();
    this.#FiberNodeMap = new Map();
    // this.setAttribute('tabIndex', '-1');
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('tabIndex', '-1');
    this.#view = document.createElement('div');
    this.FiberData = [];
    this.#Selection = new Selection(this);
    this.wrapper.appendChild(this.#Selection);
    // this.wrapper.style.position = 'relative';
    // this.wrapper.style.height = '300px';
    // this.wrapper.style.overflowY = 'auto';
    // this.wrapper.style.userSelect = 'none';
    this.#observers = new Set();

    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.innerHTML = `
      .editor:focus{
        border:1px solid red;
      }
      .editor{
        border:1px solid blue;
        padding:5px;
      }
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
    shadow.appendChild(this.wrapper);
    this.data = options?.data || [];
    if (this.data) {
      this.FiberData = json2EditorFiberNode(this.data);
    } else {
      this.#view = document.createElement('div');
      this.#view.classList.add('editor');
      this.wrapper.appendChild(this.#view);
    }
    // shadow.appendChild(this.#textArea);
    this.render();
    // document.addEventListener('selectionchange', e => {
    //   console.log('selectin', (shadow as never as Document).getSelection());
    // });
    // this.#view.contentEditable = 'true';
    // this.addEventListener('keydown', e => console.log('e', e.key));
    // this.#Caret.setAttribute('height', '21px');
    // console.log('textarea', this.#textArea.getBoundingClientRect());
    // console.log(this.#FiberNodeWeakMap);
    // setTimeout(() => {
    //   this.setAttribute('test', 'test');
    // }, 1000);
  }

  async render() {
    this.#view?.remove();
    const { fragment, node } = json2EditorNode(this.FiberData, this.#FiberNodeWeakMap, this.#FiberNodeMap);
    this.wrapper.appendChild(fragment);
    this.#view = node;
    Grid.create(this);
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

  get Selection() {
    return this.#Selection;
  }

  get weakMap() {
    return this.#FiberNodeWeakMap;
  }

  get FiberNodeMap() {
    return this.#FiberNodeMap;
  }

  set view(view: HTMLDivElement) {
    this.#view = view;
  }

  get view() {
    return this.#view;
  }

  connectedCallback() {
    console.log('Custom square element added to page.');
    // 커스텀 Caret을 위한 Grid
    // Grid.create(this);
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
