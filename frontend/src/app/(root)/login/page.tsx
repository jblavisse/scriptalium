'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NavbarComponent } from "@/components/ui/navbar";
import { Footer } from '@/components/ui/footer';

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login/`, { username, password }, { withCredentials: true })
      if (response.status === 200) {
        router.push('/projects')
      }
    } catch (error) {
      console.error("Error during login", error)
      alert("Erreur lors de la connexion.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#8B86BE] to-[#86ABBA]">
      <NavbarComponent />
      <div className="flex flex-grow justify-center items-center">
        <Card className="w-[450px] max-w-[90vw] shadow-md bg-white rounded-lg border border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center ">Login</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entrez vos identifiants
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                placeholder="Votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-gray-300 focus:border-[#ECB761] focus:ring-[#ECB761]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 focus:border-[#ECB761] focus:ring-[#ECB761]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full flex justify-center items-center bg-[#ECB761] hover:bg-[#DEB0BD] text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 active:scale-95" 
              onClick={handleLogin} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 border-2 border-t-2 border-white rounded-full animate-spin"></span>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
