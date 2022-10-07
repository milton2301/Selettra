
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import './DataTableDemo.css';
import axios from 'axios';

const DataTableCrud = () => {

    let emptyCandidatura = {
        id: "",
        dtcad: "",
        usercad: "",
        ativo: "",
        idcandidato: "",
        idvaga: "",
        nomecandidato: "",
        nomevaga: "",
        status: "",
        observacoes:""
    };

    let emptyCandidaturaObs = {
        id: "",
        dtcad: "",
        usercad: "",
        ativo: "",
        idcandidato: "",
        idvaga: "",
        descricao: "",
    };


    const [candidaturas, setCandidaturas] = useState(null);
    const [candidaturaDialog, setCandidaturaDialog] = useState(false);
    const [obsevacoesDialog, setObsevacoesDialog] = useState(false);
    const [deleteCandidaturaDialog, setDeleteCandidaturaDialog] = useState(false);
    const [deleteCandidaturasDialog, setDeleteCandidaturasDialog] = useState(false);
    const [candidatura, setCandidatura] = useState(emptyCandidatura);
    const [obs, setObs] = useState(emptyCandidaturaObs);
    const [selectedCandidaturas, setSelectedCandidaturas] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [opcoesVaga, setOpcoesVaga] = useState(null)
    const [selectedVaga, setSelectedVaga] = useState(null)
    const [opcoesCandidato, setOpcoesCandidato] = useState(null)
    const [selectedCandidato, setSelectedCandidato] = useState(null)
    const [seletctedStatus, setSelectedStatus]=useState(null)
    const toast = useRef(null);
    const dt = useRef(null);
    const load = useRef(null
    );
    const Api = axios.create({baseURL: 'http://localhost:8081/'});


    useEffect(() => {
        fetchAll();
        fetchAllCandidatos()
        fetchAllVagas()
    }, []);

    const fetchAll = () => {
        load.current = true;
        async function fetchAll() {
            const result = await Api.get("candidaturas")
            if (result.data) {
                setCandidaturas(result.data)
            }
        }
        if (load.current) {
            fetchAll();
        }
        load.current = false;
    }

    function limpaTable() {

        var elemento = document.getElementById("obs")

        var child = elemento.firstElementChild; 
        while (child) {
            elemento.removeChild(child);
            child = elemento.firstElementChild;
        }
    }

    const fetchObsCanidatura = (dados) => {
        load.current = true;
        let idvaga = dados.idvaga
        let idcandidato = dados.idcandidato
        async function fetchObs() {
            const result = await Api.post("candidaturasobservacoes/procurar", {
                idvaga: parseInt(idvaga),
                idcandidato: parseInt(idcandidato)
            })
            limpaTable()
            if (result.data.length > 0) {
                let array = result.data
                let grid = document.getElementById("obs")
                for(let val of array) {
                    let row = document.createElement("div")
                    row.className="grid clasobs"
                    let divone = document.createElement("div")
                    divone.className = "col-11 md:col-11 lg:col-11"
                    let divtwo = document.createElement("div")
                    divtwo.className = "col-11 md:col-1 lg:col-1"
                    let button = document.createElement("button")
                    button.textContent = "X"
                    button.className = "btn btn-sm"
                    button.onclick = () => {
                        dropObs(val.id)
                    }

                    var p = document.createElement("td")
                    p.textContent = val.descricao
                    
                    divone.append(p)
                    divtwo.append(button)
                    row.append(divone)
                    row.append(divtwo)
                    grid.append(row)
                }
            }
        }
        if (load.current) {
            fetchObs();
        }
        load.current = false;
    }

    const fetchAllCandidatos = () => {
        load.current = true;
        async function fetchAll() {
            const result = await Api.get("candidatos")
            if (result.data) {
                setOpcoesCandidato(result.data)
            }
        }
        if (load.current) {
            fetchAll();
        }
        load.current = false;
    }

    const fetchAllVagas = () => {
        load.current = true;
        async function fetchAll() {
            const result = await Api.get("vagas")
            if (result.data) {
                setOpcoesVaga(result.data)
            }
        }
        if (load.current) {
            fetchAll();
        }
        load.current = false;
    }

    const newCandidatura =()=>{
        load.current=true;
        async function newCandidatura(){
            const result = await Api.post("candidaturas",{usercad: "Usuário"})
            if(result.data){
                candidatura.id = result.data.id
                setSubmitted(false);
                setCandidaturaDialog(true);
            }
        }
        if(load.current){
            newCandidatura()
        }
        load.current=false
    }
    
    const newCandidaturaObs = () => {
        load.current=true;
        async function newCandidatura(){
            const result = await Api.post("candidaturasobservacoes",{usercad: "Usuário"})
            if(result.data){
                obs.id = result.data.id
                setObsevacoesDialog(true);
            }
        }
        if(load.current){
            newCandidatura()
        }
        load.current=false
    }

    const saveDataCandidaturas=(id)=>{
        load.current = true
        async function save(){
            const result = await Api.post(`candidaturas/${id}/atualizar`,
            {
                id: id,
                observacoes: candidatura.observacoes,
                idcandidato: selectedCandidato.id,
                nomecandidato: selectedCandidato.nome,
                idvaga: selectedVaga.id,
                nomevaga: selectedVaga.nome,
                status: seletctedStatus
            })
            if(result.data === true){
                setCandidatura(emptyCandidatura);
                setSelectedCandidato(null);
                setSelectedVaga(null);
                setSelectedStatus(null)
                setSubmitted(false);
                setCandidaturaDialog(false);
                fetchAll();
                }
        }
        if(load.current){
            save()
        }
        load.current =false
    }


    const saveDataCandidaturasObs =(id)=> {
        load.current = true
        async function saveObs(){
            const result = await Api.post(`candidaturasobservacoes/${id}/atualizar`,
            {
                id: id,
                idcandidato: selectedCandidato.id,
                idvaga: selectedVaga.id,
                descricao: obs.descricao
            })
            if(result.data === true){
                setObs(emptyCandidaturaObs);
                setObsevacoesDialog(false);
                fetchObsCanidatura(candidatura);
            }
        }
        if(load.current){
            saveObs()
        }
        load.current =false
    }

    const dropCandidatura=(id)=>{
        load.current = true
            async function drop(){
                const response = await Api.post(`candidaturas/${id}/excluir`,{
                    id: parseInt(id)  
                })
            if(response.data === true){
                fetchAll()
            }
            }
            if(load.current){
                drop()
            }
        load.current =false
    }

    const dropObs =(id)=>{
        load.current = true
            async function drop(){
                const response = await Api.post(`candidaturasobservacoes/${id}/excluir`,{
                    id: parseInt(id)  
                })
            if(response.data === true){
                fetchObsCanidatura(candidatura)
            }
            }
            if(load.current){
                drop()
            }
        load.current =false
    }

    const buscarUmCandidato =(dados)=>{
        load.current = true
        let id = dados.idcandidato
            async function fetch(){
                const response = await Api.get(`candidatos/${id}`,{
                    id: id  
                })
            if(response.data){
                setSelectedCandidato(response.data)
            }
            }
            if(load.current){
                fetch()
            }
        load.current =false
    }

    const buscarUmaVaga =(dados)=>{
        load.current = true
        let id = dados.idvaga
            async function fetch(){
                const response = await Api.get(`vagas/${id}`,{
                    id: id  
                })
            if(response.data){
                setSelectedVaga(response.data)
            }
            }
            if(load.current){
                fetch()
            }
        load.current =false
    }

    const openNew = () => {
        newCandidatura()
    }

    const openNewObs = () => {
        newCandidaturaObs()
    }

    const hideDialog = () => {
        setSubmitted(false);
        setSelectedStatus(null)
        setSelectedCandidato(null)
        setSelectedVaga(null)
        setCandidatura(emptyCandidatura)
        setCandidaturaDialog(false);
        limpaTable()
    }
    
    const hideDialogObs = () => {
        setObsevacoesDialog(false);
    }

    const hideDeleteCandidaturaDialog = () => {
        setDeleteCandidaturaDialog(false);
    }

    const hideDeleteCandidaturasDialog = () => {
        setDeleteCandidaturasDialog(false);
    }

    const saveCandidatura = () => {
        setSubmitted(true);

        if (candidatura.id !== '') {
            let _candidaturas = [...candidaturas];
         
            if (candidatura.id) {
                const index = findIndexById(candidatura.id);
                if(index >= 0){

                    saveDataCandidaturas(candidatura.id)
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Candidatura Atualizada', life: 3000 });
                }else{
                    saveDataCandidaturas(candidatura.id)
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Candidatura Criada', life: 3000 });
            }
            setCandidatura(emptyCandidatura);
        }

            setCandidaturas(_candidaturas);
            setCandidaturaDialog(false);
        }
    }


    const saveCandidaturaObs = () => {

        if (candidatura.id !== '' && obs.id !== '') {
            saveDataCandidaturasObs(obs.id);
            setObs(emptyCandidaturaObs);
            setObsevacoesDialog(false);
        }
    }

   
    const editCandidatura = (candidatura) => {
        setCandidatura({ ...candidatura });
        setSelectedStatus(candidatura.status);
        buscarUmCandidato(candidatura)
        buscarUmaVaga(candidatura)
        fetchObsCanidatura(candidatura)
        setCandidaturaDialog(true);
    }

    const confirmDeleteCandidatura = (candidatura) => {
        setCandidatura(candidatura);
        setDeleteCandidaturaDialog(true);
    }

    const deleteCandidatura = () => {
        let _candidaturas = candidaturas.filter(val => val.id !== candidatura.id);
        let _removeCandidatura = candidaturas.filter(val => val.id === candidatura.id);
        let id = _removeCandidatura[0].id
        dropCandidatura(id)
        setCandidaturas(_candidaturas);
        setDeleteCandidaturaDialog(false);
        setCandidatura(emptyCandidatura);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Candidatura Deletada', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < candidaturas.length; i++) {
            if (candidaturas[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

   
    const confirmDeleteSelected = () => {
        setDeleteCandidaturasDialog(true);
    }

    const deleteSelectedCandidaturas = () => {
        let _candidaturas = candidaturas.filter(val => !selectedCandidaturas.includes(val));
        Array.from(selectedCandidaturas).forEach((val)=>{
            dropCandidatura(val.id)
        })
        setCandidaturas(_candidaturas);
        setDeleteCandidaturasDialog(false);
        setSelectedCandidaturas(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Candidaturas Deletadas', life: 3000 });
    }

    const onInputChange = (e, nome) => {
        const val = (e.target && e.target.value) || '';
        let _candidatura = {...candidatura};
        _candidatura[`${nome}`] = val;

        setCandidatura(_candidatura);
    }

    const onInputChangeObs = (e, nome) => {
        const val = (e.target && e.target.value) || '';
        let _obs = {...obs};
        _obs[`${nome}`] = val;

        setObs(_obs);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Novo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Deletar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCandidaturas || !selectedCandidaturas.length} />
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCandidatura(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCandidatura(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Gerenciamento de Candidaturas</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const candidaturaDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveCandidatura} />
        </React.Fragment>
    );

    const observacoesDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialogObs} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveCandidaturaObs} />
        </React.Fragment>
    );

    const deleteCandidaturaDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCandidaturaDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteCandidatura} />
        </React.Fragment>
    );
    const deleteCandidaturasDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCandidaturasDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCandidaturas} />
        </React.Fragment>
    );


    const opcoesStatus = [
        {name:"Em processo", value:"Em processo"},
        {name:"Aprovado", value:"Aprovado"},
        {name:"Reprovado", value:"Reprovado"},
    ]

    return (
        <div className="datatable-crud">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={candidaturas} selection={selectedCandidaturas} onSelectionChange={(e) => setSelectedCandidaturas(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Vendo de {first} a {last} de {totalRecords} candidaturas"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="nomecandidato" header="Candidato" sortable></Column>
                    <Column field="nomevaga" header="Vaga" sortable></Column>
                    <Column field="status" header="Status" sortable></Column>
                    <Column field="observacoes" header="Observação" sortable></Column>
                    <Column body={actionBodyTemplate} header="Ações" style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={candidaturaDialog} style={{ width: '80%' }} header="Detalhes da Candidatura" modal className="p-fluid card" footer={candidaturaDialogFooter} onHide={hideDialog}>
                <div className="grid">
                <div className="field col-12 md:col-6 lg:col-4">
                <label htmlFor="candidato">Candidato</label>
                    <Dropdown value={selectedCandidato} options={opcoesCandidato} onChange={(e)=>setSelectedCandidato(e.value)} optionLabel="nome" className={classNames({ 'p-invalid': submitted && !selectedCandidato })}/>
                    {submitted && !selectedCandidato && <small className="p-error">Candidato é obrigatório.</small>}
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                <label htmlFor="vaga">Vaga</label>
                    <Dropdown value={selectedVaga} options={opcoesVaga} onChange={(e)=>setSelectedVaga(e.value)} optionLabel="nome" className={classNames({ 'p-invalid': submitted && !selectedVaga })}/>
                    {submitted && !selectedVaga && <small className="p-error">Vaga é obrigatório.</small>}
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                <label htmlFor="vaga">Status</label>
                    <Dropdown value={seletctedStatus} options={opcoesStatus} onChange={(e)=>setSelectedStatus(e.value)} optionLabel="name"/>
                    </div>
                    <div className="field col-12 md:col-12 lg:col-12">
                    <label htmlFor="observacoes">Observação</label>
                    <InputTextarea id="observacoes" value={candidatura.observacoes} onChange={(e) => onInputChange(e, 'observacoes')} rows={3} cols={10}  />                   </div>
                    <div className="field col-12 md:col-12 lg:col-12">
                    <Button label="Observações" icon="pi pi-plus" className="p-button-danger w-2" onClick={openNewObs} />
                    </div>
                    <div className="field col-12 md:col-12 lg:col-12">
                        <div className="card">
                            <div className="grid">
                            <div className="col-12 md:col-6 lg:col-6" id="obs"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={obsevacoesDialog} style={{ width: '40%' }} header="Observações" modal className="p-fluid card" footer={observacoesDialogFooter} onHide={hideDialogObs}>
                <div className="grid">
                    <div className="field col-12 md:col-12 lg:col-12">
                    <label htmlFor="descricao">Observação</label>
                        <InputTextarea id="descricao" value={obs.descricao} onChange={(e) => onInputChangeObs(e, 'descricao')} rows={3} cols={10} />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteCandidaturaDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteCandidaturaDialogFooter} onHide={hideDeleteCandidaturaDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {candidatura && <span>Deseja excluir a candidatura de <b>{candidatura.nomecandidato}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteCandidaturasDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteCandidaturasDialogFooter} onHide={hideDeleteCandidaturasDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {candidatura && <span>Tem certeza que deseja excluir as candidaturas selecionadas?</span>}
                </div>
            </Dialog>
        </div>
    );
}
                 
export default function Candidatures() {
    return <div className="card">
        <div className="card text-center"><h3>Candidaturas</h3></div>
        < DataTableCrud />
    </div>
}