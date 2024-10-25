'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
  RangeSelection,
  NodeSelection,
  LexicalNode,
  ElementNode,
  $isNodeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import { $isLinkNode } from '@lexical/link';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code as CodeIcon,
  Undo,
  Redo,
} from '@mui/icons-material';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LowPriority = 1;

function Divider() {
  return <div className="divider mx-2 border-l h-6" />;
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
  const [,setBlockType] = useState<HeadingTagType | 'paragraph'>('paragraph');
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [,setIsLink] = useState(false);
  const [isQuote, setIsQuote] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if (!selection || !$isRangeSelection(selection)) {
      return;
    }

    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsUnderline(selection.hasFormat('underline'));
    setIsStrikethrough(selection.hasFormat('strikethrough'));

    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getTopLevelElement();


    if (!element) {
      return;
    }

    const elementType = element.getType();

    if (elementType === 'paragraph' || /^h\d$/.test(elementType)) {
      setBlockType(elementType as HeadingTagType | 'paragraph');
    } else {
      setBlockType('paragraph');
    }

    setIsBulletList($isListNode(element) && element.getTag() === 'ul');
    setIsNumberedList($isListNode(element) && element.getTag() === 'ol');
    setIsQuote($isQuoteNode(element));
    setIsCode($isCodeNode(element));

    const node = getSelectedNode(selection);
    const parent = node?.getParent();
    if ($isLinkNode(parent) || $isLinkNode(node)) {
      setIsLink(true);
    } else {
      setIsLink(false);
    }
  }, []);

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
    <div className="toolbar flex items-center justify-center px-6 py-4 border-b space-x-2 shadow-[0px_1px_20px_1px_#00000024]" ref={toolbarRef}>
      {/* Undo/Redo Buttons */}
      <Button
        variant="ghost"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className={`toolbar-item ${canUndo ? 'active' : 'disabled'}`}
        aria-label="Undo"
      >
        <Undo />
      </Button>
      <Button
        variant="ghost"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className={`toolbar-item ${canRedo ? 'active' : 'disabled'}`}
        aria-label="Redo"
      >
        <Redo />
      </Button>
      <Divider />
      
      {/* Block Type Selector */}
      <div className="toolbar-item block-controls">
      <Select
        onValueChange={(value: HeadingTagType | 'paragraph') => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const anchorOffset = selection.anchor.offset;
              const focusOffset = selection.focus.offset;
              const nodes = selection.getNodes();

              nodes.forEach((node) => {
                const topLevelNode = node.getTopLevelElement();
                if (!topLevelNode) {
                  return;
                }
                let newNode: ElementNode | null = null;

                if (value === 'paragraph') {
                  newNode = $createParagraphNode();
                } else if (value === 'h1' || value === 'h2' || value === 'h3') {
                  newNode = $createHeadingNode(value);
                }

                if (newNode && $isElementNode(topLevelNode)) {
                  const children = topLevelNode.getChildren();
                  topLevelNode.replace(newNode);
                  children.forEach((child: LexicalNode) => {
                    child.remove();
                    newNode!.append(child);
                  });
                  newNode.select(anchorOffset, focusOffset);
                }
              });
            }
          });
        }}
      >
        <SelectTrigger className="w-[180px] bg-gray-100 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-0">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Paragraph</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
      <Divider />

      {/* Text Formatting Buttons */}
      <Button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={`toolbar-item spaced ${isBold ? 'active' : ''}`}
        variant="ghost"
        aria-label="Bold"
      >
        <FormatBold />
      </Button>
      <Button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={`toolbar-item spaced ${isItalic ? 'active' : ''}`}
        variant="ghost"
        aria-label="Italic"
      >
        <FormatItalic />
      </Button>
      <Button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={`toolbar-item spaced ${isUnderline ? 'active' : ''}`}
        variant="ghost"
        aria-label="Underline"
      >
        <FormatUnderlined />
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={`toolbar-item spaced ${isStrikethrough ? 'active' : ''}`}
        aria-label="Strikethrough"
      >
        <StrikethroughS />
      </Button>
      <Divider />

      {/* List Buttons */}
      <Button
        onClick={() => {
          if (isBulletList) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }
        }}
        className={`toolbar-item spaced ${isBulletList ? 'active' : ''}`}
        variant="ghost"
        aria-label="Unordered List"
      >
        <FormatListBulleted />
      </Button>
      <Button
        onClick={() => {
          if (isNumberedList) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }
        }}
        className={`toolbar-item spaced ${isNumberedList ? 'active' : ''}`}
        aria-label="Ordered List"
        variant="ghost"
      >
        <FormatListNumbered />
      </Button>
      <Divider />
      {/* Quote Button */}
      <Button
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              nodes.forEach((node) => {
                const topLevelNode = node.getTopLevelElement();
                if (!topLevelNode) {
                  return;
                }
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
                      newNode!.append(child);
                    });
                  }
                }
              });
            }
          });
        }}
        className={`toolbar-item spaced ${isQuote ? 'active' : ''}`}
        aria-label="Toggle Quote Block"
        variant="ghost"
      >
        <FormatQuote />
      </Button>

     {/* Code Block Button */}
      <Button
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const anchorNode = selection.anchor.getNode();
              const topLevelNode = anchorNode.getTopLevelElementOrThrow();

              if ($isCodeNode(topLevelNode)) {
                const paragraphNode = $createParagraphNode();
                topLevelNode.insertAfter(paragraphNode);
                paragraphNode.selectStart();
              } else {
                const codeNode = $createCodeNode();
                topLevelNode.replace(codeNode);
                codeNode.selectStart();
              }
            }
          });
        }}
        className={`toolbar-item spaced ${isCode ? 'active' : ''}`}
        aria-label="Toggle Code Block"
        variant="ghost"
      >
        <CodeIcon />
      </Button>
    </div>
  );
}

function getSelectedNode(selection: RangeSelection | NodeSelection): LexicalNode | null {
  if ($isRangeSelection(selection)) {
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
      return anchorNode;
    }
    return selection.isBackward() ? focusNode : anchorNode;
  } else if ($isNodeSelection(selection)) {
    const nodes = selection.getNodes();
    return nodes.length > 0 ? nodes[0] : null;
  }
  return null;
}
