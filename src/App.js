import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Pages
import LoginPage from "./pages/Login";
import SignupPage from './pages/Signup'
import StudentDash from "./pages/StudentDash";
import TeacherDash from "./pages/TeachersDash";
import AdminDash from "./pages/AdminsDash";
import MainHome from "./pages/MainHome";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Signup" element={<SignupPage />} />
        <Route path="/home" element={<MainHome />} />

        {/* Redirect user to correct dashboard */}
        <Route
          path="/dashboard"
          element={
            user ? (
              role === "student" ? (
                <Navigate to="/student-dashboard" />
              ) : role === "teacher" ? (
                <Navigate to="/teacher-dashboard" />
              ) : role === "admin" ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <div>Unauthorized</div>
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/student-dashboard"
          element={user && role === "student" ? <StudentDash /> : <Navigate to="/" />}
        />
        <Route
          path="/teacher-dashboard"
          element={user && role === "teacher" ? <TeacherDash /> : <Navigate to="/" />}
        />
        <Route
          path="/admin-dashboard"
          element={user && role === "admin" ? <AdminDash /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
