import React, { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  createCommand,
  COMMAND_PRIORITY_LOW,
  $createRangeSelection,
  $setSelection,
  $createParagraphNode,
  $createTextNode,
  TextNode,
  ElementNode,
  $isTextNode,
  $getRoot,
  LexicalNode,
  $isElementNode,
} from 'lexical';
import CommentNode, { $createCommentNode, $isCommentNode } from '../../annotation/CommentNode';
import { EditorCommentInstance } from '../../annotation/type'; 

export const ADD_COMMENT_COMMAND = createCommand<{ commentInstance: EditorCommentInstance }>('ADD_COMMENT_COMMAND');
export const REMOVE_COMMENT_COMMAND = createCommand<{ uuid: string }>('REMOVE_COMMENT_COMMAND');

export default function CommentsPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeCommand = editor.registerCommand(
      ADD_COMMENT_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const selectedText = selection.getTextContent();

            if (!selectedText.trim()) {
              console.warn('Cannot add a comment to empty selection.');
              return false;
            }

            const commentInstance = payload.commentInstance;
            const commentNode = $createCommentNode(commentInstance) as CommentNode;

            // Créer un TextNode avec le texte sélectionné
            const textNode = $createTextNode(selectedText);
            commentNode.append(textNode);

            // Insérer le CommentNode en remplaçant la sélection
            selection.insertNodes([commentNode]);

            // Optionnel : placer le curseur après le CommentNode
            const parent = commentNode.getParentOrThrow() as ElementNode;
            const index = parent.getChildren().indexOf(commentNode);
            const nextNode = parent.getChildren()[index + 1];

            if (nextNode) {
              const newSelection = $createRangeSelection();

              if ($isTextNode(nextNode)) {
                newSelection.anchor.set(nextNode.getKey(), 0, 'text');
                newSelection.focus.set(nextNode.getKey(), 0, 'text');
              } else {
                newSelection.anchor.set(nextNode.getKey(), 0, 'element');
                newSelection.focus.set(nextNode.getKey(), 0, 'element');
              }

              $setSelection(newSelection);
            } else {
              const newParagraph = $createParagraphNode();
              commentNode.insertAfter(newParagraph);

              const newSelection = $createRangeSelection();
              newSelection.anchor.set(newParagraph.getKey(), 0, 'element');
              newSelection.focus.set(newParagraph.getKey(), 0, 'element');
              $setSelection(newSelection);
            }

            console.log('Comment added successfully.');
          }
        });
        return true;
      },
      COMMAND_PRIORITY_LOW
    );

    const removeRemoveCommand = editor.registerCommand(
      REMOVE_COMMENT_COMMAND,
      (payload) => {
        editor.update(() => {
          const { uuid } = payload;
          const root = $getRoot();

          // Parcours récursif des nœuds à partir de la racine
          function traverseNodes(node: LexicalNode) {
            if ($isCommentNode(node)) {
              const nodeUuid = node.getComment().uuid;
              console.log(`Found CommentNode with UUID: ${nodeUuid}`);
              if (nodeUuid === uuid) {
                const children = node.getChildren();
                for (const child of children) {
                  node.insertBefore(child);
                }
                node.remove();
                console.log(`Comment with UUID ${uuid} removed successfully, text preserved.`);
                return;
              }
            }

            if ($isElementNode(node)) {
              const children = node.getChildren();
              for (const child of children) {
                traverseNodes(child);
              }
            }
          }

          traverseNodes(root);
        });
        return true;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeCommand();
      removeRemoveCommand();
    };
  }, [editor]);

  return null;
}