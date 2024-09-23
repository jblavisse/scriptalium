import React from 'react';
import LexicalEditor from '../components/LexicalEditor';
import './styles/test.css'

const Home: React.FC = () => {
  return (
    <div>
      <h1>Mon éditeur Lexical dans Next.js (TSX)</h1>
      <LexicalEditor />
    </div>
  );
};

export default Home;
