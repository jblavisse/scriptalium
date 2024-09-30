import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

const SelectionPlugin = ({ onSelectionChange }:{ onSelectionChange:any }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (!event.target.closest('.selection-toolbar')) {
        onSelectionChange(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSelectionChange]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0 && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          onSelectionChange({
            text: selection.toString(),
            rect: {
              top: rect.top + window.scrollY-50,
              left: rect.left + window.scrollX-550,
              bottom: rect.bottom + window.scrollY,
              height: rect.height,
            },
          });
        } else {
          onSelectionChange(null);
        }
      });
    });
  }, [editor, onSelectionChange]);

  return null;
};

export default SelectionPlugin;
