/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Location } from 'core/Grid';

import { EditorElement } from 'components';
export interface WhiteSpace {
  left: number;
  nowrap: boolean;
}

const Cell = {
  create: (editor: EditorElement, row: Location, nextKey: string, whiteSpace: WhiteSpace = { left: 0, nowrap: false }) => {
    const { weakMap } = editor;
    const cloneNode = row.node.cloneNode(true);
    // console.log('row.node', row.node);
    let sum = 0;
    const columns: Location[] = [];
    if (cloneNode.firstChild instanceof Text) {
      const text = cloneNode.firstChild;
      if (nextKey !== row.key) {
        // console.log('??', row.node);
        whiteSpace.left = 0;
        whiteSpace.nowrap = false;
      }
      const textArr = text.textContent?.substring(whiteSpace.left, text.textContent.length).split('') || [];
      // console.log('textArr', textArr);
      /**
       * left 텍스트 시작
       * nowrap: 텍스트가 한줄이면 true 아니면 false
       */
      textArr.every((char, i) => {
        cloneNode.textContent = char;
        const { width } = Cell.getTextWidth(char, row.node as Element);
        if (row.left + sum + width > editor.view.offsetWidth) {
          whiteSpace.left = i;
          whiteSpace.nowrap = false;
          return false;
        }
        const column = {
          ...row,
          last: false,
          left: row.left + sum,
          x: row.left + sum,
          right: row.left + sum + width,
          width: width,
          text: char,
          offset: i,
        };
        columns.push(column);
        sum += width;
        whiteSpace.left = 0;
        whiteSpace.nowrap = true;
        return true;
      });
    }
    return {
      columns,
      whiteSpace,
    };
  },
  getTextWidth: (text: string, element: Element) => {
    const offscreen = new OffscreenCanvas(0, 0);
    const context = offscreen.getContext('2d')!;
    const style = window.getComputedStyle(element);
    const font = style.getPropertyValue('font');
    context.font = `${font}`;
    const size = context.measureText(text);
    return { width: size.width };
  },
  testBlock: (editor: EditorElement, column: Location) => {
    const div = document.createElement('div');
    div.dataset.caretArea = 'true';
    div.style.position = 'absolute';
    div.style.zIndex = '-1';
    div.style.top = `${column.top}px`;
    div.style.left = `${column.left}px`;
    div.style.width = `${column.width}px`;
    div.style.height = `${column.height}px`;
    div.style.borderRight = '1px solid';
    // div.dataset.content = column.node.textContent || '';
    div.dataset.content = column.text || column.node.nodeName.toLowerCase();
    div.style.backgroundColor = `rgba(33, 150, 243, 0.5)`;
    editor.wrapper.appendChild(div);
  },
};

export default Cell;
