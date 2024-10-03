// SelectionPlugin.tsx
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import HighlightPlugin from './Highlightplugin';

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
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.selection-toolbar')) {
        onSelectionChange(null);
        setIsHighlighted(false);
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

        // Vérifiez que 'selection' n'est pas null et que 'rangeCount' est défini
        if (!selection || selection.rangeCount === 0) {
          onSelectionChange(null);
          setIsHighlighted(false);
          return;
        }

        const selectedText = selection.toString();

        if (selectedText.trim().length > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

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

          setIsHighlighted(true); 
        } else {
          onSelectionChange(null);
          setIsHighlighted(false); 
        }
      });
    });
  }, [editor, onSelectionChange]);

  return <HighlightPlugin isHighlighted={isHighlighted} />;
};

export default SelectionPlugin;
