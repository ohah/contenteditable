export declare global {
  interface Object {
    isEquals<T extends object>(obj1: T, obj2: T): boolean;
  }
}

type CompoistionType = 'compositionstart' | 'compositionupdate' | 'compositionend';

type InputType =
  | 'insertText'
  | 'insertReplacementText'
  | 'insertLineBreak'
  | 'insertParagraph'
  | 'insertOrderedList'
  | 'insertUnorderedList'
  | 'insertHorizontalRule'
  | 'insertFromYank'
  | 'insertFromDrop'
  | 'insertFromPaste'
  | 'insertFromPasteAsQuotation'
  | 'insertTranspose'
  | 'insertCompositionText'
  | 'insertLink'
  | 'deleteWordBackward'
  | 'deleteWordForward'
  | 'deleteSoftLineBackward'
  | 'deleteSoftLineForward'
  | 'deleteEntireSoftLine'
  | 'deleteHardLineBackward'
  | 'deleteHardLineForward'
  | 'deleteByDrag'
  | 'deleteByCut'
  | 'deleteContent'
  | 'deleteContentBackward'
  | 'deleteContentForward'
  | 'historyUndo'
  | 'historyRedo'
  | 'formatBold'
  | 'formatItalic'
  | 'formatUnderline'
  | 'formatStrikeThrough'
  | 'formatSuperscript'
  | 'formatSubscript'
  | 'formatJustifyFull'
  | 'formatJustifyCenter'
  | 'formatJustifyRight'
  | 'formatJustifyLeft'
  | 'formatIndent'
  | 'formatOutdent'
  | 'formatRemove'
  | 'formatSetBlockTextDirection'
  | 'formatSetInlineTextDirection'
  | 'formatBackColor'
  | 'formatFontColor'
  | 'formatFontName';
