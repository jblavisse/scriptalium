'use client'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { HashtagNode } from '@lexical/hashtag';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { MarkNode } from '@lexical/mark';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { EditorThemeClasses } from 'lexical';

const theme: EditorThemeClasses = {
  // Text formatting styles
  text: { 
    bold: "font-bold",
    underline: "underline",
    strikethrough: "line-through",
    subscript: "sub",
    superscript: "super",
    code: "bg-gray-200 rounded px-1",
  },
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600",
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

export default function LexicalEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container flex flex-col h-[80vh] w-[50vw] mx-auto bg-background rounded-lg shadow-lg">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input h-[75vh] w-full focus:outline-none" />}
            placeholder={<div className="text-gray-500">Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <HashtagPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
