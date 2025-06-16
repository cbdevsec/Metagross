// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../componants/Navbar';

export default function Dashboard({ onLogout }) {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    async function fetchClasses() {
      const querySnapshot = await getDocs(collection(db, 'classes'));
      setClasses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchClasses();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>School Dashboard</h1>
      <button onClick={onLogout}>Logout</button>
      <h2>Classes</h2>
      <ul>
        {classes.map(c => (
          <li key={c.id}>
            <strong>{c.name}</strong> - Schedule: {c.schedule}
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
}
