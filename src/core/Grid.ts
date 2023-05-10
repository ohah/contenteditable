/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
import { Cell } from 'core';
import Row, { RowLocation } from 'core/Row';

import { EditorElement } from 'components';

/**
 * 실제로 화면에 출력되는 노드
 */
export type ViewNode = Node | HTMLElement | Text;

export interface Location {
  whiteSpaceLine: number;
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  node: ViewNode;
  text?: string;
  offset?: number;
  /**
   * 해당 행의 노드가 마지막인지 아닌지 구분
   */
  last: boolean;
}

export interface GridLocation extends Location {
  last: boolean;
}
// export interface GridLocation extends Location {
//   row?: RowLocation[];
// }
function showLines(el: any) {
  const node = el,
    range = document.createRange(),
    len = el!.textContent!.length,
    texts = [];
  let hTracker: any = '';
  let y: any, oldY: any;
  range.selectNodeContents(el);
  range.collapse();
  hTracker = range.cloneRange();
  hTracker.setEnd(node, 1);
  oldY = hTracker.getBoundingClientRect().height;
  for (let n = 0; n < len; n += 1) {
    hTracker.setEnd(node, n);
    range.setEnd(node, n);
    y = hTracker.getBoundingClientRect().height;
    if (y > oldY || n === len - 1) {
      // Line changed, resume the previous range (not when at the end of the text)
      range.setEnd(node, n - (n !== len - 1));
      // Store the text of the line
      texts.push(range.toString());
      // Set the start of the range to the end of the previous line
      range.setStart(node, n + 1);
      oldY = y;
    }
  }
  console.log(texts);
}

const Grid = {
  create: (editor: EditorElement) => {
    const { weakMap } = editor;
    const grid: GridLocation[] = [];
    const test: any[] = [];
    window.requestAnimationFrame(() => {
      const editorRect = editor.getBoundingClientRect();
      const walker = document.createTreeWalker(editor.view, NodeFilter.SHOW_ELEMENT, {
        acceptNode: function (node) {
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      // const order = 0;
      while (walker.nextNode()) {
        const node = walker.currentNode as Element;
        if (['span', 'br'].includes(node.nodeName.toLowerCase())) {
          // const key = weakMap.get(Array.from(node.childNodes).find(item => item.nodeName === '#text') as never)?.key;
          // const t = showLines(node.firstChild);

          const range = new Range();
          if (node.firstChild) {
            range.selectNode(node.firstChild);
            // const cloneRange = range.cloneRange();
            const length = node.firstChild.textContent?.length || 0;
            // range.setEnd(node.firstChild, 1);
            const res = [];
            let k = 0;
            let str = '';
            for (let i = 1; i <= length; i += 1) {
              const rect = range.getClientRects();
              range.setStart(node.firstChild, i - 1);
              range.setEnd(node.firstChild, i);
              const { x, y, top, left, width, height, right, bottom } = range.getBoundingClientRect();
              test.push({
                key: weakMap.get(node)?.key,
                x: x - editorRect.x,
                y: y - editorRect.y,
                top: top - editorRect.top,
                left: left - editorRect.left,
                width,
                whiteSpaceLine: i,
                height,
                right: right - editorRect.left,
                bottom: bottom - editorRect.top,
                node: walker.currentNode,
              });
              // console.log(k, i);
              // // console.log('rect', rect);

              if (rect.length > 1) {
                console.log(range.toString());
                res.push(str);
                // res.push(node.firstChild.textContent?.substring(k, i));
                k = i;
              }
              str = range.toString();
            }
            // res.push(str);
            console.log('res', res);
          }
          // console.log('t', t);
          const key = weakMap.get(node)?.key;
          if (key) {
            //   const wordBreak = [];
            //   const words = (node as HTMLElement).innerText.split(' ');
            //   let beforeBreak = words[0];
            //   let height = (node as HTMLElement).offsetHeight;

            //   for (let i = 1; i < words.length; i += 1) {
            //     (node as HTMLElement).innerText += ' ' + words[i];
            //     if ((node as HTMLElement).offsetHeight > height) {
            //       height = (node as HTMLElement).offsetHeight;
            //       wordBreak.push(beforeBreak);
            //       beforeBreak = words[i];
            //     } else {
            //       beforeBreak += ' ' + words[i];
            //     }
            //   }

            //   wordBreak.push(beforeBreak);
            //   console.log(wordBreak);
            // const { x, y, top, left, width, height, right, bottom } = node.getBoundingClientRect();
            // console.log('node.getBoundingClientRect()', node.getClientRects());
            const rects = node.getClientRects();
            Array.from(rects).forEach((rect, i) => {
              const { x, y, top, left, width, height, right, bottom } = rect;
              grid.push({
                key,
                x: x - editorRect.x,
                y: y - editorRect.y,
                top: top - editorRect.top,
                left: left - editorRect.left,
                width,
                whiteSpaceLine: i,
                height,
                right: right - editorRect.left,
                bottom: bottom - editorRect.top,
                last: (!!walker.currentNode.parentElement?.lastChild?.isEqualNode(walker.currentNode) && rects.length === i - 1) || walker.currentNode.nodeName.toLowerCase() === 'br',
                node: walker.currentNode,
              });
            });
            // order += 1;
          }
        }
      }
      // console.log('grid', grid);
      console.log('test', test);
      test.forEach(column => {
        Cell.testBlock(editor, column);
      });
      // const result = Row.create(editor, grid);
      const row = Row.create(editor, grid);
      const Grid = row.reduce((acc: any[], curr: Partial<RowLocation>) => {
        if (curr.cell && curr.cell.length > 0) {
          return [...acc, ...curr.cell];
        }
        delete curr.cell;
        delete curr.line;
        return [...acc, curr];
      }, [] as Location[]) as Location[];
      // console.log('grid', Grid);
      Grid.forEach(column => {
        // if (column.last)
        // Cell.testBlock(editor, column);
      });
      // console.log('Grid', Grid);
      // console.log('row', row);
      editor.Selection.grid = test;
      // editor.addObserver((e: any) => {
      //   console.log('observer', e);
      // });
    });

    return false;
  },
};

export default Grid;
