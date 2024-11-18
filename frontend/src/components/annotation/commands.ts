import { createCommand } from 'lexical';
import { EditorCommentInstance } from './CommentNode';

export const ADD_COMMENT_COMMAND = createCommand<{ commentInstance: EditorCommentInstance }>('ADD_COMMENT_COMMAND');
export const REMOVE_COMMENT_COMMAND = createCommand<{ uuid: string }>('REMOVE_COMMENT_COMMAND');