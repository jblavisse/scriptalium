'use client';
import React, { useEffect } from 'react';
import LexicalEditor from '@/components/editor';
import axios from 'axios';

export const getCsrfToken = async () => {
  try {
    await axios.get('http://localhost:8000/api/get-csrf-token/', { withCredentials: true });
    console.log('CSRF cookie set');
  } catch (error) {
    console.error('Erreur lors de l\'obtention du jeton CSRF', error);
  }
};

const Home: React.FC = () => {
  useEffect(() => {
    getCsrfToken();
  }, []);
  return (
    <div>
      <h1 className="text-3xl text-red-700">Mon éditeur Lexical dans Next.js (TSX)</h1>
      <LexicalEditor />
    </div>
  );
};

export default Home;
