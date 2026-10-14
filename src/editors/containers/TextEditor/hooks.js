import { formatAppMessage } from '@src/constants/formatMessage';
import { showToastOutsideReact } from '@src/generic/toast-context';
import { isLibraryKey } from '@src/generic/key-utils';
import * as appHooks from '../../hooks';
import { setAssetToStaticUrl } from '../../sharedComponents/TinyMceWidget/hooks';
import tinyMceMessages from '../../sharedComponents/TinyMceWidget/messages';
import { countBase64Images, uploadBase64ImagesInHtml } from '../../sharedComponents/TinyMceWidget/robboImageAssets';

export const { nullMethod, navigateCallback, navigateTo } = appHooks;

export const getContent = ({ editorRef, showRawEditor }) => () => {
  const content = showRawEditor && editorRef && editorRef.current
    ? editorRef.current.state.doc.toString()
    : editorRef.current?.getContent();
  return setAssetToStaticUrl({ editorValue: content });
};

export const isDirty = ({ editorRef, showRawEditor }) => () => {
  /* istanbul ignore next */
  if (!editorRef?.current) {
    return false;
  }
  const dirty = showRawEditor && editorRef && editorRef.current
    ? editorRef.current.observer?.lastChange !== 0
    : !editorRef.current.isNotDirty;
  return dirty;
};

/**
 * Robbo: before saving, upload base64 images of the block (pasted with text, typed in the source view,
 * left in old blocks) to course Files and put links into the editor, so getContent() saves the links.
 */
export const moveBase64ImagesToFiles = ({
  editorRef,
  showRawEditor,
  learningContextId,
  blockId,
}) =>
async () => {
  const editor = editorRef?.current;
  if (!editor || !learningContextId || !blockId || isLibraryKey(learningContextId)) {
    return;
  }
  const html = showRawEditor ? editor.state.doc.toString() : editor.getContent();
  const count = countBase64Images(html || '');
  if (!count) {
    return;
  }
  showToastOutsideReact(formatAppMessage(tinyMceMessages.imagesUploadingOnSave, { count }), undefined, 120000);
  const result = await uploadBase64ImagesInHtml({ html, learningContextId, blockId });
  if (result.moved) {
    if (showRawEditor) {
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: result.html } });
    } else {
      editor.setContent(result.html);
    }
  }
  showToastOutsideReact(
    result.failed
      ? formatAppMessage(tinyMceMessages.imagesFailedOnSave, { failed: result.failed })
      : formatAppMessage(tinyMceMessages.imagesMovedOnSave, { moved: result.moved, reused: result.reused }),
    undefined,
    10000,
  );
};
