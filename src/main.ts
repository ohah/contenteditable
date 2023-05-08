import './style.css';

import { EditorElement } from 'components';

const editor = new EditorElement({
  data: [
    {
      type: 'paragraph',
      tag: 'p',
      children: [
        {
          type: 'text',
          text: 'paragraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraphparagraph',
          format: ['bold'],
        },
        {
          type: 'text',
          text: 'text2',
          format: ['italic'],
        },
        { type: 'linebreak' },
        { type: 'linebreak' },
        {
          type: 'text',
          text: '개행',
        },
      ],
    },
    {
      type: 'paragraph',
      tag: 'p',
      children: [
        {
          type: 'text',
          text: '굵게',
          format: ['bold'],
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h1',
      children: [
        {
          type: 'text',
          text: 'h1',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h2',
      children: [
        {
          type: 'text',
          text: 'h2',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h3',
      children: [
        {
          type: 'text',
          text: 'h3',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h4',
      children: [
        {
          type: 'text',
          text: 'h4',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h5',
      children: [
        {
          type: 'text',
          text: 'h5',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h6',
      children: [
        {
          type: 'text',
          text: 'h6',
        },
      ],
    },
  ],
});
console.log('editor', editor);
// editor.cloneNode(true);
editor.classList.add('content-ediable');
document.body.appendChild(editor);
// editor.append('asdf');
// import { contentEditable } from 'components';

// customElements.define('content-editable', contentEditable);
// const contentEdiable = customElements.get('content-editable');

// const editor = new contentEdiable();
// document.body.appendChild(editor);

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `;

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
