import { ContentEditable } from 'components';

const Editor = {
  isEmpty: () => {
    return false;
  },
  setCaret: (editor: ContentEditable, x: number, y: number) => {
    console.log('view', editor.view);
  },
};

export default Editor;
