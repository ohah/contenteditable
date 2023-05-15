/* eslint-disable no-param-reassign */
import { ViewNode } from 'core/Grid';

import { EditorFiberNode, EditorNode, FiberNodeWeakMap } from 'components/Editor';

/* eslint-disable no-bitwise */
export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const json2EditorFiberNode = (EditorNode: EditorNode[]) => {
  const createFiberNode = (node: EditorNode) => {
    if (node && node.children && node.children?.length > 0) {
      node.children = node.children.map(item => createFiberNode(item));
    }
    const newFiberNode = {
      ...node,
      key: uuidv4(),
    };
    return newFiberNode as EditorFiberNode;
  };
  const node = EditorNode.map(item => createFiberNode(item));
  return node;
};

export const json2EditorNode = (EditorNode: EditorFiberNode[], FiberNodeWeakMap: WeakMap<any, any>, FibderNodeMap: Map<string, ViewNode>) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.classList.add('editor');
  const createNode = (node: EditorFiberNode) => {
    const element = document.createElement(node.tag || 'p');
    if (node.children) {
      node.children
        .map(item => createNode(item))
        .forEach(ele => {
          element.appendChild(ele);
        });
    }
    if (node.type === 'text') {
      const span = FibderNodeMap.get(node.key) || document.createElement('span');
      const textNode = (FibderNodeMap.get(node.key)?.firstChild as Text) || document.createTextNode('');
      textNode.textContent = node.text || '';
      span.appendChild(textNode);
      if (!FibderNodeMap.has(node.key)) {
        FiberNodeWeakMap.set(span, node);
        FibderNodeMap.set(node.key, span);
      }
      return span;
    }
    if (node.type === 'linebreak') {
      const br = FibderNodeMap.get(node.key) || document.createElement('br');
      if (!FibderNodeMap.has(node.key)) {
        FiberNodeWeakMap.set(br, node);
        FibderNodeMap.set(node.key, br);
      }
      return br;
    }
    // FiberNodeWeakMap.set(element, EditorFiberNode[EditorFiberNode.length - 1]);
    return element;
  };
  const node = EditorNode.map(item => createNode(item));
  div.append(...node);

  fragment.appendChild(div);
  // const element = EditorNode.tag || 'p';

  return {
    fragment,
    node: div,
  };
};
