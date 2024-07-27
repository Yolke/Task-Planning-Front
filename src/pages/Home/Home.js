import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Task Manager</h1>
        <p>Organize your tasks efficiently</p>
        <Link to="/list-tasks" className="button">Go to Task List</Link>
      </header>
    </div>
  );
};

export default Home;
