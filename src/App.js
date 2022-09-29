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
import Cadastro from './Pages/Cadastro'
import Vagas from './Pages/Vagas';
import Candidaturas from './Pages/Candidaturas'
/***Impore from pages****/

export default function App() {

  return (
    <div className="App">
<Router>
<Header/>
          <Routes>
          <Route exact path="/" element={""}/>
          <Route path="/cadastro" element={<Cadastro/>}/>
          <Route path="/vaga" element={<Vagas/>}/>
          <Route path="/candidaturas" element={<Candidaturas/>}/>
          </Routes>
    </Router>
    </div>
  );
}