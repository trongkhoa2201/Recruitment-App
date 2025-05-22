import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import JobsList from './pages/JobList';
import JobForm from './components/JobForm';
import JobEditWrapper from './components/JobEditWrapper';


function App() {

  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setRole(user.role);
    } else {
      setRole("");
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route
            path="/login"
            element={<LoginForm onLogin={(role) => setRole(role)} />}
          />
        <Route path="/" element={<JobsList role={role}/>} />
        <Route path="/jobs/create" element={<JobForm role={role} initialValues={{ title: "", description: "", tags: "" }} isEdit={false}/>} />
        <Route path="/jobs/edit/:id" element={<JobEditWrapper />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;