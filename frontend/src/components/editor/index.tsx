'use client';

import React, { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { HashtagNode } from '@lexical/hashtag';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { MarkNode } from '@lexical/mark';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import SelectionPlugin from './plugins/SelectionPlugin';
import { EditorThemeClasses,TextNode, TextFormatType } from 'lexical';
import AnnotationForm from "@/components/annotation/annotationform";

const theme: EditorThemeClasses = {
  text: { 
    bold: "font-bold",
    underline: "underline",
    strikethrough: "line-through",
    subscript: "sub",
    superscript: "super",
    highlight: 'bg-yellow-300',
  },
  heading: {
    h1: "text-2xl font-bold",
    h2: "text-xl font-bold",
    h3: "text-lg font-bold",
  },
  list: {
    ul: "list-disc pl-5",
    ol: "list-decimal pl-5",
  },
  code: "bg-gray-100 rounded p-2 font-mono",
  link: 'text-blue-600 underline',
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600",
};

const editorConfig = {
  namespace: 'React.js Demo',
  theme: theme,
  onError(error: Error, editor: any) {
    throw error;
  },
  nodes: [
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    HashtagNode,
    CodeNode,
    CodeHighlightNode,
    MarkNode,
    HeadingNode,
    QuoteNode,
  ],
};

interface SelectionInfo {
  text: string;
  rect: DOMRect;
  startIndex: number;
  endIndex: number;
}

export default function LexicalEditor() {
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [textId, setTextId] = useState<string>('1'); // Remplacez '1' par l'ID réel de votre texte

  useEffect(() => {
    const handleResize = () => {
      if (selection) {
        const range = window.getSelection()?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          setSelection({
            ...selection,
            rect: rect,
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selection]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container flex flex-col w-[50vw] mx-auto bg-background rounded-lg shadow-lg relative">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="editor-input min-h-[75vh] max-h-[75vh] w-full overflow-y-auto focus:outline-none"
              />
            }
            placeholder={<div className="editor-placeholder">Commencez à écrire...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <HashtagPlugin />
          <SelectionPlugin onSelectionChange={setSelection} />
          {selection && (
            <div
              className="selection-toolbar bg-white border border-gray-300 p-2 rounded shadow-lg flex space-x-2 absolute z-50 sm:max-w-[450px]"
              style={{
                top: Math.min(selection.rect.bottom + window.scrollY - 30, window.innerHeight),
                left: Math.min(selection.rect.left + window.scrollX - 300, window.innerWidth),
              }}              
            >
              <AnnotationForm
                selectedText={selection.text}
                startIndex={selection.startIndex}
                endIndex={selection.endIndex}
                onSelectionChange={setSelection} />
            </div>
          )}
        </div>
      </div>
    </LexicalComposer>
  );
}
