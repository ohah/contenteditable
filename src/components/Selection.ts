/* eslint-disable prefer-destructuring */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import Grid, { Location } from 'core/Grid';
import { initialSelectState, SelectionState, State } from 'core/State';

import { Caret, Range } from 'components';
import { define } from 'components/default';
import EditorElement from 'components/Editor';
import { json2EditorNode } from 'utils';

@define('editor-selection')
class Selection extends HTMLElement {
  interval: ReturnType<typeof setInterval> | undefined;

  editor: EditorElement;

  #textArea: HTMLTextAreaElement;

  #caret: Caret;

  #debug: HTMLDivElement;

  #wrapper: HTMLDivElement;

  state: SelectionState;

  #range: Range;

  #grid: Location[];

  constructor(editor: EditorElement) {
    super();
    this.#grid = [];
    this.#debug = document.createElement('div');
    this.editor = editor;
    this.#textArea = document.createElement('textarea');
    this.#textArea.addEventListener('input', (e: any) => {
      const event = e as InputEvent;
      const { inputType } = event;
      if (inputType === 'insertText') {
        if (this.state.anchorNode) {
          const nodeKey = this.editor.weakMap.get(this.state.anchorNode);
          const splitText = nodeKey?.text?.split('');
          console.log('splitText', nodeKey);
          if (nodeKey && this.state.location) {
            const text = e.data;
            this.state.location.text = text;
            nodeKey.text = e.data;
            // const text = [...(splitText?.slice(0, this.state.anchorOffset || 0) || []), e.data, ...(splitText?.slice(this.state.anchorOffset || 0, splitText.length) || [])].join('');
            // console.log('test', [...(splitText?.slice(0, this.state.anchorOffset || 0) || []), e.data, ...(splitText?.slice(this.state.anchorOffset || 0, splitText.length) || [])].join(''));
            // this.state.location.text = text;
            nodeKey.text = [...(splitText?.slice(0, this.state.anchorOffset || 0) || []), e.data, ...(splitText?.slice(this.state.anchorOffset || 0, splitText.length) || [])].join('');
            // console.log(this.editor.weakMap);
          }
          this.editor.render();
          // this.setState({
          //   ...this.state,
          //   anchorOffset: grid[anchorIdx].offset,
          //   anchorNode: grid[anchorIdx].node,
          //   anchorIndex: anchorIdx,
          //   focusOffset: grid[focusIdx].offset,
          //   focusNode: grid[focusIdx].node,
          //   focusIndex: focusIdx,
          //   location: grid[focusIdx],
          //   isCollased: alter !== 'move',
          //   type: alter === 'move' ? 'Caret' : 'Range',
          // });

          this.state = {
            ...this.state,
            anchorOffset: (this.state.anchorOffset || 0) + 1,
            focusOffset: (this.state.focusOffset || 0) + 1,
          };
          // 커서이동작업중
          if (this.state.location) {
            const { grid } = this;
            this.state.location = {
              ...this.state.location,
              ...grid[(this.state.focusIndex || 0) + 1],
            };
          }
          this.render();
          // this.render;
          // window.requestAnimationFrame(() => {
          //   this.modify('move', 'backward', 'word');
          // });
          // window.getAn
          // this.modify('move', 'backward', 'character');
          // console.log('input', e, this.state.anchorNode);
          // const split = (this.state.anchorNode.firstChild as Text).splitText(this.state.anchorOffset || 0);
          // split.before(e.data || '');
          // console.log(this.state.anchorNode.firstChild, split.textContent);
          // this.state.anchorNode.normalize();
          // if (nodeKey) nodeKey.text = this.#textArea.value;
          // this.state.anchorNode.textContent = this.#textArea.value;
        }
      }
    });
    // this.#textArea.style.width = '0px';
    // this.#textArea.style.height = '0px';
    this.#textArea.style.lineHeight = '1';
    // this.#textArea.style.padding = '0px';
    // this.#textArea.style.border = 'none';
    // this.#textArea.style.whiteSpace = 'nowrap';
    // this.#textArea.style.width = '1em';
    this.#textArea.style.overflow = 'auto';
    // this.#textArea.style.resize = 'vertical';

    this.state = initialSelectState;
    this.#wrapper = document.createElement('div');
    this.#wrapper.style.position = 'relative';
    this.#wrapper.style.width = '100%';
    this.#wrapper.style.height = '100%';

    this.appendChild(this.#wrapper);
    this.appendChild(this.#textArea);
    // const [state, setState] = useState(initialSelectState);
    // setState({
    //   ...state,
    // });
    // this.State = state;
    this.#caret = new Caret();
    this.#range = new Range();
    this.editor.addEventListener('mousedown', e => {
      console.log('mousedown');
      this.mousedown(e, editor);
    });
    this.editor.wrapper.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        this.modify('move', 'backward', 'character');
      }
      if (e.key === 'ArrowLeft') {
        this.modify('move', 'forward', 'character');
      }
      // if (this.state.location?.key) {
      //   console.log('this.editor', this.editor);
      // }
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

  render() {
    if (this.state.type === 'Caret') {
      // this.removeChild(this.#range);
      this.#wrapper.appendChild(this.#caret);
      this.#caret.setAttribute('top', `${this.state.location?.top}px`);
      this.#caret.setAttribute('left', `${this.state.location?.left}px`);
      this.#caret.setAttribute('width', `${this.state.location!.width >= 1 ? this.state.location?.width : '5'}px`);
      this.#caret.setAttribute('height', `${this.state.location?.height}px`);
    } else {
      // this.removeChild(this.#caret)
    }
    this.editor.focus();
    window.requestAnimationFrame(() => {
      if (this.state.anchorNode) {
        this.editor.wrapper.after(this.#debug);
        this.#debug.innerText = JSON.stringify(this.state, null, 2);
        // const nodeKey = this.editor.weakMap.get(this.state.anchorNode);
        // this.#textArea.value = nodeKey?.text || '';
        // this.#textArea.selectionStart = this.state.anchorOffset || 0;
        // this.#textArea.selectionEnd = this.state.anchorOffset || 0;
      }
      this.#textArea.focus();
    });
  }

  modify(alter: 'move' | 'extend', direction: 'forward' | 'backward', granularity: 'character' | 'word' | 'sentence' | 'line' | 'paragraph') {
    if (typeof this.state.focusIndex !== 'number') return;
    const { grid } = this;
    if (typeof this.state.focusIndex === 'number' && typeof this.state.anchorIndex === 'number') {
      let focusIdx = this.state.focusIndex;
      let anchorIdx = this.state.anchorIndex;
      let moveIdx = 1;
      if (direction === 'forward') {
        moveIdx *= -1;
      }

      if (granularity === 'word') {
        const cell = grid[focusIdx];
        moveIdx = (cell.node.textContent?.length || 0) - (cell.offset || 0);
      }

      if (alter === 'move') {
        focusIdx += moveIdx;
        anchorIdx += moveIdx;
      }

      if (alter === 'extend') {
        focusIdx += moveIdx;
        anchorIdx = moveIdx;
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
    window.addEventListener('resize', () => {
      Grid.create(this.editor);
    });
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
