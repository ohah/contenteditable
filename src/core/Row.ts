import { Cell } from 'core';
import { GridLocation } from 'core/Grid';
import { Location } from 'core/Grid';

import { EditorElement } from 'components';

export interface RowLocation extends Location {
  line: number;
  key: string;
  cell: Location[];
}

const Row = {
  create: (editor: EditorElement, grid: GridLocation[]) => {
    let currTop = 0;
    let line = 1;
    let whiteSpace = {
      left: 0,
      nowrap: false,
    };
    const row = grid.map((row, i) => {
      if (currTop === 0 && row.top === 0) currTop = row.top;
      if (row.top > currTop) {
        currTop = row.top;
        line += 1;
      }
      const lineRow = {
        line,
        ...row,
        cell: [],
      } as never as RowLocation;
      lineRow.width = row.node.nodeName.toLowerCase() === 'br' ? editor.offsetWidth - lineRow.right : lineRow.width;
      lineRow.right = row.node.nodeName.toLowerCase() === 'br' ? editor.offsetWidth - lineRow.right : lineRow.right;
      const nextKey = grid[i + 1];
      const { columns, whiteSpace: newWhiteSpace } = Cell.create(editor, row, nextKey?.key, whiteSpace);
      whiteSpace = {
        ...newWhiteSpace,
      };
      // console.log('row', row, whiteSpace);
      lineRow.cell = columns;
      return lineRow;
    });
    return row;
  },
};

export default Row;
