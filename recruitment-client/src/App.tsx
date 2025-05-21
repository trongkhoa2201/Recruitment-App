import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import JobsList from './pages/JobList';
import JobForm from './components/JobForm';
import JobEditWrapper from './components/JobEditWrapper';


function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<JobsList role='recruiter'/>} />
        <Route path="/jobs/create" element={<JobForm role='recruiter' initialValues={{ title: "", description: "", tags: "" }} isEdit={false}/>} />
        <Route path="/jobs/edit/:id" element={<JobEditWrapper />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;