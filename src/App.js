import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useRef } from 'react';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

/****Layouts*****/
import Header from './Layout/Header';
/****Layouts*****/

/***Impore from pages****/
import Home from './Pages/Home';
import Cadastro from './Pages/Cadastro'
import Vagas from './Pages/Vagas';
import Candidatures from './Pages/Candidatures'
/***Impore from pages****/

export default function App() {

  return (
    <div className="App">
<Router>
<Header/>
          <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route path="/cadastro" element={<Cadastro/>}/>
          <Route path="/vaga" element={<Vagas/>}/>
          <Route path="/candidaturas" element={<Candidatures/>}/>
          </Routes>
    </Router>
    </div>
  );
}