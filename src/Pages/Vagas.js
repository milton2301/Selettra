
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
import { InputNumber} from 'primereact/inputnumber';
import './DataTableDemo.css';
import axios from 'axios';

const DataTableCrudVaga = () => {

    let emptyVaga = {
        id: null,
        dtcad: 0,
        usercad: 0,
        ativo: 0,
        nome: '',
        descricao: null,
        salario: '',
        setor: null,
        dtfechamento: "",
        dtabertura:""
    };

    const [vagas, setVagas] = useState(null);
    const [vagaDialog, setVagaDialog] = useState(false);
    const [deleteVagaDialog, setDeleteVagaDialog] = useState(false);
    const [deleteVagasDialog, setDeleteVagasDialog] = useState(false);
    const [vaga, setVaga] = useState(emptyVaga);
    const [selectedVagas, setSelectedVagas] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const load = useRef(null
    );
    const Api = axios.create({baseURL: 'http://localhost:8081/'});


    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = () => {
        load.current = true;
        async function fetchAll() {
            const result = await Api.get("vagas")
            if (result.data) {
                setVagas(result.data)
            }
        }
        if (load.current) {
            fetchAll();
        }
        load.current = false;
    }

    const newVagas =()=>{
        load.current=true;
        async function newVaga(){
            const result = await Api.post("vagas",{usercad: "Usuário"})
            if(result.data){
                vaga.id = result.data.id
                setSubmitted(false);
                setVagaDialog(true);
            }
        }
        if(load.current){
            newVaga()
        }
        load.current=false
    }

    const saveDataVagas=(id)=>{
        load.current = true
        async function save(){
            const result = await Api.post(`vagas/${id}/atualizar`,
            {id: id,
                nome: vaga.nome,
                setor: vaga.setor,
                descricao: vaga.descricao,
                dtabertura: vaga.dtabertura,
                dtfechamento: vaga.dtfechamento,
                salario: vaga.salario,
                })
            if(result.data === true){
                setVaga(emptyVaga);
                setSubmitted(false);
                setVagaDialog(false);
                fetchAll();
                }
        }
        if(load.current){
            save()
        }
        load.current =false
    }

    const dropVaga=(id)=>{
        load.current = true
            async function drop(){
                const response = await Api.post(`vagas/${id}/excluir`,{
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

    const openNew = () => {
        newVagas()
    }

    const hideDialog = () => {
        setSubmitted(false);
        setVagaDialog(false);
    }

    const hideDeleteVagaDialog = () => {
        setDeleteVagaDialog(false);
    }

    const hideDeleteVagasDialog = () => {
        setDeleteVagasDialog(false);
    }

    const saveVaga = () => {
        setSubmitted(true);

        if (vaga.nome.trim()) {
            let _vagas = [...vagas];
         
            if (vaga.id) {
                const index = findIndexById(vaga.id);
                if(index >= 0){

                    saveDataVagas(vaga.id)
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Vaga Atualizada', life: 3000 });
                }else{
                    saveDataVagas(vaga.id)
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Vaga Criada', life: 3000 });
            }
            setVaga(emptyVaga);
        }

            setVagas(_vagas);
            setVagaDialog(false);
        }
    }

   
    const editVaga = (vaga) => {
        setVaga({...vaga});
        setVagaDialog(true);
    }

    const confirmDeleteVaga = (vaga) => {
        setVaga(vaga);
        setDeleteVagaDialog(true);
    }

    const deleteVaga = () => {
        let _vagas = vagas.filter(val => val.id !== vaga.id);
        let _removeVaga = vagas.filter(val => val.id === vaga.id);
        let id = _removeVaga[0].id
        dropVaga(id)
        setVagas(_vagas);
        setDeleteVagaDialog(false);
        setVaga(emptyVaga);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Vaga Deletada', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < vagas.length; i++) {
            if (vagas[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

   
    const confirmDeleteSelected = () => {
        setDeleteVagasDialog(true);
    }

    const deleteSelectedVagas = () => {
        let _vagas = vagas.filter(val => !selectedVagas.includes(val));
        Array.from(selectedVagas).forEach((val)=>{
            dropVaga(val.id)
        })
        setVagas(_vagas);
        setDeleteVagasDialog(false);
        setSelectedVagas(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Vagas Deletadas', life: 3000 });
    }

    const onInputChange = (e, nome) => {
        const val = (e.target && e.target.value) || '';
        let _vaga = {...vaga};
        _vaga[`${nome}`] = val;

        setVaga(_vaga);
    }

    const onInputNumberChange = (e, nome) => {
        const val = (e.target && e.target.value) || '';
        let _vaga = {...vaga};
        _vaga[`${nome}`] = val;

        setVaga(_vaga);
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Novo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Deletar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedVagas || !selectedVagas.length} />
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editVaga(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteVaga(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Gerenciamento de Vagas</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const vagaDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveVaga} />
        </React.Fragment>
    );
    const deleteVagaDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteVagaDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteVaga} />
        </React.Fragment>
    );
    const deleteVagasDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteVagasDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedVagas} />
        </React.Fragment>
    );

    const formataDate = (value) => {
        let dataAtual =  value;
        let dataAtualFormatada = dataAtual.split('-').reverse().join('/');
        return dataAtualFormatada;
    }

    const dtaberturaBodytemplate = (rowData) => {
        return formataDate(rowData.dtabertura);
    }

    const dtfechamentoBodytemplate = (rowData) => {
        return formataDate(rowData.dtfechamento);
    }

    return (
        <div className="datatable-crud">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={vagas} selection={selectedVagas} onSelectionChange={(e) => setSelectedVagas(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Vendo de {first} a {last} de {totalRecords} vagas"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="nome" header="Nome" sortable></Column>
                    <Column field="setor" header="Setor" sortable></Column>
                    <Column field="dtabertura" body={dtaberturaBodytemplate} header="Data abertura" sortable></Column>
                    <Column field="dtfechamento" body={dtfechamentoBodytemplate} header="Data fechamento" sortable></Column>
                    <Column field="descricao" header="Descrição"></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={vagaDialog} style={{ width: '80%' }} header="Detalhes da Vaga" modal className="p-fluid card" footer={vagaDialogFooter} onHide={hideDialog}>
                <div className="grid">
                <div className="field col-12 md:col-6 lg:col-6">
                    <label htmlFor="nome">Nome</label>
                    <InputText id="nome" value={vaga.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !vaga.nome })} />
                    {submitted && !vaga.nome && <small className="p-error">Nome é obrigatório.</small>}
                </div>
                <div className="field col-12 md:col-6 lg:col-6">
                    <label htmlFor="setor">Setor</label>
                    <InputText id="setor" value={vaga.setor} onChange={(e) => onInputChange(e, 'setor')} required autoFocus className={classNames({ 'p-invalid': submitted && !vaga.setor })} />
                    {submitted && !vaga.setor && <small className="p-error">Setor é obrigatório.</small>}
                </div>
                <div className="field col-12 md:col-6 lg:col-6">
                    <label htmlFor="dtabertura">Data de abrtura</label>
                    <InputText type="date" id="dtabertura" value={vaga.dtabertura} onChange={(e) => onInputChange(e, 'dtabertura')} required autoFocus className={classNames({ 'p-invalid': submitted && !vaga.dtabertura })} />
                    {submitted && !vaga.dtabertura && <small className="p-error">Data de abertura é obrigatório.</small>}
                </div>
                <div className="field col-12 md:col-6 lg:col-6">
                    <label htmlFor="dtfechamento">Data de fechamento</label>
                    <InputText type="date" id="dtfechamento" value={vaga.dtfechamento} onChange={(e) => onInputChange(e, 'dtfechamento')} required autoFocus className={classNames({ 'p-invalid': submitted && !vaga.dtfechamento })} />
                    {submitted && !vaga.dtfechamento && <small className="p-error">Data de fechamento é obrigatório.</small>}
                </div>
                <div className="field field col-12 md:col-12 lg:col-12">
                    <label htmlFor="descricao">Descrição</label>
                    <InputTextarea id="descricao" value={vaga.descricao} onChange={(e) => onInputChange(e, 'descricao')} required autoFocus className={classNames({ 'p-invalid': submitted && !vaga.descricao })} />
                    {submitted && !vaga.descricao && <small className="p-error">Descrição é obrigatório.</small>}
                </div>
                </div>
            </Dialog>

            <Dialog visible={deleteVagaDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteVagaDialogFooter} onHide={hideDeleteVagaDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {vaga && <span>Deseja excluir a vaga de <b>{vaga.nome}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteVagasDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteVagasDialogFooter} onHide={hideDeleteVagasDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {vaga && <span>Tem certeza que deseja excluir as vagas selecionadas?</span>}
                </div>
            </Dialog>
        </div>
    );
}
                 
export default function Vagas() {
    return <div className="card">
        <div className="card text-center"><h3>Cadastro de Vagas</h3></div>
        < DataTableCrudVaga />
    </div>
}