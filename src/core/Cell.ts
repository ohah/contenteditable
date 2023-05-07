/* eslint-disable no-restricted-syntax */
import { Location } from 'core/Grid';

import { EditorElement } from 'components';

const Cell = {
  create: (editor: EditorElement, row: Location) => {
    const { weakMap } = editor;
    // const cell = weakMap.get(row.node);
    const cloneNode = row.node.cloneNode(true);
    // editor.appendChild(cloneNode);
    console.log('cloneNode', row.node);
    let sum = 0;
    const columns: Location[] = [];
    if (cloneNode.firstChild instanceof Text) {
      const text = cloneNode.firstChild;
      const textArr = text.textContent?.split('') || [];
      textArr.forEach((char, i) => {
        cloneNode.textContent = char;
        const { width } = Cell.getTextWidth(char, row.node as Element);
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
        /**
         * 마지막 노드일때 하나 더 추가해줌.. 임시..
         */
        if (i === textArr.length - 1 && row.last === true) {
          const column = {
            ...row,
            last: true,
            left: row.left + sum,
            x: row.left + sum,
            right: editor.offsetWidth - sum,
            width: editor.offsetWidth - sum,
            text: char,
            offset: i,
          };
          columns.push(column);
          // Cell.testBlock(editor, column);
        }
      });
    }
    return columns;
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
    div.style.position = 'absolute';
    div.style.zIndex = '-1';
    div.style.top = `${column.top}px`;
    div.style.left = `${column.left}px`;
    div.style.width = `${column.width}px`;
    div.style.height = `${column.height}px`;
    div.style.borderRight = '1px solid';
    div.dataset.content = column.node.textContent || '';
    div.style.backgroundColor = `rgba(33, 150, 243, 0.5)`;
    editor.wrapper.appendChild(div);
  },
};

export default Cell;
