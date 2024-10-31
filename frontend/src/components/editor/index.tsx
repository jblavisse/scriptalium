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
import { EditorThemeClasses } from 'lexical';
import { Button } from '@/components/ui/button';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface LexicalEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

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
  onError(error: Error) {
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

const SaveButton: React.FC<{ onSave: (content: string) => void }> = ({ onSave }) => {
  const [editor] = useLexicalComposerContext();

  const handleSave = () => {
    editor.getEditorState().read(() => {
      const json = editor.getEditorState().toJSON();
      const content = JSON.stringify(json);  // Vous pouvez choisir de stocker en JSON ou en HTML
      onSave(content);
    });
  };

  return (
    <Button onClick={handleSave} className="ml-auto mt-2">
      Sauvegarder
    </Button>
  );
};

const InitializeEditorState = ({ initialContent }: { initialContent: string }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialContent) {
      editor.update(() => {
        const editorState = editor.parseEditorState(initialContent);
        editor.setEditorState(editorState);
      });
    }
  }, [initialContent, editor]);

  return null;
};

export default function LexicalEditor({ initialContent, onSave }: LexicalEditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container flex flex-col w-full max-w-[90vw] sm:max-w-[50vw] mx-auto bg-white rounded-lg shadow-lg relative overflow-hidden">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input min-h-[75vh] max-h-[75vh] w-full overflow-y-auto focus:outline-none p-4"
              />
            }
            placeholder={<div className="editor-placeholder p-4 text-gray-400">Commencez à écrire...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <HashtagPlugin />
        </div>
        <InitializeEditorState initialContent={initialContent} />
        <SaveButton onSave={onSave} />
      </div>
    </LexicalComposer>
  );
}