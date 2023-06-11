/* eslint-disable no-useless-constructor */
/* eslint-disable constructor-super */
/* eslint-disable no-unreachable */
import { CompoistionType, InputType } from '@types';

interface SelectionInputEventInit extends InputEventInit {
  compositonType?: CompoistionType;
}

//https://codepen.io/ironpark/pen/GRYLQOx
class SelectionInputEvent extends InputEvent {
  compositonType?: CompoistionType | undefined;

  constructor(type: InputType, eventInitDict: SelectionInputEventInit | undefined) {
    super(type, eventInitDict);
    this.compositonType = eventInitDict?.compositonType;
    console.log('eventInitDict', type, eventInitDict, InputEvent.prototype);
  }
}

export { SelectionInputEvent };
