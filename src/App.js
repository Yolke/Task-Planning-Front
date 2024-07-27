import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Utilisez Routes au lieu de Switch
import Home from './pages/Home/Home';
import ListTasks from './pages/list-tasks/ListTasks';
import Navbar from './components/NavBar/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list-tasks" element={<ListTasks />} />
      </Routes>
    </Router>
  );
};

export default App;
