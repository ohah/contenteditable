import { Cell } from 'core';
import { GridLocation } from 'core/Grid';

import { EditorElement } from 'components';

export interface RowLocation extends Location {
  line: number;
  key: string;
  cell: Location[];
}

const Row = {
  create: (editor: EditorElement, grid: GridLocation) => {
    const { weakMap } = editor;
    let currTop = 0;
    let line = 1;
    const row = grid.map(row => {
      if (currTop === 0) currTop = row.top;
      if (row.top > currTop) {
        currTop = row.top;
        line += 1;
      }
      const lineRow = {
        line,
        ...row,
        cell: [],
      } as never as RowLocation;
      lineRow.cell = Cell.create(editor, lineRow);
      return lineRow;
    }) as never as RowLocation;
    return row;
  },
};

export default Row;
