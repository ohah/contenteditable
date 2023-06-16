/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
import { Cell } from 'core';
import Row, { RowLocation } from 'core/Row';

import { EditorElement } from 'components';
import { IS_COMPOSING_STATE } from 'utils';

/**
 * 실제로 화면에 출력되는 노드
 */
export type ViewNode = Node | HTMLElement | Text;

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
  node: ViewNode;
  text?: string;
  offset?: number;
  line: number;
}

export type GridLocation = Location;
// export interface GridLocation extends Location {
//   row?: RowLocation[];
// }

const Grid = {
  create: async (editor: EditorElement): Promise<GridLocation[]> => {
    return new Promise(resolve => {
      const { weakMap } = editor;
      const grid: GridLocation[] = [];
      let brTop: number | null = null;
      window.requestAnimationFrame(async () => {
        // console.log('u', editor.view.querySelector('u'), editor.view);
        const editorRect = editor.getBoundingClientRect();
        const lineRange = new Range();
        const walker = document.createTreeWalker(editor.view, NodeFilter.SHOW_ELEMENT, {
          acceptNode: function () {
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        let line = 1;
        const tagNames: string[] = [];
        while (walker.nextNode()) {
          const node = walker.currentNode as Element;
          const tagName = node.nodeName.toLowerCase();
          tagNames.push(tagName);
          // console.log('tagName', tagName);
          if (!['span', 'br', 'u'].includes(tagName)) {
            // console.log('??', 'line+', node);
            // span, br 태그를 제외한 모든 태그는 개행이 된다
            line += 1;
          }
          if (['span', 'br', 'u'].includes(tagName)) {
            // console.log('tagName');
            if (node.firstChild && node.childNodes.length === 1) {
              // span 태그 안의 텍스트 크기를 구하려고 nodecontents함수 사용
              lineRange.selectNodeContents(node);
            } else if (node.firstChild && node.childNodes.length > 1) {
              // 한글 글쓰기중.
              lineRange.selectNodeContents(node);
            } else {
              // br 태그 선택
              lineRange.selectNode(node);
            }
            const topRects = Array.from(lineRange.getClientRects()).map(rect => rect.top);

            if (topRects.length > 1 && tagName !== 'u') {
              // wordrap현상으로(글이 길어서 라인이 바뀔때) 개행을 구해준다.
              line += topRects.length - 1;
            }

            const range = new Range();
            if (node.firstChild && node.childNodes.length === 1) {
              const length = node.firstChild.textContent?.length || 0;
              for (let i = 0; i < length; i += 1) {
                range.setStart(node.firstChild, i);
                range.setEnd(node.firstChild, i + 1);
                const { x, y, top, left, width, height, right, bottom } = range.getBoundingClientRect();
                // 앞에 br 태그가 있으면 이전 br값과 현재 node의 top 값을 비교하여 라인을 계산한다
                if (typeof brTop === 'number' && top > brTop) {
                  line += 1;
                  brTop = null;
                }
                const key = weakMap.get(node)?.key;
                if (key) {
                  grid.push({
                    key,
                    line: line - (topRects.length - topRects.findIndex(item => item === top)),
                    x: x - editorRect.x,
                    y: y - editorRect.y,
                    top: top - editorRect.top,
                    left: left - editorRect.left,
                    width,
                    height,
                    right: right - editorRect.left,
                    bottom: bottom - editorRect.top,
                    node: walker.currentNode,
                    offset: i,
                    text: range.toString(),
                  });
                  if (length - 1 === i) {
                    if (!node.nextElementSibling) {
                      grid.push({
                        key,
                        line: line - (topRects.length - topRects.findIndex(item => item === top)),
                        x: x - editorRect.x,
                        y: y - editorRect.y,
                        top: top - editorRect.top,
                        left: left + grid[grid.length - 1].width - editorRect.left,
                        width: editor.offsetWidth - (left + grid[grid.length - 1].width),
                        height,
                        right: editor.offsetWidth - left,
                        bottom: bottom - editorRect.top,
                        node: walker.currentNode,
                      });
                    }
                  }
                }
              }
            } else if (node.firstChild && node.childNodes.length > 1) {
              // console.log('한글입력');
              Array.from(node.childNodes).forEach(item => {
                const length = item.textContent?.length || 0;
                for (let i = 0; i < length; i += 1) {
                  range.setStart(item, i);
                  range.setEnd(item, i + 1);
                  const { x, y, top, left, width, height, right, bottom } = range.getBoundingClientRect();
                  // 앞에 br 태그가 있으면 이전 br값과 현재 node의 top 값을 비교하여 라인을 계산한다
                  if (typeof brTop === 'number' && top > brTop) {
                    line += 1;
                    brTop = null;
                  }
                  const key = weakMap.get(node)?.key;
                  // console.log(!!key, tagName === 'u');
                  if (key) {
                    grid.push({
                      key,
                      line: line - (topRects.length - topRects.findIndex(item => item === top)),
                      x: x - editorRect.x,
                      y: y - editorRect.y,
                      top: top - editorRect.top,
                      left: left - editorRect.left,
                      width,
                      height,
                      right: right - editorRect.left,
                      bottom: bottom - editorRect.top,
                      node: walker.currentNode,
                      offset: i,
                      text: range.toString(),
                    });
                    if (length - 1 === i) {
                      if (!node.nextElementSibling) {
                        grid.push({
                          key,
                          line: line - (topRects.length - topRects.findIndex(item => item === top)),
                          x: x - editorRect.x,
                          y: y - editorRect.y,
                          top: top - editorRect.top,
                          left: left + grid[grid.length - 1].width - editorRect.left,
                          width: editor.offsetWidth - (left + grid[grid.length - 1].width),
                          height,
                          right: editor.offsetWidth - left,
                          bottom: bottom - editorRect.top,
                          node: walker.currentNode,
                        });
                      }
                    }
                  }
                }
              });
            } else {
              //br tag
              range.selectNode(node);
              const { x, y, top, left, height, bottom } = node.getBoundingClientRect();
              // 앞에 br 태그가 있으면 이전 br값과 현재 node의 top 값을 비교하여 라인을 계산한다
              if (typeof brTop === 'number' && top > brTop) {
                line += 1;
                brTop = null;
              }
              // 해당코드 작업해야함
              grid.push({
                key: weakMap.get(node)?.key || '',
                line: line - (topRects.length - topRects.findIndex(item => item === top)),
                x: x - editorRect.x,
                y: y - editorRect.y,
                top: top - editorRect.top,
                left: left - editorRect.left,
                width: editor.offsetWidth - left,
                height,
                right: left - editorRect.left + editor.offsetWidth - left,
                bottom: bottom - editorRect.top,
                node: walker.currentNode,
              });
            }
          }
          if (tagName === 'br') {
            brTop = lineRange.getBoundingClientRect().top;
          }
        }
        editor.shadowRoot?.querySelectorAll('[data-caret-area]').forEach(ele => {
          ele.remove();
        });
        grid.forEach(column => {
          Cell.testBlock(editor, column);
        });
        editor.Selection.grid = grid;
        resolve(grid);
      });
    });
  },
  imeUpdate: async (editor: EditorElement) => {
    const { imeElement } = editor.Selection;
    const state = IS_COMPOSING_STATE.has(editor) ? IS_COMPOSING_STATE.get(editor) : editor.Selection.state;
    if (state) {
      const textNode = state.anchorNode?.firstChild as Text;
      const split = textNode.splitText(state.anchorOffset || 0);
      (state.anchorNode as HTMLElement).append(textNode, imeElement, split);
      // editor.Selection.state.anchorOffset = state.anchorOffset;
      // editor.Selection.state = state;
      // IS_COMPOSING_STATE.delete(editor);
    }
  },
  insert: async (editor: EditorElement) => {
    Grid.create(editor).then(grid => {
      const { x: eleX, y: eleY } = editor.Selection.imeElement.getBoundingClientRect();
      const x = editor.wrapper.scrollLeft + eleX;
      const y = editor.wrapper.scrollTop + eleY;
      const Idx = grid.findIndex(cell => cell.top < y && cell.bottom > y && cell.left < x && cell.right > x);
      if (Idx !== -1) {
        editor.Selection.setState({
          ...editor.Selection.state,
          anchorOffset: grid[Idx].offset,
          anchorNode: grid[Idx].node,
          anchorIndex: Idx,
          focusOffset: grid[Idx].offset,
          focusNode: grid[Idx].node,
          focusIndex: Idx,
          location: grid[Idx],
          isCollased: false,
          type: 'Caret',
        });
      }
    });
  },
};

export default Grid;
