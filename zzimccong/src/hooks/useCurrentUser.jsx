import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    let parsedUser;

    if (!userString) {
      navigate('/account');
      return;
    }

    try {
      parsedUser = JSON.parse(userString);
      console.log("Parsed user from localStorage:", parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      navigate('/account');
    }
  }, [navigate]);

  return user;
}
