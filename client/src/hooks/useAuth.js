import { useEffect, useState } from 'react';

function useAuth() {
  const [auth, setAuth] = useState({ isAuthenticated: null, role: null });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8080/users/check-auth', {
          method: 'GET',
          credentials: 'include', // Assurez-vous d'inclure les cookies dans la requête
        });

        if (response.ok) {
          const data = await response.json(); // Assurez-vous que la réponse contient les informations sur l'utilisateur
          setAuth({
            isAuthenticated: true,
            role: data.role, // Assurez-vous que la réponse contient le rôle de l'utilisateur
          });
        } else {
          setAuth({ isAuthenticated: false, role: null });
        }
      } catch (error) {
        setAuth({ isAuthenticated: false, role: null });
      }
    };

    checkAuth();
  }, []);

  return auth;
}

export default useAuth;
