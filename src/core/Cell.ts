import { EditorElement } from 'components';

const Cell = {
  create: (editor: EditorElement, row: Location) => {
    const { weakMap } = editor;
    return [] as unknown as Location[];
  },
  getTextWidth: (textNode: Text, offset: number) => {},
};

export default Cell;
