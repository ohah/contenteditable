/* eslint-disable no-extend-native */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-continue */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { ViewNode } from 'core/Grid';
import { SelectionState } from 'core/State';

import Editor, { EditorFiberNode, EditorNode, FiberNodeWeakMap } from 'components/Editor';

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
      const span = (FibderNodeMap.get(node.key) as HTMLSpanElement) || (document.createElement('span') as HTMLSpanElement);
      Array.from(span.childNodes).forEach(child => {
        child.remove();
      });
      const textNode = (FibderNodeMap.get(node.key)?.firstChild as Text) || document.createTextNode('');
      textNode.textContent = node.text || '';

      if (node.format?.includes('bold')) {
        span.style.fontSize = '24px';
      }
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

Object.prototype.isEquals = (obj1, obj2) => {
  for (const key in obj1) {
    if (!obj1.hasOwnProperty(key)) continue;
    if (!obj2.hasOwnProperty(key)) return false;
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
};

export const BROWSER_ENGINE = {
  WEBKIT: 'AppleWebKit',
  BLINK: 'Blink',
  GECKO: 'Gecko',
  TRIDENT: 'Trident',
  UNKNOWN: 'unknown',
} as const;

export type BrowserEngine = (typeof BROWSER_ENGINE)[keyof typeof BROWSER_ENGINE];

export const isPlatform = (): BrowserEngine => {
  const engine = navigator.userAgent.match(/(AppleWebKit|Blink|Gecko|Trident)/)![0];
  switch (engine) {
    case BROWSER_ENGINE.WEBKIT: // Apple
      return engine;
    case BROWSER_ENGINE.BLINK: // Chromium
      return engine;
    case BROWSER_ENGINE.GECKO: // FireFox
      return engine;
    case BROWSER_ENGINE.TRIDENT:
      return engine;
    default:
      return BROWSER_ENGINE.UNKNOWN;
  }
};

export const IS_COMPOSING: WeakMap<Editor, boolean> = new WeakMap();
