// SelectionPlugin.tsx
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

interface SelectionInfo {
  text: string;
  rect: DOMRect;
  startIndex: number;
  endIndex: number;
}

interface SelectionPluginProps {
  onSelectionChange: (selection: SelectionInfo | null) => void;
}

const SelectionPlugin: React.FC<SelectionPluginProps> = ({ onSelectionChange }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.selection-toolbar')) {
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

          const selectedText = selection.toString();
          const rootElement = editor.getRootElement();
          const fullText = rootElement?.textContent || '';
          const startIndex = fullText.indexOf(selectedText);
          const endIndex = startIndex + selectedText.length;

          onSelectionChange({
            text: selectedText,
            startIndex,
            endIndex,
            rect: rect,
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
