import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where, setDoc } from "firebase/firestore";
import Navbar from "../componants/Navbar";
import Footer from "../componants/Footer";
import './admindash.css'

const AdminsDash = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setapprovedUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  // Fetch all pending users
  const fetchPendingUsers = async () => {
    const q = query(collection(db, "users"), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPendingUsers(users);
  };

    // Fetch all users
  const fetchUsers = async () => {
    const q = query(collection(db, "users"), where("status", "==", "approved"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setapprovedUsers(users);
  };

  // Approve a user
  const approveUser = async (userId) => {
    await updateDoc(doc(db, "users", userId), {
      status: "approved",
    });
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
  };

      const loadData = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const allStudents = [];
      const allTeachers = [];

      usersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.role === "student") allStudents.push({ id: docSnap.id, ...data });
        if (data.role === "teacher") allTeachers.push({ id: docSnap.id, ...data });
      });

      const classSnap = await getDocs(collection(db, "classes"));
      const allClasses = classSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
      setStudents(allStudents);
      setTeachers(allTeachers);
      setClasses(allClasses);
    
    };
  // Reject (delete) a user
  const rejectUser = async (userId) => {
    await deleteDoc(doc(db, "users", userId));
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
  };
  
  const restrictUser = async (userId) => {
  await updateDoc(doc(db, "users", userId), {
      status: "pending",
    });
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
  alert("User restricted");
  };

  // Add new class
  const handleAddClass = async () => {
    if (!newClassName) return;
    const classRef = doc(collection(db, "classes"));
    await setDoc(classRef, { name: newClassName });
    setNewClassName("");
    alert("Class created!");
  };

  const handleDeleteClass = async (classId) => {
    await deleteDoc(doc(db, "classes", classId));

    // Unassign classId from all users (teachers & students)
    const usersSnap = await getDocs(collection(db, "users"));
    usersSnap.forEach(async (docSnap) => {
      const data = docSnap.data();
      if (data.classId === classId) {
        await updateDoc(doc(db, "users", docSnap.id), { classId: "" });
      }
    });

    alert("Class deleted and users unassigned.");
  };

   // Assign teacher to classId
  const assignTeacher = async () => {
    if (!selectedTeacherId || !selectedClassId) return;
    await updateDoc(doc(db, "users", selectedTeacherId), {
      classId: selectedClassId,
    });
    alert("Teacher assigned to class!");
  };

  // Assign student to classId
  const assignStudentToClass = async (studentId, classId) => {
    await updateDoc(doc(db, "users", studentId), {
      classId,
    });
    alert("Student assigned to class!");
  };


  useEffect(() => {
    fetchPendingUsers();
    fetchUsers();
    loadData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="admin-dash">
        <div className="pending-table">
        <h2>📋 Pending User Applications</h2>

        {pendingUsers.length === 0 ? (
          <p>No pending applications ✅</p>
        ) : (
          <table border="1" cellPadding="10" style={{ marginTop: "1rem", width: "100%" }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.fullName || "N/A"}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => approveUser(user.id)}>✅ Approve</button>{" "}
                    <button onClick={() => rejectUser(user.id)} style={{ color: "red" }}>
                      ❌ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>

        <div className="users-table">
        <h2>📋 Current User List</h2>

        {approveUser.length === 0 ? (
          <p>No users available ✅</p>
        ) : (
          <table border="1" cellPadding="10" style={{ marginTop: "1rem", width: "100%" }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.fullName || "N/A"}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => restrictUser(user.id)}>Restrict</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
        <div className="add-new-class">
          <h3>Add New Class</h3>
          <input
            placeholder="Class name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <button onClick={handleAddClass}>Add Class</button>
        </div>
        <div className="classes-list">
          <h3>All Classes</h3>
          <ul>
            {classes.map((cls) => (
              <li key={cls.id}>
                {cls.name}
                <button onClick={() => handleDeleteClass(cls.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="teahcer-to-class">
          <h3>Assign Teacher to Class</h3>
          <select onChange={(e) => setSelectedClassId(e.target.value)} value={selectedClassId}>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          <select onChange={(e) => setSelectedTeacherId(e.target.value)} value={selectedTeacherId}>
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName || t.email}
              </option>
            ))}
          </select>
          <button onClick={assignTeacher}>Assign Teacher</button>
        </div>
        <div className="students-to-teachers">
          <h3>Assign Students to Classes</h3>
            {students.map((student) => (
              <div key={student.id}>
                <strong>{student.fullName || student.email}</strong>
                <select
                  onChange={(e) => assignStudentToClass(student.id, e.target.value)}
                  value={student.classId || ""}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminsDash;
