import { EditorElement } from 'components';

const Editor = {
  isEmpty: () => {
    return false;
  },
  setCaret: (editor: EditorElement, x: number, y: number) => {
    console.log('view', editor.view);
  },
};

export default Editor;
