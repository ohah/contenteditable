import { Location } from 'core/Grid';

import { EditorElement, Selection } from 'components';

/**
 * 해당 값을 바꾸면 이벤트가 일어난다.
 * @param anchorOffset 시작 값의 텍스트 포커스
 * @param anchorNode 시작 노드
 * @param anchorIndex { Grid } 배열의 index값
 * @param focusOffset 선택된 값의 텍스트 포커스
 * @param focusNode 선택된 노드
 * @param focusIndex { Grid } 배열의 index값
 * @param isCollased 시작과 끝 지점이 같으면 true, true인 경우 Caret, 아닌경우 Range
 * @param type Caret | Range | None
 * @param index { Grid } 배열의 index값.
 * @shifeed
 */
export interface SelectionState {
  anchorOffset?: number | null;
  anchorNode?: Node | null;
  anchorIndex?: number | null;
  focusOffset?: number | null;
  focusNode?: Node | null;
  focusIndex?: number | null;
  isCollased?: boolean | null;
  location?: Location | null;
  type: 'Caret' | 'Range' | 'None';
}

type SelectKey = `${keyof SelectionState}`;

export const State = (Selection: Selection) => {
  const _states: SelectionState[] = [];
  let idx = 0;
  // let state = {
  //   anchorOffset: null,
  //   anchorNode: null,
  //   anchorIndex: null,
  //   focusOffset: null,
  //   focusNode: null,
  //   focusIndex: null,
  //   isCollased: null,
  //   type: 'None',
  // };
  const useState = (initialValue: SelectionState) => {
    const state = _states[idx] || initialValue;
    const currIdx = idx;

    function setState(value: SelectionState) {
      _states[currIdx] = value;
      Selection.render();
    }

    idx += 1;
    return [state, setState];
  };
  return {
    useState,
  };
};

export const initialSelectState: SelectionState = {
  type: 'None',
};

// export const StateProxyHandler = (editor: EditorElement) => {
//   return {
//     apply(target, thisArg, argArray) {
//       console.log('target', target, thisArg, argArray);
//       // console.log('setPosition');
//       // console.log('setBaseAndExtent');
//     },
//     get(target, prop: SelectKey, receiver) {
//       if (prop === 'setPosition') {
//         target = {
//           ...this.State,
//           anchorOffset: Idx,
//           anchorNode: grid[Idx].node,
//           anchorIndex: Idx,
//           focusOffset: grid[Idx].offset,
//           focusNode: grid[Idx].node,
//           focusIndex: Idx,
//           isCollased: false,
//           type: 'Caret',
//         };
//         console.log('target', target, receiver);
//       }
//       return Reflect.get(...arguments);
//     },
//     set(target, prop: SelectKey, newValue, receiver) {
//       console.log('this.set', receiver);
//       console.log('editor', editor);
//       return Reflect.set(...arguments);
//     },
//     ownKeys(target) {
//       // console.log('너니?', target, this);
//       // console.log('나닛?', editor.Selection.SelectionNode, test);
//       return Reflect.ownKeys(target);
//     },
//   } as ProxyHandler<SelectionState>;
// };
