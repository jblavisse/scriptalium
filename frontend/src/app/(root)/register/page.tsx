
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  password2: string;
}

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        await axios.get(`${apiUrl}/api/get_csrf_token/`, {
          withCredentials: true,
        });
      } catch (err) {
        console.error('Erreur lors de l\'obtention du token CSRF', err);
      }
    };
    getCsrfToken();
  }, [apiUrl]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial.');
    }
    return errors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // Si l'utilisateur modifie le mot de passe, revalider
    if (name === 'password' || name === 'password2') {
      const newPasswordErrors = validatePassword(value);
      setPasswordErrors(newPasswordErrors);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setPasswordErrors([]);

    // Validation des mots de passe
    const currentPasswordErrors = validatePassword(form.password);
    if (currentPasswordErrors.length > 0) {
      setPasswordErrors(currentPasswordErrors);
      setError('Veuillez corriger les erreurs de mot de passe.');
      return;
    }

    // Vérifier que les mots de passe correspondent
    if (form.password !== form.password2) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const csrfToken = Cookies.get('csrftoken');

      const response = await axios.post(
        `${apiUrl}/api/register/`,
        {
          username: form.username,
          email: form.email,
          password: form.password,
          password2: form.password2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken || '',
          },
          withCredentials: true,
        }
      );
      setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setForm({
        username: '',
        email: '',
        password: '',
        password2: '',
      });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        const errorMessages = Object.values(errors).flat().join(' ');
        setError(`Erreur: ${errorMessages}`);
      } else {
        setError('Erreur lors de l\'inscription.');
      }
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
        {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={8} // Attribut HTML5
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password2" className="block text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={form.password2}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={8} // Attribut HTML5
            />
          </div>
          {passwordErrors.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded">
              <ul className="list-disc list-inside">
                {passwordErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="submit"
            className={`w-full p-2 rounded transition duration-200 ${
              passwordErrors.length > 0 || form.password !== form.password2
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={passwordErrors.length > 0 || form.password !== form.password2}
          >
            S'inscrire
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Déjà un compte ? <a href="/login" className="text-blue-500 hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default Register;