import React from 'react';
import logo from './logo.svg';
import './App.css';
import Routing from './app/Routing';
import { useNavigate } from 'react-router-dom';
import Navber from './components/navbar';



function App() {
  const navigate = useNavigate()

  return (
    <div className='App'>
      <Routing></Routing> 
    

    </div>
  );
}

export default App;
