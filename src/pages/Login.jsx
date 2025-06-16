import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './login.css'
import Navbar from '../componants/Navbar';
import Footer from '../componants/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        setError('No user profile found.');
        return;
      }

      const userData = userDocSnap.data();

      if (userData.status !== 'approved') {
        setError('Account pending admin approval.');
        return;
      }

      // Redirect based on role
      switch (userData.role) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          setError('Unknown user role.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
        <Navbar />
        <div className='login-form'>
        <h2>Login</h2>
        <form onSubmit={login}>
            <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
        <p
            onClick={() => navigate("/Signup")}
            style={{ cursor: "pointer", color: "blue" }}
        >
            Don't have an account? Sign up
        </p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <Footer />
    </div>
  );
};

export default Login;
