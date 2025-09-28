import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavbarLoggedOut from './components/NavbarLoggedOut'; // Exact name
import NavbarLoggedIn from './components/NavbarLoggedIn'; // Exact name
import Home from './pages/Home';
import Skills from './pages/Skills';
import Jobs from './pages/Jobs';
import Login from './pages/Login'; // Exact name
import Signup from './pages/Signup'; // Exact name

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simple state

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conditional navbar */}
      {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
