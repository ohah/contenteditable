import { EditorElement } from 'components';

/* eslint-disable no-useless-constructor */
class Range extends globalThis.Range {
  editor: EditorElement;

  constructor(editor: EditorElement) {
    super();
    this.editor = editor;
  }

  set setRange(range: globalThis.Range) {
    this.setStart(range.startContainer, range.startOffset);
    this.setEnd(range.endContainer, range.endOffset);
  }

  modify(alter: 'move' | 'extend', direction: 'left' | 'right' | 'up' | 'down', granularity: 'character' | 'word' | 'sentence' | 'line' | 'paragraph') {
    this.setStart(this.startContainer, this.startOffset);
    this.setEnd(this.startContainer, this.startOffset + 1);
    // this.editor.Selection.setState = {
    //     ...this.editor.Selection.state,
    // }
    this.editor.Selection.render();

    // globalThis.getSelection()?.addRange(this);

    // globalThis.getSelection()?.modify('');
  }

  move() {
    globalThis.getSelection()?.addRange(this);
    globalThis.getSelection()?.modify('extend', 'forward', 'character');
    const range = globalThis.getSelection()?.getRangeAt(0).cloneRange();
    const editorRect = this.editor.getBoundingClientRect();
    console.log(editorRect);
    if (range) {
      // console.log('range', range);
      this?.setStart(range.startContainer, range.startOffset);
      this?.setEnd(range.endContainer, range.endOffset);
      const { top, left, x, y, right, width, height, bottom } = this.getBoundingClientRect();
      this.editor.Selection.setState = {
        ...this.editor.Selection.state,
        location: {
          ...this.editor.Selection.state.location,
          line: 0,
          key: this.editor.weakMap.get(this.startContainer)?.key || '',
          x: x - editorRect.x,
          y: y - editorRect.y,
          top: top - editorRect.top,
          left: left - editorRect.left,
          width,
          height,
          right: right - editorRect.left,
          bottom: bottom - editorRect.top,
          node: this.startContainer,
          offset: this.startOffset,
          text: range.toString(),
          range,
        },
      };
    }
  }
}

export default Range;
