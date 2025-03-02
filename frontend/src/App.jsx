import { useState } from 'react'
import './App.css'
import Navbar from './navbar'
import Hero from './hero'
import JobDescriptionUpload from './jobDescriptionUpload'
import HowHelpful from './howHelpful'
import FirstStep from './firstStep'
import Footer from './footer'
import FeedbackPopup from './feedbackPopup'
import GetSetUpskill from './getSetUpskill'
import Login from './Pages/login'
import Signup from './Pages/signup'
import About from './Pages/about'
import Contact from './Pages/contact'
import Questions from './Pages/questions'
import { Routes, Route, Navigate } from 'react-router-dom';

// Home component with all landing page sections
const Home = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <JobDescriptionUpload/>
      <HowHelpful/>
      <GetSetUpskill/>
      <FirstStep/>
      <FeedbackPopup/>
      <Footer/>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/questions" element={<Questions/>} />
      {/* Redirect all unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
