import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LexicalEditor } from 'lexical';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { HashtagNode } from '@lexical/hashtag';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { MarkNode } from '@lexical/mark'; // Import du MarkNode
import ExampleTheme from '../ExampleTheme';
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import TreeViewPlugin from '../plugins/TreeViewPlugin';
import { ImageNode } from '../nodes/ImageNode';
import CommentPlugin from '../plugins/CommentPlugin';

const placeholder = 'Entrez du texte enrichi...';

const theme = {
  text: {
    highlight: 'lexical-highlight', // Classe CSS pour le surlignage
  },
};

const editorConfig = {
  namespace: 'React.js Demo',
  theme: theme,
  onError(error: Error, editor: LexicalEditor) {
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
    ImageNode,
    MarkNode, // Ajout du MarkNode
  ],
};
export default function App() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <HashtagPlugin />
          <TreeViewPlugin />
          <CommentPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
