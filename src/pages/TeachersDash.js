import React, { useEffect, useState } from "react";
import { db, auth } from "./../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import './teachersdash.css'
import Navbar from "../componants/Navbar";
import Footer from "../componants/Footer";

const TeacherDash = () => {
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherAndStudents = async () => {
      setLoading(true);

      // Get current user
      onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        // Get teacher info
        const teacherDoc = await getDoc(doc(db, "users", user.uid));
        const teacherData = teacherDoc.data();
        const teacherClassId = teacherData?.classId;

        setClassId(teacherClassId);

        if (teacherClassId) {
          // Fetch students in the same class
          const userSnap = await getDocs(collection(db, "users"));
          const sameClassStudents = [];

          userSnap.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.role === "student" && data.classId === teacherClassId) {
              sameClassStudents.push({ id: docSnap.id, ...data });
            }
          });

          setStudents(sameClassStudents);
        }

        setLoading(false);
      });
    };

    fetchTeacherAndStudents();
  }, []);

  if (loading) return <p>Loading students...</p>;

  return (
    <>
    <Navbar />
      <div className="teachersdash-page">
        <h2>Teacher Dashboard</h2>
        <p><strong>Class ID:</strong> {classId}</p>
        <h3>Students in Your Class</h3>
        {students.length === 0 ? (
          <p>No students assigned to this class yet.</p>
        ) : (
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                {student.fullName || student.email}
                {/* Add a button to view or add grades */}
                <button onClick={() => alert(`Grade view for ${student.fullName || student.email}`)}>
                  View/Add Grades
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TeacherDash;
