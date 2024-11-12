import React from 'react';
import { EditorCommentInstance } from './type';

interface CommentComponentProps {
  node: any;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ node }) => {
  const { textContent, comments } = node.__commentInstance;

  return (
    <span className="bg-yellow-300 relative">
      {textContent}
      <span className="absolute -top-2 -right-2 text-xs text-gray-500">
        {comments.length} commentaire{comments.length !== 1 ? 's' : ''}
      </span>
    </span>
  );
}

export default CommentComponent;
