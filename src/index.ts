import {  Project, IProject, ProjectStatus, UserRole } from "./class/Project"
import { ProjectsManager } from "./class/ProjectsManager"




function showModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement)  {
        modal.showModal()    
    } else {
        console.warn("The provided modal wasn't found: ", id)
    }
}


function toogleModal (id: string){
    const modal = document.getElementById(id)
    if(modal && modal instanceof HTMLDialogElement){
        if (modal.open){
            modal.close()
        }else{
            modal.showModal()
        }  
    }else{
        console.warn("The provided modal wasn't found", id)
    }
}





const projectsListUI = document.getElementById("project-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)


// REFERENCE THE BUTTON WITH A FUNCTION PROVIDED BY DOCUMENT ITSELF
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
    console.warn("New projects button was not found")
}

const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement ) {

    const cancelBtn = projectForm.querySelector("button[type=button]")
    if (cancelBtn){
        cancelBtn.addEventListener("click", () => {
            projectForm.reset()
            toogleModal("new-project-modal")
        })
    }
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData(projectForm)
        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            userRole: formData.get("userRole") as UserRole,
            status: formData.get("status")as ProjectStatus,
            finishDate: new Date(formData.get("finishDate") as string)
        }
        try {
            const project = projectsManager.newProject(projectData)
            projectForm.reset()
            toogleModal("new-project-modal")
            console.log(project)
        } catch (err) {
            //alert(err)
            const message = document.getElementById("err") as HTMLElement
            message.textContent = err
            toogleModal("error-modal")

        }     
    })
}else{
    console.warn("The project form was not found. Check the ID!")
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



