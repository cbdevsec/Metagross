import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Navbar from "../componants/Navbar";
import Footer from "../componants/Footer";
import './signup.css'

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [classId, setClassId] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        role,
        fullName,
        classId,
        status: "pending", // requires admin approval
        createdAt: new Date()
      });

      alert("Signup successful! Await admin approval.");
    } catch (err) {
      alert("Signup error: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-page">
        <form onSubmit={handleSignup} className="form-inputs">
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option> {/* Optional */}
          </select>
          <input
            type="text"
            placeholder="Class ID (optional)"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Signup;
