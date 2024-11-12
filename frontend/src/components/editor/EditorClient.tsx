'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Notification } from '../notification/Notification';
import { NavbarComponent } from "@/components/ui/navbar";
import { Footer } from '@/components/ui/footer';

const LexicalEditor = dynamic(() => import('@/components/editor/index'), { ssr: false });

interface Project {
  id: number;
  title: string;
  description: string;
  editor_content: string;
  created_at: string;
  updated_at: string;
}

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

export default function EditorClient() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const initialize = async () => {
      try {
        // Obtenir le token CSRF
        const csrfResponse = await axios.get(`${apiUrl}/api/get-csrf-token/`, { withCredentials: true });
        const csrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(csrfToken);
        axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
        axios.defaults.headers.put['X-CSRFToken'] = csrfToken;
        axios.defaults.headers.delete['X-CSRFToken'] = csrfToken;
        axios.defaults.withCredentials = true; 

        // Obtenir le projet
        if (id) {
          const projectResponse = await axios.get(`${apiUrl}/api/projects/${id}/`);
          setProject(projectResponse.data);
          setLoading(false);
        } else {
          setError('ID de projet manquant.');
          setLoading(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.detail || 'Erreur lors de l\'initialisation.');
        } else {
          setError('Erreur inconnue lors de l\'initialisation.');
        }
        setLoading(false);
      }
    };
    initialize();
  }, [apiUrl, id]);

  const saveProjectContent = async (content: string) => {
    if (!project || !id) {
      setNotification({ message: 'Projet non chargé.', type: 'error' });
      return;
    }

    try {
      const updatedProject = {
        ...project,
        editor_content: content,
      };
      const response = await axios.put(`${apiUrl}/api/projects/${id}/`, updatedProject, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      setProject(response.data);
      setNotification({ message: 'Projet sauvegardé avec succès.', type: 'success' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erreur Axios lors de la sauvegarde du projet:', error.response?.data || error.message);
        setNotification({ message: 'Erreur lors de la sauvegarde du projet.', type: 'error' });
      } else {
        console.error('Erreur inconnue lors de la sauvegarde du projet:', error);
        setNotification({ message: 'Erreur inconnue lors de la sauvegarde du projet.', type: 'error' });
      }
    }
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!project) {
    return <div className="p-4">Projet non trouvé.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponent /> 
      <div className="p-4 flex-grow">
        <div className="bg-[#8B86BE] p-3 sm:p-4 rounded-lg shadow-md mb-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
            </svg>
            <h1 className="text-lg sm:text-xl font-semibold text-white">
              Projet: {project.title}
            </h1>
          </div>
        </div>
        <LexicalEditor
          initialContent={project.editor_content || ''}
          onSave={saveProjectContent}
          returnButton={
            <Button
              className='bg-[#8B86BE] hover:bg-[#8B86BE] text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 active:scale-95'
              onClick={() => router.push('/projects')}
            >
              Retour à la liste des projets
            </Button>
          }
        />
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
