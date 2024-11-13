import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, LexicalNode, $isElementNode } from 'lexical';
import { $isCommentNode, EditorComment } from '../../annotation/CommentNode';

interface CollectedComment {
  uuid: string;
  textContent: string;
  comments: EditorComment[];
  id: string;
  text: string;
  commentText: string;
}

interface CommentsCollectorPluginProps {
  onCommentsChange: (comments: CollectedComment[]) => void;
}

export default function CommentsCollectorPlugin({
  onCommentsChange,
}: CommentsCollectorPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregister = editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const comments: CollectedComment[] = [];

        const traverse = (node: LexicalNode) => {
          if ($isCommentNode(node)) {
            const commentInstance = node.getComment();
            if (commentInstance) {
              comments.push({
                id: commentInstance.uuid,
                text: commentInstance.textContent,
                commentText: commentInstance.comments
                  .map((comment: EditorComment) => comment.content)
                  .join(', '),
                uuid: commentInstance.uuid,
                textContent: commentInstance.textContent,
                comments: commentInstance.comments,
              });
            }
          }
          if ($isElementNode(node)) {
            node.getChildren().forEach(traverse);
          }
        };

        root.getChildren().forEach(traverse);

        onCommentsChange(comments);
      });
    });

    return () => {
      unregister();
    };
  }, [editor, onCommentsChange]);

  return null;
}
