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
    const newFiberNode: EditorFiberNode = {
      ...node,
      key: uuidv4(),
    };
    return newFiberNode;
  };
  const node = EditorNode.map(item => createFiberNode(item));
  return node;
};

export const json2EditorNode = (EditorNode: EditorNode[], FiberNodeWeakMap: FiberNodeWeakMap) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.classList.add('editor');
  const EditorFiberNode: EditorFiberNode[] = [];
  const createNode = (node: EditorNode) => {
    const element = document.createElement(node.tag || 'p');
    const newFiberNode: EditorFiberNode = {
      ...node,
      key: uuidv4(),
    };
    EditorFiberNode.push(newFiberNode);
    if (node.children) {
      node.children
        .map(item => createNode(item))
        .forEach(ele => {
          element.appendChild(ele);
        });
    }
    if (node.type === 'text') {
      const span = document.createElement('span');
      const textNode = document.createTextNode(node.text || '');
      span.appendChild(textNode);
      FiberNodeWeakMap.set(span, newFiberNode);
      return span;
    }
    if (node.type === 'linebreak') {
      const br = document.createElement('br');
      FiberNodeWeakMap.set(br, newFiberNode);
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
    EditorFiberNode,
  };
};
