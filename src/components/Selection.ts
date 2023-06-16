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
import { IS_COMPOSING, IS_COMPOSING_STATE } from 'utils';

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
    this.#contentEditable.addEventListener('blur', e => {
      if (editor) {
        IS_COMPOSING.set(editor, false);
      }
    });
    this.#contentEditable.addEventListener('keydown', e => {
      // const event = new InputEvent('InsertKey', e);
      // Object.assign(event, { compositonType: undefined, editor: this.editor });
      // this.#contentEditable.dispatchEvent(
      //   new SelectionInputEvent('InsertKey', {
      //     ...event,
      //   } as never),
      // );
      // console.log('keyDown', e);
    });
    this.#contentEditable.addEventListener<any>('textInput', this.textInput);
    this.#contentEditable.addEventListener('compositionstart', e => {
      const event = new InputEvent('insertCompositionText', e);
      Object.assign(event, { compositonType: 'compositionstart', editor: this.editor });
      this.#contentEditable.dispatchEvent(new SelectionInputEvent('insertCompositionText', event as never));
    });
    this.#contentEditable.addEventListener('compositionupdate', e => {
      const event = new InputEvent('insertCompositionText', e);
      if (e.data.length > 1 === false) {
        Object.assign(event, { compositonType: 'compositionupdate', editor: this.editor });
        this.#contentEditable.dispatchEvent(new SelectionInputEvent('insertCompositionText', event as never));
      }
    });
    this.#contentEditable.addEventListener('compositionend', e => {
      const event = new InputEvent('insertCompositionText', e);
      console.log('edatalength', e.data.length, e.data);
      // ios
      if (e.data.length > 1) {
        // Object.assign(event, { compositonType: 'compositionupdate', editor: this.editor });
        // this.#contentEditable.dispatchEvent(new SelectionInputEvent('insertCompositionText', event as never));
        // console.log('end', this.#imeElement.textContent, this.#contentEditable.textContent, data);
        this.#contentEditable.dispatchEvent(
          new SelectionInputEvent('insertCompositionText', {
            ...event,
            compositonType: 'compositionend',
            editor: this.editor,
            data: e.data[0],
          } as never),
        );
        this.#contentEditable.dispatchEvent(
          new SelectionInputEvent('insertText', {
            ...event,
            compositonType: undefined,
            editor: this.editor,
            isComposing: true,
            data: e.data[1],
          } as never),
        );
        this.state = IS_COMPOSING_STATE.get(this.editor)!;
        IS_COMPOSING.set(this.editor, false);
      } else {
        // window
        Object.assign(event, { compositonType: 'compositionend', editor: this.editor });
        this.#contentEditable.dispatchEvent(new SelectionInputEvent('insertCompositionText', event as never));
      }
    });
    this.#contentEditable.addEventListener('beforeinput', (e: any) => {
      const event = e as InputEvent;
      event.preventDefault();
      const { inputType } = event;
      console.log('beforeInput', e);
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
    // console.log('textInput', e);
    const { editor, compositonType, inputType } = e;
    const state = editor?.Selection.state;
    const imeElement = editor?.Selection.imeElement;
    let isComposing = e.isComposing;
    if (!state?.anchorNode) return;
    if (!editor) return;
    if (IS_COMPOSING.get(editor) === true) {
      isComposing = true;
    }
    if (compositonType === 'compositionstart') {
      IS_COMPOSING.set(editor, true);
    } else if (compositonType === undefined) {
      IS_COMPOSING.set(editor, false);
    }
    console.log('inputType', inputType, e);
    // IS_COMPOSING_STATE.delete(editor);
    switch (inputType) {
      case 'insertText':
        if (state.anchorNode) {
          const nodeKey = editor.weakMap.get(state.anchorNode);
          const splitText = nodeKey?.text?.split('');
          if (nodeKey && state.location && state.location.text) {
            const text = e.data;
            state.location.text = text;
            if (isComposing) {
              nodeKey.text = [...(splitText?.slice(0, (this.state.anchorOffset || 0) + 1) || []), e.data, ...(splitText?.slice((this.state.anchorOffset || 0) + 1, splitText.length) || [])].join('');
            } else {
              nodeKey.text = [...(splitText?.slice(0, state.anchorOffset || 0) || []), e.data, ...(splitText?.slice(state.anchorOffset || 0, splitText.length) || [])].join('');
            }
            editor.render().then(data => {
              // console.log('insertTextRender');
              editor.Selection.modify('move', 'right', 'character');
              // if (isComposing) {
              // editor.Selection.modify('move', 'right', 'character');
              // }
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
            editor.render().then(() => {
              editor.Selection.modify('move', 'left', 'character');
            });
          }
        }
        break;
      default:
        break;
    }
    if (!imeElement) return;
    // console.log('compositonType', compositonType);
    switch (compositonType) {
      case 'compositionstart':
        if (IS_COMPOSING_STATE.has(editor)) {
          const state = IS_COMPOSING_STATE.get(editor);
          console.log('is', state);
          if (state) {
            const newState = {
              ...state,
              anchorOffset: isComposing ? (state.anchorOffset || 0) + 1 : state.anchorOffset,
            };
            IS_COMPOSING_STATE.set(editor, newState);
          }
        }
        Grid.imeUpdate(editor);
        if (IS_COMPOSING_STATE.has(editor) === false) {
          IS_COMPOSING_STATE.set(editor, state);
          // this.state = state;
        }
        break;
      case 'compositionupdate':
        imeElement.textContent = e.data || '';
        Grid.insert(editor);
        break;
      case 'compositionend':
        {
          const state = IS_COMPOSING_STATE.get(editor);
          if (state) {
            this.state = state;
            const nodeKey = editor.weakMap.get(state.anchorNode!);
            const splitText = nodeKey?.text?.split('');
            if (nodeKey && state.location && state.location.text) {
              const text = imeElement.textContent?.trimEnd() || '';
              imeElement.remove();
              nodeKey.text = [...(splitText?.slice(0, state.anchorOffset || 0) || []), text, ...(splitText?.slice(state.anchorOffset || 0, splitText.length) || [])].join('');
            }
            (e.currentTarget as HTMLDivElement).textContent = '';
            editor.render().then(() => {
              editor.Selection.modify('move', 'right', 'character');
            });
          }
        }
        break;
      default:
        break;
    }
  }

  render() {
    return new Promise(resolve => {
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
      if (this.state.anchorNode) {
        this.editor.wrapper.after(this.#debug);
        this.#debug.innerText = JSON.stringify(this.state, null, 2);
      }
      Grid.create(this.editor).then(data => {
        this.#contentEditable.focus();
        resolve(data);
      });
    });
  }

  modify(alter: 'move' | 'extend', direction: 'left' | 'right' | 'up' | 'down', granularity: 'character' | 'word' | 'sentence' | 'line' | 'paragraph') {
    if (typeof this.state.focusIndex !== 'number') return;
    const { grid, state } = this;
    if (typeof this.state.focusIndex === 'number' && typeof this.state.anchorIndex === 'number') {
      let focusIdx = this.state.focusIndex;
      let anchorIdx = this.state.anchorIndex;
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
          if (this.state?.position) {
            delete this.state.position;
          }
        }
        if (['up', 'down'].includes(direction)) {
          if (this.state.location) {
            if (!this.state?.position) {
              this.state.position = this.state.location;
            }
            moveIdx = direction === 'up' ? -1 : 1;
            const line = grid.filter(cell => cell.line === moveIdx + (this.state?.location?.line || 0));
            const { x, y } = this.state.position;
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
        ...this.state,
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

  async setState(value: SelectionState) {
    // const oriState = this.state;
    this.state = {
      ...this.state,
      ...value,
    };
    this.render().then(() => {
      // IS_COMPOSING_STATE.set(this.editor, oriState);
    });
  }

  mousedown(e: MouseEvent, editor: EditorElement) {
    // console.log(e);
    const { grid } = this;
    // console.log(editor);
    const x = editor.wrapper.scrollLeft + e.offsetX;
    const y = editor.wrapper.scrollTop + e.offsetY;
    const Idx = this.grid.findIndex(cell => cell.top < y && cell.bottom > y && cell.left < x && cell.right > x);
    if (Idx !== -1) {
      this.setState({
        ...this.state,
        anchorOffset: this.grid[Idx].offset,
        anchorNode: this.grid[Idx].node,
        anchorIndex: Idx,
        focusOffset: this.grid[Idx].offset,
        focusNode: this.grid[Idx].node,
        focusIndex: Idx,
        location: this.grid[Idx],
        isCollased: false,
        type: 'Caret',
      });
    }
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
