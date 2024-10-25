import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_TEXT_COMMAND,
  $getNearestNodeFromDOMNode,
  $createTextNode,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import '../pages/styles/test.css';

export default function FloatingToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [isMouseOverHighlightedText, setIsMouseOverHighlightedText] = useState(false);
  const [isMouseOverToolbar, setIsMouseOverToolbar] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateToolbarPosition = useCallback((rect: DOMRect) => {
    const toolbarElement = toolbarRef.current;
    if (toolbarElement != null) {
      const toolbarWidth = toolbarElement.offsetWidth;
      const top = rect.bottom + window.scrollY + 8;
      let left = rect.left + window.scrollX + rect.width / 2 - toolbarWidth / 2; 

      if (left < 0) {
        left = rect.left + window.scrollX;
      }

      const rightEdge = left + toolbarWidth;
      const windowWidth = window.innerWidth;
      if (rightEdge > windowWidth) {
        left = windowWidth - toolbarWidth - 10;
      }

      setToolbarPosition({
        top: top,
        left: left,
      });
    }
  }, []);

  const updateToolbar = useCallback(() => {
    if (!isClient) return;

    const selection = $getSelection();

    if ($isRangeSelection(selection) && !selection.isCollapsed()) {
      const nativeSelection = window.getSelection();
      const rangeRect = nativeSelection?.getRangeAt(0).getBoundingClientRect();

      if (rangeRect) {
        updateToolbarPosition(rangeRect);
        setIsToolbarVisible(true);
      }
    } else {
      if (!isMouseOverHighlightedText && !isMouseOverToolbar) {
        setIsToolbarVisible(false);
      }
    }
  }, [isClient, updateToolbarPosition, isMouseOverHighlightedText, isMouseOverToolbar]);

  useEffect(() => {
    const removeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });

    return () => {
      removeListener();
    };
  }, [editor, updateToolbar]);

  const handleMouseUp = useCallback(() => {
    setTimeout(() => {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          // Appliquer le format 'highlight' au texte sélectionné
          selection.formatText('highlight');
          console.log('Highlight format applied.');

          // Obtenir le point de focus (fin de la sélection)
          const focus = selection.focus;
          const focusNode = focus.getNode();
          const focusOffset = focus.offset;

          if ($isTextNode(focusNode)) {
            // Replier la sélection à la fin du TextNode
            selection.setTextNodeRange(focusNode, focusOffset, focusNode, focusOffset);
            console.log('Selection collapsed to end.');
          } else {
            // focusNode n'est pas un TextNode, insérer un nouveau TextNode après
            const newTextNode = $createTextNode('');
            focusNode.insertAfter(newTextNode);
            selection.setTextNodeRange(newTextNode, 0, newTextNode, 0);
            console.log('New TextNode inserted and selection set.');
          }

          // Désactiver le format 'highlight' actif en le basculant
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight');
          console.log('Highlight format toggled off.');
        }
      });
    }, 0);
  }, [editor]);

  useEffect(() => {
    const editorRootElement = editor.getRootElement();
    if (!editorRootElement) return;

    editorRootElement.addEventListener('mouseup', handleMouseUp);

    return () => {
      editorRootElement.removeEventListener('mouseup', handleMouseUp);
    };
  }, [editor, handleMouseUp]);

  useEffect(() => {
    const editorRootElement = editor.getRootElement();
    if (!editorRootElement) return;

    let hideToolbarTimeout: NodeJS.Timeout;

    const handleMouseOver = (event: MouseEvent) => {
      const domNode = event.target as Node;
      editor.read(() => {
        const node = $getNearestNodeFromDOMNode(domNode);
        if ($isTextNode(node) && node.hasFormat('highlight')) {
          setIsMouseOverHighlightedText(true);

          const range = document.createRange();
          range.selectNodeContents(domNode);
          const rect = range.getBoundingClientRect();
          updateToolbarPosition(rect);
          setIsToolbarVisible(true);
          clearTimeout(hideToolbarTimeout);
        }
      });
    };

    const handleMouseOut = (event: MouseEvent) => {
      const domNode = event.target as Node;
      editor.read(() => {
        const node = $getNearestNodeFromDOMNode(domNode);
        if ($isTextNode(node) && node.hasFormat('highlight')) {
          setIsMouseOverHighlightedText(false);
          hideToolbarTimeout = setTimeout(() => {
            if (!isMouseOverToolbar) {
              setIsToolbarVisible(false);
            }
          }, 200);
        }
      });
    };

    editorRootElement.addEventListener('mouseover', handleMouseOver);
    editorRootElement.addEventListener('mouseout', handleMouseOut);

    return () => {
      editorRootElement.removeEventListener('mouseover', handleMouseOver);
      editorRootElement.removeEventListener('mouseout', handleMouseOut);
      clearTimeout(hideToolbarTimeout);
    };
  }, [editor, updateToolbarPosition, isMouseOverToolbar]);

  useEffect(() => {
    const toolbarElement = toolbarRef.current;
    if (!toolbarElement) return;

    let hideToolbarTimeout: NodeJS.Timeout;

    const handleToolbarMouseOver = () => {
      setIsMouseOverToolbar(true);
      clearTimeout(hideToolbarTimeout);
    };

    const handleToolbarMouseOut = () => {
      setIsMouseOverToolbar(false);
      hideToolbarTimeout = setTimeout(() => {
        if (!isMouseOverHighlightedText) {
          setIsToolbarVisible(false);
        }
      }, 200); // Ajustez la durée du délai si nécessaire
    };

    toolbarElement.addEventListener('mouseover', handleToolbarMouseOver);
    toolbarElement.addEventListener('mouseout', handleToolbarMouseOut);

    return () => {
      toolbarElement.removeEventListener('mouseover', handleToolbarMouseOver);
      toolbarElement.removeEventListener('mouseout', handleToolbarMouseOut);
      clearTimeout(hideToolbarTimeout);
    };
  }, [isMouseOverHighlightedText]);

  const highlightText = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight');
  };

  return (
    <>
      {isClient &&
        createPortal(
          <div
            ref={toolbarRef}
            className="floating-toolbar"
            style={{
              top: `${toolbarPosition.top}px`,
              left: `${toolbarPosition.left}px`,
              display: isToolbarVisible ? 'block' : 'none',
              position: 'absolute',
            }}
            onMouseOver={() => setIsMouseOverToolbar(true)}
            onMouseOut={() => setIsMouseOverToolbar(false)}
          >
            {/* Ajoutez vos boutons ou contenus de la barre d'outils ici */}
            <button onClick={highlightText}>Highlight</button>
          </div>,
          document.body,
        )}
    </>
  );
}
