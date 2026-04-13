import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { AuthContext } from "../auth/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // 👈 ADD THIS

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      login(res.data);

      // ✅ REDIRECT AFTER LOGIN
      navigate("/");   // or "/dashboard"
      
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}