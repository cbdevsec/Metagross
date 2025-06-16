import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer', color: 'blue'}}>
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </p>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}