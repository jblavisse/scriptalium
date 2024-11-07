export interface EditorComment {
  userName: string;
  time: string;
  content: string;
}

export interface EditorCommentInstance {
  uuid: string;
  textContent: string;
  comments: EditorComment[];
}

export interface SidebarComment {
  id: string;
  text: string;
  commentText: string;
}