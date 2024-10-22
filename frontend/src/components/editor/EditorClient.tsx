'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const LexicalEditor = dynamic(() => import('@/components/editor'), { ssr: false });

const getCsrfToken = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/get-csrf-token/`, { withCredentials: true });
    console.log('CSRF cookie set:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios erreur lors de l\'obtention du jeton CSRF', error.response?.data || error.message);
    } else {
      console.error('Erreur inconnue lors de l\'obtention du jeton CSRF', error);
    }
  }
};


const EditorClient: React.FC = () => {
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

export default EditorClient;
