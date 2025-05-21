import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import JobsList from './pages/JobList';


function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<JobsList />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;