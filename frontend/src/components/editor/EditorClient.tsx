'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Notification } from '../notification/Notification'

const LexicalEditor = dynamic(() => import('@/components/editor/index'), { ssr: false })

interface Project {
  id: number
  title: string
  description: string
  editor_content: string
  created_at: string
  updated_at: string
}

interface NotificationState {
  message: string
  type: 'success' | 'error'
}

export default function EditorClient() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<NotificationState | null>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (id) {
      fetchProject(id as string)
      getCsrfToken()
    }
  }, [id])

  const getCsrfToken = async () => {
    try {
      await axios.get(`${apiUrl}/api/get-csrf-token/`)
    } catch (error) {
      console.error('Erreur lors de l\'obtention du jeton CSRF', error)
    }
  }

  const fetchProject = async (projectId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/projects/${projectId}/`)
      setProject(response.data)
      setLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.detail || 'Erreur lors de la récupération du projet')
      } else {
        setError('Erreur inconnue lors de la récupération du projet')
      }
      setLoading(false)
    }
  }

  const saveProjectContent = async (content: string) => {
    try {
      const updatedProject = {
        ...project,
        editor_content: content,
      }
      const response = await axios.put(`${apiUrl}/projects/${id}/`, updatedProject)
      setProject(response.data)
      setNotification({ message: 'Projet sauvegardé avec succès', type: 'success' })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erreur Axios lors de la sauvegarde du projet', error.response?.data || error.message)
        setNotification({ message: 'Erreur lors de la sauvegarde du projet', type: 'error' })
      } else {
        console.error('Erreur inconnue lors de la sauvegarde du projet', error)
        setNotification({ message: 'Erreur inconnue lors de la sauvegarde du projet', type: 'error' })
      }
    }
  }

  if (loading) {
    return <div className="p-4">Chargement...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!project) {
    return <div className="p-4">Projet non trouvé.</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Éditeur de Projet: {project.title}</h1>
      <LexicalEditor initialContent={project.editor_content || ''} onSave={saveProjectContent} />
      <div className="mt-4">
        <Button onClick={() => router.push('/projects')}>Retour à la liste des projets</Button>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  )
}