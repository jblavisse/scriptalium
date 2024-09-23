// ToolbarPlugin.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
  RangeSelection,
  NodeSelection,
  LexicalNode,
  ElementNode,
  $isNodeSelection,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isLinkNode } from '@lexical/link';
import {
  HeadingTagType,
  $createHeadingNode,
  $createQuoteNode,
  $isQuoteNode,
} from '@lexical/rich-text';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $createImageNode } from '../nodes/ImageNode'; // Assurez-vous que le chemin est correct
// Importation des icônes Material UI
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  FormatListBulleted,
  FormatListNumbered,
  Link as LinkIcon,
  FormatQuote,
  Code as CodeIcon,
  Undo,
  Redo,
  Image as ImageIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
} from '@mui/icons-material';

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState<HeadingTagType | 'paragraph'>('paragraph');
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isQuote, setIsQuote] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      // Mises à jour des formats de texte
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      const elementType = element.getType();

      if (elementType === 'paragraph' || /^h\d$/.test(elementType)) {
        setBlockType(elementType as HeadingTagType | 'paragraph');
      }

      setIsBulletList($isListNode(element) && element.getTag() === 'ul');
      setIsNumberedList($isListNode(element) && element.getTag() === 'ol');
      setIsQuote($isQuoteNode(element));
      setIsCode($isCodeNode(element));

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar();
      });
    });
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        $updateToolbar();
        return false;
      },
      LowPriority,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      LowPriority,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      LowPriority,
    );
  }, [editor]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      {/* Boutons Annuler/Rétablir */}
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Annuler"
      >
        <Undo />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Rétablir"
      >
        <Redo />
      </button>
      <Divider />

      {/* Sélecteur de type de bloc */}
      <div className="toolbar-item block-controls">
        <select
          value={blockType}
          onChange={(e) => {
            const value = e.target.value as HeadingTagType | 'paragraph';
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const nodes = selection.getNodes();
                nodes.forEach((node) => {
                  const topLevelNode = node.getTopLevelElementOrThrow();
                  let newNode: ElementNode | null = null;

                  if (value === 'paragraph') {
                    newNode = $createParagraphNode();
                  } else if (value === 'h1' || value === 'h2' || value === 'h3') {
                    newNode = $createHeadingNode(value);
                  }

                  if (newNode) {
                    if ($isElementNode(topLevelNode)) {
                      const children = topLevelNode.getChildren();
                      topLevelNode.replace(newNode);
                      children.forEach((child: LexicalNode) => {
                        child.remove();
                        newNode!.append(child);
                      });
                    }
                  }
                });
              }
            });
          }}
        >
          <option value="paragraph">Paragraphe</option>
          <option value="h1">Titre 1</option>
          <option value="h2">Titre 2</option>
          <option value="h3">Titre 3</option>
        </select>
      </div>
      <Divider />

      {/* Boutons de formatage du texte */}
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label="Gras"
      >
        <FormatBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label="Italique"
      >
        <FormatItalic />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label="Souligné"
      >
        <FormatUnderlined />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        aria-label="Barré"
      >
        <StrikethroughS />
      </button>
      <Divider />

      {/* Boutons de listes */}
      <button
        onClick={() => {
          if (isBulletList) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }
        }}
        className={'toolbar-item spaced ' + (isBulletList ? 'active' : '')}
        aria-label="Liste à puces"
      >
        <FormatListBulleted />
      </button>
      <button
        onClick={() => {
          if (isNumberedList) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }
        }}
        className={'toolbar-item spaced ' + (isNumberedList ? 'active' : '')}
        aria-label="Liste numérotée"
      >
        <FormatListNumbered />
      </button>
      <Divider />

      {/* Bouton de lien */}
      <button
        onClick={() => {
          if (isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          } else {
            const url = window.prompt("Entrez l'URL du lien :", 'https://');
            if (url !== null) {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
            }
          }
        }}
        className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
        aria-label="Insérer un lien"
      >
        <LinkIcon />
      </button>

      {/* Bouton de citation */}
      <button
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              nodes.forEach((node) => {
                const topLevelNode = node.getTopLevelElementOrThrow();
                let newNode: ElementNode | null = null;
                if (isQuote) {
                  newNode = $createParagraphNode();
                } else {
                  newNode = $createQuoteNode();
                }
                if (newNode) {
                  if ($isElementNode(topLevelNode)) {
                    const children = topLevelNode.getChildren();
                    topLevelNode.replace(newNode);
                    children.forEach((child: LexicalNode) => {
                      child.remove();
                      newNode!.append(child);
                    });
                  }
                }
              });
            }
          });
        }}
        className={'toolbar-item spaced ' + (isQuote ? 'active' : '')}
        aria-label="Bloc de citation"
      >
        <FormatQuote />
      </button>

      {/* Bouton de code */}
      <button
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              nodes.forEach((node) => {
                const topLevelNode = node.getTopLevelElementOrThrow();
                let newNode: ElementNode | null = null;
                if (isCode) {
                  newNode = $createParagraphNode();
                } else {
                  newNode = $createCodeNode();
                }
                if (newNode) {
                  if ($isElementNode(topLevelNode)) {
                    const children = topLevelNode.getChildren();
                    topLevelNode.replace(newNode);
                    children.forEach((child: LexicalNode) => {
                      child.remove();
                      newNode!.append(child);
                    });
                  }
                }
              });
            }
          });
        }}
        className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
        aria-label="Bloc de code"
      >
        <CodeIcon />
      </button>

      {/* Boutons d'alignement du texte */}
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="toolbar-item spaced"
        aria-label="Aligner à gauche"
      >
        <FormatAlignLeft />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="toolbar-item spaced"
        aria-label="Centrer"
      >
        <FormatAlignCenter />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="toolbar-item spaced"
        aria-label="Aligner à droite"
      >
        <FormatAlignRight />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="toolbar-item"
        aria-label="Justifier"
      >
        <FormatAlignJustify />
      </button>

      {/* Bouton d'insertion d'image */}
      <Divider />
      <button
        onClick={() => {
            const url = window.prompt("Entrez l'URL de l'image :", 'https://');
            if (url !== null) {
            const altText = window.prompt("Entrez le texte alternatif de l'image :", '') || '';
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                const imageNode = $createImageNode({ src: url, altText });
                selection.insertNodes([imageNode]);
                }
            });
            }
        }}
        className="toolbar-item"
        aria-label="Insérer une image"
        >
        <ImageIcon />
        </button>
    </div>
  );
}

function getSelectedNode(
    selection: RangeSelection | NodeSelection ,
  ): LexicalNode {
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const focus = selection.focus;
      const anchorNode = anchor.getNode();
      const focusNode = focus.getNode();
      if (anchorNode === focusNode) {
        return anchorNode;
      }
      return selection.isBackward() ? focusNode : anchorNode;
    } else if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes();
      return nodes.length > 0 ? nodes[0] : selection.getNodes()[0];
    }
    throw new Error('No node is selected');
  }