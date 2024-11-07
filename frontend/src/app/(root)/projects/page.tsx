'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Project {
  id: number;
  title: string;
  description: string;
  editor_content: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtenir le token CSRF
        const csrfResponse = await axios.get(`${apiUrl}/api/get-csrf-token/`, { withCredentials: true });
        const csrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(csrfToken);
        axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
        axios.defaults.headers.put['X-CSRFToken'] = csrfToken;
        axios.defaults.headers.delete['X-CSRFToken'] = csrfToken;

        // Obtenir l'utilisateur
        const userResponse = await axios.get(`${apiUrl}/api/auth/user/`, { withCredentials: true });
        if (!userResponse.data.id) {
          router.push('/login');
          return;
        }

        // Obtenir les projets
        const projectsResponse = await axios.get(`${apiUrl}/api/projects/`, {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken,
          },
        });
        setProjects(projectsResponse.data);
      } catch (error) {
        router.push('/login');
      }
    };
    fetchData();
  }, [apiUrl, router]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const createProject = async () => {
    if (newProject.title && newProject.description) {
      try {
        const response = await axios.post(`${apiUrl}/api/projects/`, newProject, {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken,
          },
        });
        setProjects([...projects, response.data]);
        setNewProject({ title: '', description: '' });
        closeModal();
        router.push(`/editor/${response.data.id}`);
      } catch (error) {
        // Vous pouvez ajouter une gestion des erreurs ici
      }
    } else {
      // Vous pouvez ajouter une validation ou une notification ici
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/projects/${id}/`, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      setProjects(projects.filter(project => project.id !== id));
      setProjectToDelete(null);
    } catch (error) {
      // Vous pouvez ajouter une gestion des erreurs ici
    }
  };

  const confirmDelete = (id: number) => {
    setProjectToDelete(id);
  };

  const handleReadMore = (id: number) => {
    router.push(`/editor/${id}`);
  };

  if (!apiUrl) {
    return <div className="text-red-500">Erreur : L&apos;URL de l&apos;API n&apos;est pas définie.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow p-6">
        <div className="container mx-auto flex flex-col items-center">
          
          {/* Conteneur des cartes au centre */}
          <div className="w-full md:w-2/3 space-y-6 max-h-[80vh] overflow-y-auto">
            {projects.map(project => (
              <Card key={project.id} id={`project-${project.id}`} className="shadow-lg rounded-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">Titre du Projet: {project.title}</h2>
                  <p className="text-base text-gray-700 mb-1">Description du Projet:</p>
                  <p>{project.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-6">
                  <button
                    className="flex items-center text-white bg-[#8B86BE] hover:bg-opacity-90 font-semibold py-2 px-4 rounded shadow transition duration-200 ease-in-out"
                    onClick={() => handleReadMore(project.id)}
                  >
                    Accéder à l&apos;Éditeur
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => confirmDelete(project.id)}>
                    <Trash2 className="h-6 w-6 text-red-500 hover:text-red-700" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="p-6 bg-white text-center">
        <Button 
          onClick={openModal} 
          className="mb-4 px-6 py-3 font-semibold text-black bg-[#CBD690] hover:bg-[#B8C777] hover:shadow-lg hover:scale-105 rounded shadow transition duration-300 ease-in-out"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Créer un Projet
        </Button>
        <p className="text-sm text-gray-600">© 2024 Scriptalium</p>
      </footer>

      {/* Modal pour la création de projet */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un Nouveau Projet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Titre du Projet</label>
              <Input
                id="title"
                name="title"
                value={newProject.title}
                onChange={handleInputChange}
                placeholder="Entrez le titre du projet"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Description du Projet</label>
              <Textarea
                id="description"
                name="description"
                value={newProject.description}
                onChange={handleInputChange}
                placeholder="Entrez la description du projet"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Annuler</Button>
            <Button onClick={createProject} className='bg-[#CBD690] hover:bg-[#B8C777] font-semibold text-black'>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {projectToDelete !== null && (
        <Dialog open={true} onOpenChange={() => setProjectToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmation de Suppression</DialogTitle>
            </DialogHeader>
            <p>Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProjectToDelete(null)}>Annuler</Button>
              <Button onClick={() => deleteProject(projectToDelete)} className='bg-red-500 hover:bg-red-700 font-semibold text-white'>Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
