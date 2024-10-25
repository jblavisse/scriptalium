import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $getSelection, $isRangeSelection, TextFormatType, SELECTION_CHANGE_COMMAND } from 'lexical';

interface HighlightPluginProps {
  isHighlighted: boolean;
}

const HighlightPlugin: React.FC<HighlightPluginProps> = ({ isHighlighted }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Fonction pour mettre à jour le surlignage selon la sélection active ou non
    const updateHighlight = () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if (isHighlighted) {
            selection.formatText('highlight' as TextFormatType);
          } else {
            selection.toggleFormat('highlight' as TextFormatType);
          }
        }
      });
    };

    const removeListener = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.toggleFormat('highlight' as TextFormatType);
            }
          });
        }
        return false;
      },
      1 
    );
    updateHighlight();
    return () => {
      removeListener();
    };
  }, [isHighlighted, editor]);

  return null;
};

export default HighlightPlugin;
