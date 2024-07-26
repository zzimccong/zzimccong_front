import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>

      <Router>
      <Header />
        <Routes>
        
          <Route path="/" element={<Home />} />
          
        </Routes>
        <Navbar />
      </Router>

    </div>
  );
}

export default App;
