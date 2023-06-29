import { EditorElement } from 'components';

/* eslint-disable no-useless-constructor */
class Range extends globalThis.Range {
  editor: EditorElement;

  constructor(editor: EditorElement) {
    super();
    this.editor = editor;
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
    if (range) {
      this?.setStart(range.startContainer, range.startOffset);
      this?.setEnd(range.endContainer, range.endOffset);
    }
  }
}

export default Range;
