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
import EditPersonalInfo from './components/EditPersonalInfo'
import ContactInfo from './components/ContactInfo';
import IdentificationCard from './components/IdentificationCard';
import SocialNetworkingPages from './components/SocialNetworkingPages';
import EditContactInfo from './components/EditContactInfo';
import EditSocialNetworking from './components/EditSocialNetworking';
import EditIdentificationCard from './components/EditIdentificationCard';
import ErrorPage from './components/ErrorPage';
import OtpPage from './components/OtpPage';

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
          <Route path="/personal" element={<PersonalDataPage />} />
          <Route path="/editpersonal" element={<EditPersonalInfo />} />
          <Route path="/contact-info" element={<ContactInfo />} />
          <Route path="/identification-card" element={<IdentificationCard />} />
          <Route path="/social-networking" element={<SocialNetworkingPages />} />
          <Route path="/edit-contact-info" element={<EditContactInfo />} />
          <Route path="/edit-Social" element={<EditSocialNetworking />} />
          <Route path="/edit-identification-card" element={<EditIdentificationCard />} />
          <Route path="/error/:code" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/OTP" element={<OtpPage />} />
        </Routes>
      </Router>   
    </div>
  );
}

export default App;
