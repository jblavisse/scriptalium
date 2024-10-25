import React from 'react';
import EditorClient from '@/components/editor/EditorClient';

const EditorPage: React.FC = () => {
  return (
    <EditorClient />
  );
};

export default EditorPage;

import React from 'react';
import LexicalEditor from '@/components/editor';
// import './styles/test.css'

const Home: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl text-red-700">Mon éditeur Lexical dans Next.js (TSX)</h1>
      <LexicalEditor />
    </div>
  );
};

export default Home;
