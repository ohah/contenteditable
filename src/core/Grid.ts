import Row, { RowLocation } from 'core/Row';

import { EditorElement } from 'components';
import { EditorNode, FiberNodeWeakMap } from 'components/editor';

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
}

export type GridLocation = Location[];
// export interface GridLocation extends Location {
//   row?: RowLocation[];
// }

const Grid = {
  create: (editor: EditorElement) => {
    const { weakMap } = editor;
    const grid: GridLocation = [];
    window.requestAnimationFrame(() => {
      const walker = document.createTreeWalker(editor.view, NodeFilter.SHOW_ELEMENT, {
        acceptNode: function (node) {
          return NodeFilter.FILTER_ACCEPT;
          // console.log('node.nodeName', node.nodeName);
          // if (['span', 'br'].includes(node.nodeName.toLowerCase())) return NodeFilter.FILTER_ACCEPT;
          // return NodeFilter.FILTER_REJECT;
        },
      });
      while (walker.nextNode()) {
        const node = walker.currentNode as Element;
        if (['span', 'br'].includes(node.nodeName.toLowerCase())) {
          const key = weakMap.get(Array.from(node.childNodes).find(item => item.nodeName === '#text') as never)?.key;
          if (key) {
            const { x, y, top, left, width, height, right, bottom } = node.getBoundingClientRect();
            grid.push({
              key,
              x,
              y,
              top,
              left,
              width,
              height,
              right,
              bottom,
            });
          }
          console.log('walker', walker.currentNode, node.getBoundingClientRect());
        }
      }
      console.log('grid', grid);
      const row = Row.create(editor, grid);
      console.log('row', row);
      editor.addObserver((e: any) => {
        console.log('observer', e);
      });
    });

    return false;
  },
};

export default Grid;
