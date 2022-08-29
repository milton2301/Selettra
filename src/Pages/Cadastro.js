import React, { useState, useEffect, useRef } from 'react';

import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import {Dropdown } from 'primereact/dropdown';
import './DataTableDemo.css';
import axios from 'axios';

const DataTableCrudCandidato = () => {

    let emptyCandidato = {
        id: '',
        nome: '',
        idade: '',
        sexo: '',
        cpf: '',
        rg: '',
        nacionalidade: '',
        estadocivil: '',
        ativo: '',
        dtcad: '',
        usercad: ''
    };

    const [candidatos, setCandidatos] = useState(null);
    const [candidatoDialog, setCandidatoDialog] = useState(false);
    const [deleteCandidatoDialog, setDeleteCandidatoDialog] = useState(false);
    const [deleteCandidatosDialog, setDeleteCandidatosDialog] = useState(false);
    const [candidato, setCandidato] = useState(emptyCandidato);
    const [selectedCandidatos, setSelectedCandidatos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedSexo, setSelectedSexo] = useState(null);
    const [selectedEstadoCivil, setSelectedEstadoCivil] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const load = useRef(null);

    const Api = axios.create({baseURL: 'http://localhost:8081/'});


    const fetchAllcandidatos = ()=>{
        load.current = true
        async function getAll(){
            const result = await Api.get("candidatos")
            if(result.data){
                setCandidatos(result.data)
            }
        }
        if(load.current){
            getAll()
        }
        load.current = false;
    }


    useEffect(() => {
        fetchAllcandidatos()
    },[]); 

    const newCandidatos=()=>{
        load.current=true;
        async function newCandidato(){
            const result = await Api.post("candidatos",{usercad: "Usuário"})
            if(result.data){
                candidato.id = result.data.id
                setSubmitted(false);
                setCandidatoDialog(true);
            }
        }
        if(load.current){
            newCandidato()
        }
        load.current=false
    }


    const saveDataCandidatos=(id)=>{
        load.current = true
        async function save(){
            const result = await Api.post(`candidatos/${id}/atualizar`,
            {id: id,
                nome: candidato.nome,
                idade: candidato.idade,
                sexo: selectedSexo,
                cpf: candidato.cpf,
                rg: candidato.rg,
                nacionalidade: candidato.nacionalidade,
                estadocivil: selectedEstadoCivil})
            if(result.data === true){
                setCandidato(emptyCandidato);
                setSubmitted(false);
                setCandidatoDialog(false);
                fetchAllcandidatos();
                setSelectedEstadoCivil(null);
                setSelectedSexo(null);
            }
        }
        if(load.current){
            save()
        }
        load.current =false
    }
    
    const dropCandidatos=(id)=>{
        load.current = true
            async function drop(){
                const response = await Api.post(`candidatos/${id}/excluir`,{
                    id: parseInt(id)  
                })
            if(response.data === true){
                fetchAllcandidatos()
            }
            }
            if(load.current){
                drop()
            }
        load.current =false
    }

    const openNew = () => {
        newCandidatos()
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCandidatoDialog(false);
        setSelectedSexo(null);
        setSelectedEstadoCivil(null)
    }

    const hideDeleteCandidatoDialog = () => {
        setDeleteCandidatoDialog(false);
    }

    const hideDeleteCandidatosDialog = () => {
        setDeleteCandidatosDialog(false);
    }

    const saveCandidato = () => {
        setSubmitted(true);

        if (candidato.nome.trim()) {
            let _candidatos = [...candidatos];
         
            if (candidato.id) {
                const index = findIndexById(candidato.id);
                if(index > 0){

                    saveDataCandidatos(candidato.id)
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Candidato Atualizado', life: 3000 });
                }else{
                    saveDataCandidatos(candidato.id)
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Candidato Criado', life: 3000 });
            }
            setCandidato(emptyCandidato);
        }

            setCandidatos(_candidatos);
            setCandidatoDialog(false);
        }
    }

    const editCandidato = (candidato) => {
        setCandidato({...candidato});
        setSelectedSexo(candidato.sexo);
        setSelectedEstadoCivil(candidato.estadocivil)
        setCandidatoDialog(true);
    }

    const confirmDeleteCandidato = (candidato) => {
        setCandidato(candidato);
        setDeleteCandidatoDialog(true);
    }

    const deleteCandidato = () => {
        let _candidatos = candidatos.filter(val => val.id !== candidato.id);
        let _roemoveCandidatos = candidatos.filter(val => val.id === candidato.id);
        let id = _roemoveCandidatos[0].id
        dropCandidatos(id)
        setCandidatos(_candidatos);
        setDeleteCandidatoDialog(false);
        setCandidato(emptyCandidato);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Candidato Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < candidatos.length; i++) {
            if (candidatos[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const confirmDeleteSelected = () => {
        setDeleteCandidatosDialog(true);
    }

    const deleteSelectedCandidatos = () => {
        let _candidatos = candidatos.filter(val => !selectedCandidatos.includes(val));
        Array.from(selectedCandidatos).forEach((val)=>{
            dropCandidatos(val.id)
        })
        setCandidatos(_candidatos);
        setDeleteCandidatosDialog(false);
        setSelectedCandidatos(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Candidatos Deleted', life: 3000 });
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _candidato = {...candidato};
        _candidato[`${name}`] = val;

        setCandidato(_candidato);
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Novo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Deletar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCandidatos || !selectedCandidatos.length} />
            </React.Fragment>
        )
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCandidato(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCandidato(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Candidatos Cadastrados</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    
    const candidatoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveCandidato} />
        </React.Fragment>
    );

    const deleteCandidatoDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCandidatoDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteCandidato} />
        </React.Fragment>
    );
    
    const deleteCandidatosDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCandidatosDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCandidatos} />
        </React.Fragment>
    );

    const sexoOpcoes=[
        {name:"Femenino", value:"Femenino"},
        {name:"Masculino", value:"Masculino"},
    ]

    const estadoCivilOpcoes=[
        {name:"Casado", value:"Casado"},
        {name:"Solteiro", value:"Solteiro"},
        {name:"Divorciado", value:"Divorciado"},
        {name:"Viuvo(a)", value:"Viuvo(a)"},
    ]

    return (
        <div className="datatable-crud">
            <Toast ref={toast} />


            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={candidatos} selection={selectedCandidatos} onSelectionChange={(e) => setSelectedCandidatos(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Vendo de {first} a {last} de {totalRecords} candidatos"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="id" header="Code" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="nome" header="Nome" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="idade" header="Idade" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="sexo" header="Sexo" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="estadocivil" header="Estado Civil" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column header="Ações" body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={candidatoDialog} style={{ width: '90%' }} header="Candidato Detalhes" modal className="p-fluid card" footer={candidatoDialogFooter} onHide={hideDialog}>
                
                <div className="grid card">
                <div className="col-4 md:col-4 lg:col-4">
                    <label htmlFor="nome">Nome</label>
                    <InputText id="nome" value={candidato.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className="p-inputtext	" />
                    {submitted && !candidato.nome && <small className="p-error">Name is required.</small>}
                </div>
                <div className="col-1 md:col-1 lg:col-1">
                    <label htmlFor="idade">Idade</label>
                    <InputText type="number" id="idade" value={candidato.idade} onChange={(e) => onInputChange(e, 'idade')} required autoFocus className={classNames({ 'p-invalid': submitted && !candidato.idade })} />
                    {submitted && !candidato.idade && <small className="p-error">IDADE is required.</small>}
                </div>
                <div className="col-2 md:col-2 lg:col-2">
                    <label htmlFor="sexo">Sexo</label>
                    <Dropdown value={selectedSexo} options={sexoOpcoes} onChange={(e)=>setSelectedSexo(e.value)} optionLabel="name" className={classNames({ 'p-invalid': submitted && !selectedSexo })}/>
                    {submitted && !selectedSexo && <small className="p-error">IDADE is required.</small>}
                </div>
                <div className="col-2 md:col-2 lg:col-2">
                    <label htmlFor="cpf">CPF</label>
                    <InputMask mask="999.999.999-99" value={candidato.cpf} onChange={(e) => onInputChange(e, 'cpf')} required autoFocus className={classNames({ 'p-invalid': submitted && !candidato.cpf })}></InputMask>
                    {submitted && !candidato.cpf && <small className="p-error">CPF is required.</small>}
                </div>
                <div className="col-2 md:col-2 lg:col-2">
                    <label htmlFor="rg">RG</label>
                    <InputMask mask="99.999.999-9" value={candidato.rg} onChange={(e) => onInputChange(e, 'rg')} required autoFocus className={classNames({ 'p-invalid': submitted && !candidato.rg })}></InputMask>
                    {submitted && !candidato.rg && <small className="p-error">RG is required.</small>}
                </div>
                <div className="col-3 md:col-3 lg:col-3">
                    <label htmlFor="nacionalidade">Nacionalidade</label>
                    <InputText id="nacionalidade" value={candidato.nacionalidade} onChange={(e) => onInputChange(e, 'nacionalidade')} required autoFocus className={classNames({ 'p-invalid': submitted && !candidato.nacionalidade })} />
                    {submitted && !candidato.nacionalidade && <small className="p-error">NACIONALIDADE is required.</small>}
                </div>
                <div className="col-2 md:col-2 lg:col-2">
                    <label htmlFor="estadocivil">Estado Civil</label>
                    <Dropdown value={selectedEstadoCivil} options={estadoCivilOpcoes} onChange={(e)=>setSelectedEstadoCivil(e.value)} optionLabel="name" className={classNames({ 'p-invalid': submitted && !selectedEstadoCivil })}/>
                    {submitted && !selectedSexo && <small className="p-error">Estado Civil is required.</small>}
                </div>
                </div>
            </Dialog>

            <Dialog visible={deleteCandidatoDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteCandidatoDialogFooter} onHide={hideDeleteCandidatoDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {candidato && <span>Tem certeza de que deseja excluir?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteCandidatosDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteCandidatosDialogFooter} onHide={hideDeleteCandidatosDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}} />
                    {candidato && <span>Tem certeza de que deseja excluir os candidatos selecionados?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default function Cadastro(){
    return <div className="card">
        <DataTableCrudCandidato/>
    </div>
}