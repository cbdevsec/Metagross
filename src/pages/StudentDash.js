import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../componants/Navbar";
import Footer from "../componants/Footer";
import './studentdash.css'

const StudentDash = () => {
  const [studentData, setStudentData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = async (uid) => {
    const studentRef = doc(db, "users", uid);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const student = studentSnap.data();
      setStudentData(student);

      // Fetch assigned teacher info
      if (student.assignedTeacherId) {
        const teacherRef = doc(db, "users", student.assignedTeacherId);
        const teacherSnap = await getDoc(teacherRef);
        if (teacherSnap.exists()) {
          setTeacherData(teacherSnap.data());
        }
      }

      // Fetch schedule (assumes a 'schedules' collection keyed by classId)
      if (student.classId) {
        const scheduleRef = collection(db, "classes", student.classId, "schedule");
        const scheduleSnap = await getDocs(scheduleRef);
        const scheduleList = scheduleSnap.docs.map((doc) => doc.data());
        setSchedule(scheduleList);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchStudentData(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="studentdash-page">
        <h2>🎓 Student Dashboard</h2>

        {studentData ? (
          <div>
            <p><strong>Name:</strong> {studentData.fullName}</p>
            <p><strong>Class:</strong> {studentData.classId}</p>
            <p><strong>Grade:</strong> {studentData.grade || "N/A"}</p>
            <p><strong>Assigned Teacher:</strong> {teacherData ? teacherData.fullName : "Not Assigned"}</p>

            <h3>📅 Schedule:</h3>
            {schedule.length === 0 ? (
              <p>No schedule available</p>
            ) : (
              <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem" }}>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Subject</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                 {schedule.map((item, index) => (
                    <tr key={index}>
                      <td>{item.day}</td>
                      <td>{item.subject}</td>
                      <td>{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <p>Student data not found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default StudentDash;
