import {  IProject, Project, ProjectStatus, UserRole } from "./class/Project"
import { ProjectsManager } from "./class/ProjectsManager"
import { ITodo, TodoStatus } from "./class/ToDo"


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
// USAMOS ESTA ESTRUCTURA PARA LAS TODO CARD
const projectsListUI = document.getElementById("project-list") as HTMLElement
const todoListUI = document.getElementById("todo-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI,todoListUI)

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
        if (!valCost.value) {
            valCost.value = "0";
        }
        const formData = new FormData(projectForm)
        //CON formData.get("key") COGEMOS LOS VALORES. PONEMOS "as" PARA FORZAR EL TIPO DE DATO DESDE EL formData.get
        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            // DOBLE TIPO DE DATOS PARA EVITAR ERROR
            cost: parseFloat(formData.get("cost") as string),
            userRole: formData.get("userRole") as UserRole,
            status: formData.get("status")as ProjectStatus,       
            finishDate: new Date(formData.get("finishDate") as string),
            progress: 0,
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

            const errorModalForm = document.getElementById("error-form")
            if (errorModalForm) {
                errorModalForm.addEventListener("click", (e) => {
                    e.preventDefault
                    toggleModal("error-modal")
                    })
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
    editProjectInfobtn.addEventListener("click", (e) => {     showModal("edit-project-modal")    })
}

// EDIT PROJECT INFO
const editprojectForm = document.getElementById("edit-project-form")
if (editprojectForm && editprojectForm instanceof HTMLFormElement) {
    // BOTON DE CANCELAR DEL FORMULARIO EDIT PROJECT. 
    const cancelEditBtn = document.getElementById("cancel-edit-project-info-btn")
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", () => {toggleModal("edit-project-modal")
        })
    }
    editprojectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const editformData = new FormData(editprojectForm)
        //CON formData.get("key") COGEMOS LOS VALORES. PONEMOS "as" PARA FORZAR EL TIPO DE DATO DESDE EL formData.get
        const editedProjectData: IProject = {
            name: editformData.get("name") as string,
            description: editformData.get("description") as string,
            // DOBLE TIPO DE DATOS PARA EVITAR ERROR
            cost: parseFloat(editformData.get("cost") as string),
            userRole: editformData.get("userRole") as UserRole,
            status: editformData.get("status") as ProjectStatus,
            finishDate: new Date(editformData.get("finishDate") as string),
            progress: parseFloat(editformData.get("progress") as string),
        }
        // CAMBIAR VALORES DEL PROYECTO EN CUESTION DIRECTAMENTE. FUNCIONA. CAMBIAR LA PROJECT CARD EN LA PAGINA DE PROJECTOS.
        try {
            projectsManager.validationNameLength(editedProjectData.name, 5)
            projectsManager.validationNameInUseEdit(projectsManager.editingProject.name, editedProjectData.name)
            projectsManager.validationProgress(editedProjectData.progress)
            for (const key in editedProjectData) {
                projectsManager.editingProject[key] = editedProjectData[key]
            }
            projectsManager.setDetailsPage(projectsManager.editingProject)
            projectsManager.editProjectCard(projectsManager.editingProject)
            console.log(projectsManager.list)
            toggleModal("edit-project-modal")

        } catch (err) {
            //IGUAL QUE EL ERROR MODAL DE NEW PROJECT. CADA MODAL PARTENECE A UNA PAGINA.
            const message = document.getElementById("edit-err") as HTMLElement
            message.textContent = err
            toggleModal("edit-error-modal")
            const editErrorModalForm = document.getElementById("edit-error-form")
            if (editErrorModalForm) {
                editErrorModalForm.addEventListener("click", (e) => {
                    e.preventDefault
                    toggleModal("edit-error-modal")
                })
            }
        }
    })
}

const createTodoBtn = document.getElementById("create-todo-btn")
if (createTodoBtn){
    const editingProject = projectsManager.editingProject
    createTodoBtn.addEventListener("click", (e) => {
        toggleModal("new-todo-modal")
    })
} else {
alert("Boton de creacion de todos no encontrado")
}


//CREAMOS TODO MEDIANTE FORMULARIO Y MODA, COMO EL NEW PROJECT
// CONFIRMA Y COGE EL FORMULARIO "new-project-form" 
const todoForm = document.getElementById("new-todo-form")
if (todoForm && todoForm instanceof HTMLFormElement ) {

    // BOTON DE CANCELAR DEL FORMULARIO NEW PROJECT. 
    const cancelBtn = todoForm.querySelector("button[type=reset]")
    if (cancelBtn){
        cancelBtn.addEventListener("click", () => {
            todoForm.reset()
            toggleModal("new-todo-modal")
        })
    }

    // BOTON DE ACEPTAR DEL FORMULARIO NEW PROJECT. IMPORTANTE. CREACION DE PROYECTO.
    todoForm.addEventListener("submit", (e) => {
        //EVITAMOS EL COMPORTAMIENTO NORMAL DEL ENVIO DE DATOS DEL FORMULARIO CON UN SUBMIT.
        e.preventDefault();
        const formData = new FormData(todoForm)
        //CON formData.get("key") COGEMOS LOS VALORES. PONEMOS "as" PARA FORZAR EL TIPO DE DATO DESDE EL formData.get
        const todoData: ITodo = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            user: formData.get("userRole") as string,
            status: formData.get("status")as TodoStatus,
            statusColor: "",
            creationDate: new Date(formData.get("finishDate") as string),       
            finishDate: new Date(formData.get("finishDate") as string),
        }
        
        // SE INICIA LA CREACION DEL PROYECTO LLAMADO A LA FUNCION newProject de ProjectsManager
        try {
            const todo = projectsManager.newTodo(todoData)
            todoForm.reset()
            toggleModal("new-todo-modal")
            console.log(todo)
            // COGE LOS "throw error" DE LA FUNCION newProject de ProjectsManager Y LOS METE COMO "err"
        } catch (err) {
            //alert(err)
            //"err" ES UN ELEMENTO HTML LABEL. AQUI LE INYECTA EL TEXTO DE err Y SACA EL MODAL "error-modal" QUE LO CONTIENE.
            const message = document.getElementById("edit-err") as HTMLElement
            message.textContent = err
            toggleModal("edit-error-modal")
            const editErrorModalForm = document.getElementById("edit-error-form")
            if (editErrorModalForm) {
                editErrorModalForm.addEventListener("click", (e) => {
                    e.preventDefault
                    toggleModal("edit-error-modal")
                })
            }
        }     
})
}else{
    console.warn("The project form was not found. Check the ID!")
}





const exportProjectsBtn = document.getElementById("export-projects-btn")
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
