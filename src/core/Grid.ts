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
}

export type GridLocation = Location;
// export interface GridLocation extends Location {
//   row?: RowLocation[];
// }

const Grid = {
  create: (editor: EditorElement) => {
    const { weakMap, FiberNodeMap } = editor;
    const grid: GridLocation[] = [];
    window.requestAnimationFrame(() => {
      console.log('실행', FiberNodeMap);
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
          const range = new Range();
          if (node.firstChild) {
            const length = node.firstChild.textContent?.length || 0;
            for (let i = 0; i < length; i += 1) {
              range.setStart(node.firstChild, i);
              range.setEnd(node.firstChild, i + 1);
              const { x, y, top, left, width, height, right, bottom } = range.getBoundingClientRect();
              const key = weakMap.get(node)?.key;
              if (key) {
                grid.push({
                  key,
                  x: x - editorRect.x,
                  y: y - editorRect.y,
                  top: top - editorRect.top,
                  left: left - editorRect.left,
                  width,
                  height,
                  right: right - editorRect.left,
                  bottom: bottom - editorRect.top,
                  node: walker.currentNode,
                  offset: i,
                  text: range.toString(),
                });
                if (length - 1 === i) {
                  if (!node.nextElementSibling) {
                    grid.push({
                      key,
                      x: x - editorRect.x,
                      y: y - editorRect.y,
                      top: top - editorRect.top,
                      left: left + grid[grid.length - 1].width - editorRect.left,
                      width: editor.offsetWidth - (left + grid[grid.length - 1].width),
                      height,
                      right: editor.offsetWidth - left,
                      bottom: bottom - editorRect.top,
                      node: walker.currentNode,
                    });
                  }
                }
              }
            }
          } else {
            range.setStart(node, 0);
            range.setEnd(node, 0);
            const { x, y, top, left, width, height, right, bottom } = node.getBoundingClientRect();
            // 해당코드 작업해야함
            grid.push({
              key: weakMap.get(node)?.key || '',
              x: x - editorRect.x,
              y: y - editorRect.y,
              top: top - editorRect.top,
              left: left - editorRect.left,
              width: editor.offsetWidth - left,
              height,
              right: left - editorRect.left + editor.offsetWidth - left,
              bottom: bottom - editorRect.top,
              node: walker.currentNode,
            });
          }
        }
      }
      grid.forEach(column => {
        // Cell.testBlock(editor, column);
      });
      editor.Selection.grid = grid;
      // editor.addObserver((e: any) => {
      //   console.log('observer', e);
      // });
    });

    return false;
  },
};

export default Grid;
