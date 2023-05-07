/* eslint-disable no-param-reassign */
import Row, { RowLocation } from 'core/Row';

import Cell from './Cell';

import { EditorElement } from 'components';
import { EditorNode, FiberNodeWeakMap } from 'components/Editor';

/**
 * 실제로 화면에 출력되는 노드
 */
export type ViewNode = Node | HTMLElement | Text;

export interface Location {
  order: number;
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

const Grid = {
  create: (editor: EditorElement) => {
    const { weakMap } = editor;
    const grid: GridLocation[] = [];
    window.requestAnimationFrame(() => {
      const editorRect = editor.getBoundingClientRect();
      const walker = document.createTreeWalker(editor.view, NodeFilter.SHOW_ELEMENT, {
        acceptNode: function (node) {
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      let order = 0;
      while (walker.nextNode()) {
        const node = walker.currentNode as Element;
        if (['span', 'br'].includes(node.nodeName.toLowerCase())) {
          // const key = weakMap.get(Array.from(node.childNodes).find(item => item.nodeName === '#text') as never)?.key;
          const key = weakMap.get(walker.currentNode)?.key;
          if (key) {
            const { x, y, top, left, width, height, right, bottom } = node.getBoundingClientRect();
            grid.push({
              key,
              order,
              x: x - editorRect.x,
              y: y - editorRect.y,
              top: top - editorRect.top,
              left: left - editorRect.left,
              width,
              height,
              right: right - editorRect.left,
              bottom: bottom - editorRect.top,
              last: !!walker.currentNode.parentElement?.lastChild?.isEqualNode(walker.currentNode) || walker.currentNode.nodeName.toLowerCase() === 'br',
              node: walker.currentNode,
            });
            order += 1;
          }
        }
      }
      console.log('grid', grid);
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
      // Grid.forEach(column => {
      //   if (column.last) Cell.testBlock(editor, column);
      // });
      // console.log('Grid', Grid);
      // console.log('row', row);
      editor.Selection.grid = Grid;
      // editor.addObserver((e: any) => {
      //   console.log('observer', e);
      // });
    });

    return false;
  },
};

export default Grid;
