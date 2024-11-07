import React, { useState } from 'react';

interface AnnotationFormProps {
  selectedText: string;
  onSubmit: (commentText: string) => void;
  onCancel: () => void;
  position: {
    top: number;
    left: number;
  };
}

export default function AnnotationForm({
  selectedText,
  onSubmit,
  onCancel,
  position,
}: AnnotationFormProps) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() !== '') {
      onSubmit(commentText);
      setCommentText('');
    }
  };

  return (
    <div
      className="absolute bg-white border border-gray-300 rounded shadow-lg p-4 z-10"
      style={{ top: position.top, left: position.left }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 annotation-form">
        <label className="text-sm">
          Comment for: <strong>{selectedText}</strong>
        </label>
        <textarea
          className="border p-2 rounded"
          placeholder="Enter your comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Comment
          </button>
        </div>
      </form>
    </div>
  );
}