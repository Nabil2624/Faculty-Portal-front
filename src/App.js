import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import TestLanguage from './TestLanguage';
import { Translation } from 'react-i18next';
import { Route } from 'react-router-dom';
import RegisterPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import Header from './components/Header';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import PersonalDataPage from './components/PersonalDataPage';
function App() {
  return (
    <div className="App">
       <Router>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
           <Route path="/header" element={<Header />} />
            <Route path="/layout" element={<Layout />} />
             <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/personal-page" element={<PersonalDataPage />} />
        </Routes>
      </Router>   
    </div>
  );
}

export default App;
