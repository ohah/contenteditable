/* eslint-disable prefer-destructuring */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import { CompoistionType, InputType } from '@types';
import { SelectionInputEvent } from 'core';
import Grid, { Location } from 'core/Grid';
import { initialSelectState, SelectionState, State } from 'core/State';

import { Caret, Range } from 'components';
import { define } from 'components/default';
import EditorElement from 'components/Editor';
import { IS_COMPOSING } from 'utils';

@define('editor-selection')
class Selection extends HTMLElement {
  interval: ReturnType<typeof setInterval> | undefined;

  editor: EditorElement;

  #contentEditable: HTMLDivElement;

  #caret: Caret;

  #debug: HTMLDivElement;

  #wrapper: HTMLDivElement;

  #imeElement: HTMLElement;

  state: SelectionState;

  #range: Range;

  #grid: Location[];

  constructor(editor: EditorElement) {
    super();
    this.#grid = [];
    this.#imeElement = document.createElement('u');
    this.#debug = document.createElement('div');
    this.editor = editor;
    this.#contentEditable = document.createElement('div');
    this.#contentEditable.contentEditable = 'true';
    this.#contentEditable.addEventListener<any>('textInput', this.textInput);
    this.#contentEditable.addEventListener('compositionstart', e => {
      // console.log('this.editor', this.editor);
      const event = new InputEvent('insertCompositionText', e);
      Object.assign(event, { compositonType: 'compositionstart', editor: this.editor });
      this.#contentEditable.dispatchEvent(new SelectionInputEvent('insertCompositionText', event as never));
    });
    this.#contentEditable.addEventListener('compositionupdate', e => {
      const event = new InputEvent('insertCompositionText', e);
      Object.assign(event, { compositonType: 'compositionupdate', editor: this.editor });
      this.#contentEditable.dispatchEvent(new SelectionInputEvent('insertCompositionText', event as never));
    });
    this.#contentEditable.addEventListener('compositionend', e => {
      const event = new InputEvent('insertCompositionText', e);
      if (this.#imeElement.textContent?.length || 0 > 1) {
        Object.assign(event, { compositonType: 'compositionupdate', editor: this.editor });
        this.#contentEditable.dispatchEvent(new SelectionInputEvent('insertCompositionText', event as never));
        for (let i = 1; i < e.data.length; i += 1) {
          Object.assign(event, { compositonType: 'compositionstart', editor: this.editor });
          this.#contentEditable.dispatchEvent(new SelectionInputEvent('insertCompositionText', event as never));
        }
        Object.assign(event, { compositonType: 'compositionend', editor: this.editor });
        this.#contentEditable.dispatchEvent(new SelectionInputEvent('insertCompositionText', event as never));
      }
    });
    this.#contentEditable.addEventListener('beforeinput', (e: any) => {
      const event = e as InputEvent;
      event.preventDefault();
      const { inputType } = event;
      // const customEvent = new InputEvent(inputType as never, e);
      Object.assign(event, { editor: this.editor });
      if (inputType !== 'insertCompositionText') {
        this.#contentEditable.dispatchEvent(new SelectionInputEvent(inputType as never, event as never));
      }
      // if (inputType === 'deleteContentBackward') {
      //   this.#contentEditable.dispatchEvent(new SelectionInputEvent(inputType, e));
      // }
    });
    window.addEventListener('resize', () => {
      // Grid.create(this.editor);
      this.render();
    });
    // this.#textArea.style.width = '0px';
    // this.#textArea.style.height = '0px';
    this.#contentEditable.style.lineHeight = '1';
    // this.#textArea.style.padding = '0px';
    // this.#textArea.style.border = 'none';
    // this.#textArea.style.whiteSpace = 'nowrap';
    // this.#textArea.style.width = '1em';
    this.#contentEditable.style.overflow = 'auto';
    this.#contentEditable.style.position = 'fixed';
    // this.#textArea.style.resize = 'vertical';

    this.state = initialSelectState;
    this.#wrapper = document.createElement('div');
    this.#wrapper.style.position = 'relative';
    this.#wrapper.style.width = '100%';
    this.#wrapper.style.height = '100%';

    this.appendChild(this.#wrapper);
    this.appendChild(this.#contentEditable);

    this.#caret = new Caret();
    this.#range = new Range();

    this.editor.addEventListener('mousedown', e => {
      this.mousedown(e, editor);
    });

    this.editor.wrapper.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        this.modify('move', 'right', 'character');
      }
      if (e.key === 'ArrowUp') {
        this.modify('move', 'up', 'character');
      }
      if (e.key === 'ArrowDown') {
        this.modify('move', 'down', 'character');
      }
      if (e.key === 'ArrowLeft') {
        this.modify('move', 'left', 'character');
      }
    });
  }

  static get observedAttributes() {
    return ['height', 'width', 'top', 'left'];
  }

  get grid() {
    return this.#grid;
  }

  set grid(data: Location[]) {
    this.#grid = data;
    // Selection(this.editor);
  }

  get imeElement() {
    return this.#imeElement;
  }

  textInput(e: SelectionInputEvent) {
    console.log('textInput', e);
    const { editor, compositonType, inputType } = e;
    const state = editor?.Selection.state;
    const imeElement = editor?.Selection.imeElement;
    if (!state?.anchorNode) return;
    if (!editor) return;
    switch (inputType) {
      case 'insertText':
        if (state.anchorNode) {
          const nodeKey = editor.weakMap.get(state.anchorNode);
          const splitText = nodeKey?.text?.split('');
          if (nodeKey && state.location && state.location.text) {
            const text = e.data;
            state.location.text = text;
            nodeKey.text = [...(splitText?.slice(0, state.anchorOffset || 0) || []), e.data, ...(splitText?.slice(state.anchorOffset || 0, splitText.length) || [])].join('');
            window.requestIdleCallback(() => {
              editor.render();
              window.requestIdleCallback(() => {
                editor.Selection.modify('move', 'right', 'character');
              });
            });
          }
        }
        break;
      case 'deleteContentBackward':
        {
          const nodeKey = editor.weakMap.get(state.anchorNode);
          const splitText = nodeKey?.text?.split('');
          if (nodeKey && state.location && state.location.text) {
            const text = e.data;
            state.location.text = text;
            nodeKey.text = [...(splitText?.slice(0, state.anchorOffset || 0) || []), ...(splitText?.slice((state.anchorOffset || 0) + 1 || 0, splitText.length) || [])].join('');
            // nodeKey.text = 'ㅁ';
            window.requestIdleCallback(() => {
              editor.render();
              // editor.Selection.setState({
              //   ...state,
              // });
              // editor.Selection.modify('move', 'right', 'character');
              editor.Selection.modify('move', 'left', 'character');
            });
          }
        }
        break;
      default:
        break;
    }
    if (!imeElement) return;
    switch (compositonType) {
      case 'compositionstart':
        window.requestIdleCallback(() => {
          editor.render();
          // editor.Selection.modify('move', 'right', 'character');
          window.requestIdleCallback(() => {
            // const nodeKey = editor.weakMap.get(state.anchorNode);
            console.log('com', state.anchorNode);
            const textNode = state.anchorNode?.firstChild as Text;
            const split = textNode.splitText(state.anchorOffset || 0) as Node;
            console.log('split', split);
            state?.anchorNode?.insertBefore(imeElement, split);
          });
        });

        break;
      case 'compositionupdate':
        imeElement.textContent = e.data || '';
        break;
      case 'compositionend':
        // window.requestIdleCallback(() => {
        //   editor.render();
        //   // window.requestIdleCallback(() => {
        //   //   // editor.Selection.modify('move', 'right', 'character');
        //   //   editor.Selection.modify('move', 'right', 'character');
        //   // });
        // });
        {
          const nodeKey = editor.weakMap.get(state.anchorNode);
          console.log('nodeKey', nodeKey, state.anchorNode);
          const splitText = nodeKey?.text?.split('');
          if (nodeKey && state.location && state.location.text) {
            // const text = imeElement.textContent?.trimEnd() || '';
            const text = imeElement.textContent?.trimEnd() || '';
            // console.log('text', text);
            imeElement.remove();
            // console.log('text', text.trimEnd());
            state.location.text = text;
            nodeKey.text = [...(splitText?.slice(0, state.anchorOffset || 0) || []), text, ...(splitText?.slice(state.anchorOffset || 0, splitText.length) || [])].join('');
            // console.log('nodeKey', nodeKey);
          }
          imeElement.textContent = '';
          console.log('currentTarget', e);
          (e.currentTarget as HTMLDivElement).textContent = '';
          editor.Selection.modify('move', 'right', 'character');
          // console.log('this.editor.weakMap', editor.weakMap);
        }
        break;
      default:
        break;
    }
    // console.log('test.e', e);
    // const { inputType, compos } = e;
    // if(e === '')
    // console.log('input', e);
  }

  render() {
    if (this.state.type === 'Caret') {
      // this.removeChild(this.#range);
      this.#caret.setAttribute('top', `${this.state.location?.top}px`);
      this.#caret.setAttribute('left', `${this.state.location?.left}px`);
      this.#caret.setAttribute('width', `${this.state.location?.text ? this.state.location?.width : '5'}px`);
      this.#caret.setAttribute('height', `${this.state.location?.height}px`);
      this.#wrapper.appendChild(this.#caret);
    } else {
      // this.removeChild(this.#caret)
    }
    this.editor.focus();
    window.requestAnimationFrame(() => {
      if (this.state.anchorNode) {
        this.editor.wrapper.after(this.#debug);
        this.#debug.innerText = JSON.stringify(this.state, null, 2);
        // this.editor.render();
        // Grid.create(this.editor);
        // const nodeKey = this.editor.weakMap.get(this.state.anchorNode);
        // this.#textArea.value = nodeKey?.text || '';
        // this.#textArea.selectionStart = this.state.anchorOffset || 0;
        // this.#textArea.selectionEnd = this.state.anchorOffset || 0;
      }
      this.#contentEditable.focus();
      Grid.create(this.editor);
    });
  }

  modify(alter: 'move' | 'extend', direction: 'left' | 'right' | 'up' | 'down', granularity: 'character' | 'word' | 'sentence' | 'line' | 'paragraph') {
    if (typeof this.state.focusIndex !== 'number') return;
    const { grid, state } = this;
    if (typeof state.focusIndex === 'number' && typeof state.anchorIndex === 'number') {
      let focusIdx = state.focusIndex;
      let anchorIdx = state.anchorIndex;
      let moveIdx = 1;

      if (direction === 'left') {
        moveIdx *= -1;
      }

      if (granularity === 'word') {
        const cell = grid[focusIdx];
        moveIdx = (cell.node.textContent?.length || 0) - (cell.offset || 0);
      }

      if (alter === 'move') {
        if (['left', 'right'].includes(direction)) {
          focusIdx += moveIdx;
          anchorIdx += moveIdx;
          if (state?.position) {
            delete state.position;
          }
        }
        if (['up', 'down'].includes(direction)) {
          if (state.location) {
            if (!state?.position) {
              state.position = state.location;
            }
            moveIdx = direction === 'up' ? -1 : 1;
            const line = grid.filter(cell => cell.line === moveIdx + (state?.location?.line || 0));
            const { x, y } = state.position;
            const lineCell = line.findLast(cell => cell.left <= x && cell.right >= x);
            if (lineCell) {
              const Idx = grid.findIndex(cell => Object.isEquals(cell, lineCell));
              anchorIdx = Idx;
              focusIdx = Idx;
            }
          }
        }
      }

      if (alter === 'extend') {
        if (['left', 'right'].includes(direction)) {
          focusIdx += moveIdx;
          anchorIdx = moveIdx;
        }
      }

      this.setState({
        ...state,
        anchorOffset: grid[anchorIdx].offset,
        anchorNode: grid[anchorIdx].node,
        anchorIndex: anchorIdx,
        focusOffset: grid[focusIdx].offset,
        focusNode: grid[focusIdx].node,
        focusIndex: focusIdx,
        location: grid[focusIdx],
        isCollased: alter !== 'move',
        type: alter === 'move' ? 'Caret' : 'Range',
      });
    }
  }

  setState(value: SelectionState) {
    this.state = {
      ...this.state,
      ...value,
    };
    this.render();
  }

  mousedown(e: MouseEvent, editor: EditorElement) {
    // console.log(e);
    const { grid, setState } = this;
    // console.log(editor);
    const x = editor.wrapper.scrollLeft + e.offsetX;
    const y = editor.wrapper.scrollTop + e.offsetY;
    const Idx = grid.findIndex(cell => cell.top < y && cell.bottom > y && cell.left < x && cell.right > x);
    if (Idx !== -1) {
      this.setState({
        ...this.state,
        anchorOffset: grid[Idx].offset,
        anchorNode: grid[Idx].node,
        anchorIndex: Idx,
        focusOffset: grid[Idx].offset,
        focusNode: grid[Idx].node,
        focusIndex: Idx,
        location: grid[Idx],
        isCollased: false,
        type: 'Caret',
      });
    }
    // const row = grid.find(row => row.top < y && row.bottom > y && row.left < x && row.right > x);
    // if (row) {
    //   const cell = row.cell.find(cell => cell.top < y && cell.bottom > y && cell.left < x && cell.right > x);
    //   console.log('cell', cell?.text);
    //   if (cell) {
    //     // editor.Caret.setAttribute('top', `${cell.top}px`);
    //     // editor.Caret.setAttribute('left', `${cell.left}px`);
    //     // editor.Caret.setAttribute('width', `${cell.width}px`);
    //     // editor.Caret.setAttribute('height', `${cell.height}px`);
    //   }
    // }
  }

  connectedCallback(): void {
    this.style.position = 'absolute';
    this.style.inset = '0';
    this.style.width = '100%';
    this.style.height = '100%';
    this.style.zIndex = '-1';
    // this.style.width = '5px';
    // // this.style.height = `21px`;
    // this.style.position = 'absolute';
    // this.style.backgroundColor = 'rgba(100,100,100,0.75)';
    // this.style.borderColor = '#000000';
    // this.style.userSelect = 'none';
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
export default Selection;
