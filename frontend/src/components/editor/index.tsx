import React, { useEffect, useState } from 'react';
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
import { EditorThemeClasses } from 'lexical';
import { Button } from '@/components/ui/button';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorCommentInstance, SidebarComment } from '../annotation/type';
import CommentsPlugin, { ADD_COMMENT_COMMAND, REMOVE_COMMENT_COMMAND } from '../editor/plugins/CommentsPlugin';
import CommentsCollectorPlugin from '../editor/plugins/CommentsCollectorPlugin';
import SelectionPlugin from '../editor/plugins/SelectionPlugin';
import AnnotationForm from '../annotation/annotationform';
import { v4 as uuidv4 } from 'uuid';
import CommentNode from '../annotation/CommentNode';

interface LexicalEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  returnButton: React.ReactNode;
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
  comment: 'bg-yellow-300 relative',
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
    CommentNode,
  ],
};

interface SelectionInfo {
  text: string;
  rect: DOMRect;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({ initialContent, onSave, returnButton }) => {
  return (
    <div className="flex w-full">
      <LexicalComposer initialConfig={editorConfig}>
        <EditorWrapper
          initialContent={initialContent}
          onSave={onSave}
          returnButton={returnButton}
        />
      </LexicalComposer>
    </div>
  );
};

interface EditorWrapperProps {
  initialContent: string;
  onSave: (content: string) => void;
  returnButton: React.ReactNode;
}

const EditorWrapper: React.FC<EditorWrapperProps> = ({
  initialContent,
  onSave,
  returnButton,
}) => {
  const [comments, setComments] = useState<SidebarComment[]>([]);
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [editor] = useLexicalComposerContext();

  const handleRemoveComment = (uuid: string) => {
    editor.dispatchCommand(REMOVE_COMMENT_COMMAND, { uuid });
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== uuid));
  };

  const handleAddComment = (commentText: string) => {
    if (!commentText.trim() || !selection) return;

    const newCommentInstance: EditorCommentInstance = {
      uuid: uuidv4(),
      textContent: selection.text,
      comments: [{ userName: 'Utilisateur', time: new Date().toISOString(), content: commentText }],
    };

    editor.dispatchCommand(ADD_COMMENT_COMMAND, { commentInstance: newCommentInstance });

    const newSidebarComment: SidebarComment = {
      id: newCommentInstance.uuid,
      text: newCommentInstance.textContent,
      commentText: newCommentInstance.comments.map((comment) => comment.content).join(', '),
      uuid: ''
    };

    setComments((prevComments) => [...prevComments, newSidebarComment]);
    setSelection(null);
  };

  return (
<div className="flex flex-col lg:flex-row w-full h-full">
  <div className="flex-1 overflow-hidden">
    <div className="editor-container flex flex-col bg-white rounded-lg shadow-md border border-gray-200 p-4 w-full h-5/6 max-w-[1200px] mx-auto max-h-[50vh] sm:max-h-[60vh] lg:max-h-[80vh]">
      <ToolbarPlugin />
      <div className="editor-inner flex-1 mt-2 overflow-auto max-h-[70vh]">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-input h-5/6 w-full focus:outline-none p-4 overflow-auto max-h-[60vh]" />
          }
          placeholder={
            <div className="editor-placeholder p-6 text-gray-400">
              Commencez à écrire...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <TablePlugin />
        <HashtagPlugin />
        <CommentsPlugin />
        <CommentsCollectorPlugin
          onCommentsChange={(editorCommentInstances: EditorCommentInstance[]) => {
            const sidebarComments: SidebarComment[] = editorCommentInstances.map(
              (instance) => ({
                id: instance.uuid,
                text: instance.textContent,
                commentText: instance.comments
                  .map((comment) => comment.content)
                  .join(', '),
                uuid: '',
              })
            );
            setComments(sidebarComments);
          }}
        />
        <SelectionPlugin onSelectionChange={setSelection} />
        <InitializeEditorState initialContent={initialContent} />
      </div>
      {selection && (
        <AnnotationForm
          selectedText={selection.text}
          onSubmit={handleAddComment}
          onCancel={() => setSelection(null)}
          position={{
            top: selection.rect.bottom + window.scrollY + 10,
            left: selection.rect.left + window.scrollX,
          }}
        />
      )}
    </div>
    <div className="flex flex-col md:flex-row justify-center items-center mt-4 gap-4">
  {returnButton}
  <SaveButton onSave={onSave} />
</div>

  </div>
  <div className="w-full lg:w-[300px] border-t lg:border-t-0 lg:border-l overflow-auto h-auto lg:h-[calc(80vh)] max-h-[calc(80vh)] flex flex-col">
    <div className="p-4 flex-1 overflow-auto">
      <h2 className="font-semibold mb-4">Commentaires</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-2 p-2 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-1">{comment.text}</p>
          <p className="text-sm text-muted-foreground">
            {comment.commentText}
          </p>
          <button
            onClick={() => handleRemoveComment(comment.id)}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Supprimer
          </button>
        </div>
      ))}
      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun commentaire pour le moment
        </p>
      )}
    </div>
  </div>
</div>

  );
};

const SaveButton: React.FC<{ onSave: (content: string) => void }> = ({ onSave }) => {
  const [editor] = useLexicalComposerContext();

  const handleSave = () => {
    editor.getEditorState().read(() => {
      const content = JSON.stringify(editor.getEditorState().toJSON());
      onSave(content);
    });
  };

  return (
    <Button onClick={handleSave} className="bg-[#ECB761] hover:bg-[#ECB761] text-white font-semibold px-6 py-2 rounded-lg">
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

export default LexicalEditor;