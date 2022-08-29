import React from 'react';
import Logo from './imagens/logoRedondo.jpg'

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './Layout.css'

import {Menubar} from "primereact/menubar";

export default function Header(){
    
    const items = [
        {label: 'Home', icon: 'pi pi-fw pi-home',command:()=>{ window.location="/"; }},
        {
            label: 'Cadastro', icon: 'pi pi-fw pi-plus',
            items: [{label: 'Candidato', icon: 'pi pi-fw pi-user-plus',command:()=>{ window.location="/cadastro"; }},
                    {label: 'Vaga', icon: 'pi pi-fw pi-briefcase', command:()=>{ window.location="/cadastro"; }}]
        }
    ]

const img =()=>{
    return  <img className="imagem" src={Logo} alt='logo'></img>
}

        return(
            <Menubar model={items} end={img} />
               )
    }