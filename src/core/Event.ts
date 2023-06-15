/* eslint-disable no-useless-constructor */
/* eslint-disable constructor-super */
/* eslint-disable no-unreachable */
import { CompoistionType, InputType, SelectionInputType } from '@types';

import { EditorElement } from 'components';

interface SelectionInputEventInit extends InputEventInit {
  compositonType?: CompoistionType;
  data: string | null;
  editor: EditorElement | null;
}

//https://codepen.io/ironpark/pen/GRYLQOx
class SelectionInputEvent extends KeyboardEvent {
  compositonType?: CompoistionType | undefined;

  data: string;

  inputType: SelectionInputType;

  editor: EditorElement | null;

  constructor(type: SelectionInputType, eventInitDict: SelectionInputEventInit | undefined) {
    super('textInput', eventInitDict);
    this.compositonType = eventInitDict?.compositonType;
    this.data = eventInitDict?.data || '';
    this.inputType = type;
    this.editor = eventInitDict?.editor || null;
  }
}

export { SelectionInputEvent };
