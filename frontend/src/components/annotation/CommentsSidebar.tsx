import React from 'react';
import { SidebarComment } from '../annotation/type';

interface CommentsSidebarProps {
  comments: SidebarComment[];
}

export default function CommentsSidebar({ comments }: CommentsSidebarProps) {
  return (
    <div className="w-64 bg-gray-100 p-4 border-l border-gray-300 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Commentaires</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500">Aucun commentaire</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment: { id: React.Key | null | undefined; text: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; commentText: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
            <li key={comment.id} className="p-2 bg-white rounded shadow">
              <p className="text-sm text-gray-700">
                <strong>Texte :</strong> {comment.text}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Annotation :</strong> {comment.commentText}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}