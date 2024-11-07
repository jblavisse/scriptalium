import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  TextNode,
} from 'lexical';

interface SelectionInfo {
  text: string;
  rect: DOMRect;
  startIndex: number;
  endIndex: number;
}

interface Props {
  onSelectionChange: (selection: SelectionInfo | null) => void;
}

export default function SelectionPlugin({ onSelectionChange }: Props) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          console.log('Selection is not a RangeSelection');
          onSelectionChange(null);
          return;
        }

        const selectedText = selection.getTextContent();
        console.log('Selected Text:', selectedText);

        if (selectedText.trim() !== '') {
          const anchor = selection.anchor;
          const focus = selection.focus;

          const anchorNode = anchor.getNode();
          const focusNode = focus.getNode();

          console.log('Anchor Node:', anchorNode);
          console.log('Focus Node:', focusNode);

          if (anchorNode instanceof TextNode && focusNode instanceof TextNode) {
            let startIndex = Math.min(anchor.offset, focus.offset);
            let endIndex = Math.max(anchor.offset, focus.offset);

            console.log('Adjusted Start Index:', startIndex);
            console.log('Adjusted End Index:', endIndex);

            // Récupérer directement les nœuds DOM des TextNodes
            const anchorDOM = editor.getElementByKey(anchorNode.getKey()) as HTMLElement | null;
            const focusDOM = editor.getElementByKey(focusNode.getKey()) as HTMLElement | null;

            if (anchorDOM && focusDOM) {
              const anchorTextNode = anchorDOM.firstChild as Text | null;
              const focusTextNode = focusDOM.firstChild as Text | null;

              if (anchorTextNode && focusTextNode) {
                const range = document.createRange();

                if (anchorNode.isBefore(focusNode) || anchorNode === focusNode) {
                  range.setStart(anchorTextNode, startIndex);
                  range.setEnd(focusTextNode, endIndex);
                } else {
                  range.setStart(focusTextNode, endIndex);
                  range.setEnd(anchorTextNode, startIndex);
                }

                const rect = range.getBoundingClientRect();
                console.log('Selection Rect:', rect);

                onSelectionChange({
                  text: selectedText,
                  rect: rect,
                  startIndex,
                  endIndex,
                });
              } else {
                console.warn('Text nodes not found in anchor or focus children.');
                onSelectionChange(null);
              }
            } else {
              console.warn('Anchor DOM or Focus DOM is null');
              onSelectionChange(null);
            }
          } else {
            console.warn('Anchor Node or Focus Node is not a TextNode');
            onSelectionChange(null);
          }
        } else {
          console.log('Selected Text is empty or whitespace');
          onSelectionChange(null);
        }
      });
    });
  }, [editor, onSelectionChange]);

  return null;
}