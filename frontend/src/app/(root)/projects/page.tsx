'use client'

import { useState } from 'react'
import { PlusCircle, Trash2, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function Component() {
  const [projects, setProjects] = useState([
    { id: 1, title: "There are many reasons to get down", content: "The only moment, the only life we have is in the NOW. What happened a few moments or several years ago is gone" },
    { id: 2, title: "There are many reasons to get down", content: "The only moment, the only life we have is in the NOW. What happened a few moments or several years ago is gone" },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({ title: '', content: '' })

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProject(prev => ({ ...prev, [name]: value }))
  }

  const createProject = () => {
    if (newProject.title && newProject.content) {
      setProjects([...projects, { id: Date.now(), ...newProject }])
      setNewProject({ title: '', content: '' })
      closeModal()
    }
  }

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Mes Projects :</h1>
        <div className="space-y-4">
          {projects.map(project => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <h2 className="font-semibold">{project.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{project.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4">
                <Button variant="ghost" size="sm">READ MORE</Button>
                <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <footer className="p-4 bg-white text-center">
        <Button onClick={openModal} className="mb-4">
          <PlusCircle className="mr-2 h-4 w-4" /> Créer un projet
        </Button>
        <p className="text-sm text-gray-600">Copyright</p>
      </footer>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau projet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Titre du projet</label>
              <Input
                id="title"
                name="title"
                value={newProject.title}
                onChange={handleInputChange}
                placeholder="Entrez le titre du projet"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="content">Description du projet</label>
              <Textarea
                id="content"
                name="content"
                value={newProject.content}
                onChange={handleInputChange}
                placeholder="Entrez la description du projet"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Annuler</Button>
            <Button onClick={createProject}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}