import {  IProject, ProjectStatus, UserRole } from "./class/Project"
import { ProjectsManager } from "./class/ProjectsManager"


// DEVUELVE FECHA DE HOY EN STRING
function setDateToday() {
    const date = new Date()
    const year = date.getFullYear()

    let month: number | string = date.getMonth() + 1
    let day: number | string = date.getDate()
    
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    
    const today = `${year}-${month}-${day}`
    return today   
    }

// SHOW MODDAL 
function showModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        modal.showModal()    
    } else {
        console.warn("The provided modal wasn't found: ", id)
    }
}

// TOGGLE MODAL 
function toggleModal (id: string){
    const modal = document.getElementById(id)
    if(modal && modal instanceof HTMLDialogElement) {
        if (modal.open){
            modal.close()
        }else{
            modal.showModal()
        }  
    }else{
        console.warn("The provided modal wasn't found", id)
    }
}
// COGEMOS EL ELEMENTO HTML "project-list", ASIGNAMOS VARIABLE, Y CREAMOS OBJ. ProjectsManager PASANDO ESA VARIABLE.
// EN EL CONSTRUCTOR SE TRATA COMO EL "container" Y ASI SE VISUALIZA. DENTRO DE AQUI SE METERAN LAS PROJECT CARDS.
const projectsListUI = document.getElementById("project-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

// MUESTRA EL MODAL DE PROYECTO NUEVO AL PULSAR EL BOTON "new-project-btn"
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
    console.warn("New project button was not found")
}

// CONFIRMA Y COGE EL FORMULARIO "new-project-form" 
const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement ) {

    // BOTON DE CANCELAR DEL FORMULARIO NEW PROJECT. 
    const cancelBtn = projectForm.querySelector("button[type=reset]")
    if (cancelBtn){
        cancelBtn.addEventListener("click", () => {
            projectForm.reset()
            toggleModal("new-project-modal")
        })
    }

    // BOTON DE ACEPTAR DEL FORMULARIO NEW PROJECT. IMPORTANTE. CREACION DE PROYECTO.
    projectForm.addEventListener("submit", (e) => {
        //EVITAMOS EL COMPORTAMIENTO NORMAL DEL ENVIO DE DATOS DEL FORMULARIO CON UN SUBMIT.
        e.preventDefault();

        //VALIDA EL CONTENIDO DE LA FECHA, Y DA VALOR POR DEFECTO SI ESTA VACIO.
        const valDate = (document.getElementById("finishDate") as HTMLInputElement);
        if (!valDate.value){
            valDate.value = setDateToday()
        }

        //VALIDA EL CONTENIDO DEL COST, Y DA VALOR POR DEFECTO SI ESTA VACIO.
        const valCost = (document.getElementById("new-project-cost") as HTMLInputElement);
        console.log(valCost.value)
        if (!valCost.value) {
            alert("paco")
            valCost.value = "0";
        }



        const formData = new FormData(projectForm)
        //CON formData.get("key") COGEMOS LOS VALORES. PONEMOS "as" PARA FORZAR EL TIPO DE DATO DESDE EL formData.get
        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            // DOBLE TIPO DE DATOS PARA EVITAR ERROR
            cost: formData.get("cost") as number | string,
            userRole: formData.get("userRole") as UserRole,
            status: formData.get("status")as ProjectStatus,       
            finishDate: new Date(formData.get("finishDate") as string)
        }

        // SE INICIA LA CREACION DEL PROYECTO LLAMADO A LA FUNCION newProject de ProjectsManager
        try {
            const project = projectsManager.newProject(projectData)
            projectForm.reset()
            toggleModal("new-project-modal")
            console.log(project)
            // COGE LOS "throw error" DE LA FUNCION newProject de ProjectsManager Y LOS METE COMO "err"
        } catch (err) {
            //alert(err)
            //"err" ES UN ELEMENTO HTML LABEL. AQUI LE INYECTA EL TEXTO DE err Y SACA EL MODAL "error-modal" QUE LO CONTIENE.
            const message = document.getElementById("err") as HTMLElement
            message.textContent = err
            toggleModal("error-modal")

            //INTENTO DE CONTROLAR EL CIERRE DEL error-modal
            const errorForm = document.getElementById("error-form")
            if (errorForm){
                const closeErrorBtn = document.getElementById("close-error-modal")
                if (closeErrorBtn) {
                    closeErrorBtn.addEventListener("click", (e) => {
                        toggleModal("error-modal")})
                }
            }

            }
        }     
    )
}else{
    console.warn("The project form was not found. Check the ID!")
}




   // BOTON DEL FORMULARIO EDIT PROJECT. 
const editProjectInfobtn = document.getElementById("edit-project-btn")
if (editProjectInfobtn) {
    editProjectInfobtn.addEventListener("click", (e) => {
        
        //ANTES DE ENSEÑAR EL MODAL, TENEMOS QUE RELLENAR LOS INPUTS CON LOS DATOS DEL PROYECTO.
        
        
        
        
        showModal("edit-project-modal")
    })
}


// EDIT PROJECT INFO
const editprojectForm = document.getElementById("edit-project-form")
if (editprojectForm && editprojectForm instanceof HTMLFormElement ){

    // BOTON DE CANCELAR DEL FORMULARIO NEW PROJECT. 
    const cancelEditBtn = document.getElementById("reset-edit-project-info-btn")
    if (cancelEditBtn){
        cancelEditBtn.addEventListener("click", () => {
            editprojectForm.reset()
            toggleModal("edit-project-modal")
        })
    }  
}    







const exportProjectsBtn= document.getElementById("export-projects-btn")
if(exportProjectsBtn){
    exportProjectsBtn.addEventListener("click",()=>{
        projectsManager.exportToJSON()
    })
}

const importProjectsBtn= document.getElementById("import-projects-btn")
if(importProjectsBtn){
    importProjectsBtn.addEventListener("click",()=>{
        projectsManager.importFromJSON()
    })
}

const projectPageBtn = document.getElementById("projectsPageBtn")
if (projectPageBtn) {
    projectPageBtn.addEventListener("click", () => {
        const projectsPage = document.getElementById("projects-page")
        const detailsPage = document.getElementById("project-details")
        if (!(projectsPage && detailsPage)) { return }
        projectsPage.style.display = "flex"
        detailsPage.style.display = "none"
    })
} else {
    console.warn("Projects Page button not found")
}



