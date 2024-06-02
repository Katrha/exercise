import { IProject, Project } from "./Project"

export class ProjectsManager {
    list: Project [] = []
    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
    }

//FUNCION QUE CREA EL PROYECTO NUEVO. INTERFACE PARA ASEGURARNOS TIPOS DE DATOS CORRECTOS.
newProject(data: IProject){

    // projectNames ES EL RESULTADO DE APLICAR LA FUNCION "return project.name" A TODOS LOS ELEMENTOS DE LIST.projectVariable SOLO SIRVE DE MANERA LOCAL A ESTA FUNCION.
    const projectNames = this.list.map((projectVariable) => {      
            return projectVariable.name 
    })
    // SI "data.name" SE ENCUENTRA EN projectNames, DA ERROR.
    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {
        throw new Error(`"${data.name}" already exists`)
    }

    //VALIDACION PARA CONFIRMAR QUE NAME DEL PROYECTO TIENE MAS DE 4 CARACTERES.
    const validationName = data.name
    if (validationName && validationName.length <5){
        throw new Error(`"${data.name}" is not a valid Project name cause it is too short. Please enter a new Project name at least 5 character long.`)
    }

    // CREA UN OBJETO Project (DEFINIDO EN Project.ts) CON LA INFO PASADA EN COMO data.
    const project = new Project(data)

    // ESTE EVENTO OCURRE CUANDO CLICAMOS EN EL CONTAINER DEL PROYECTO. DEFNIDO COMO project.ui.
    project.ui.addEventListener("click", () => {
        // ASIGNAMOS VARIABLES CON ELEMENTOS HTML 
        const projectsPage = document.getElementById("projects-page")
        const detailsPage = document.getElementById("project-details")
        if (!(projectsPage && detailsPage)) { return }
        //OCULTA PAGINA DE PROYECTO Y MUESTRA PAGINA DE DETALLE
        projectsPage.style.display = "none"
        detailsPage.style.display = "flex"
        this.setDetailsPage(project)
        this.setEditModal(project)
    })
    
    //AÑADIMOS project.ui, DIV HTML CARD DEL PROYECTO, DENTRO DEL DIV container DEL ProjectsManager. AÑADE LA CARTA DEL PROYECTO A LA PAGINA.
    this.ui.append(project.ui)
    //AÑADIMOS AL ATRIBUTO list DE TIPO ARRAY DE ProjectsManager, EL OBJETO project. 
    this.list.push(project)
    //DEVUELVE EL OBJETO project
    return project    
}


private setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details")
    if (!detailsPage) { return }
        const nameTitle= detailsPage.querySelector("[data-project-info='name-title']")
        const descriptionTitle = detailsPage.querySelector("[data-project-info='description-title']")
        
        const acronym = document.getElementById("acronym")


        const name = detailsPage.querySelector("[data-project-info='name']")
        const description = detailsPage.querySelector("[data-project-info='description']")
        const status = detailsPage.querySelector("[data-project-info='status']")
        const cost = detailsPage.querySelector("[data-project-info='cost']")
        const userRole = detailsPage.querySelector("[data-project-info='userRole']")
        const finishDate = detailsPage.querySelector("[data-project-info='finishDate']")

        //COGE LAS PROPIEDADES DEL project PASADO A LA FUNCION, Y LAS INYECTA EN LOS ELEMENTOS HTML, VIA EL "data-project-info"
        if (nameTitle) { nameTitle.textContent = project.name }
        if (descriptionTitle) { descriptionTitle.textContent = project.description }

        if (acronym) { acronym.style.backgroundColor = project.acronynColor; acronym.textContent = project.name.slice(0,2).toUpperCase() }

        if (name) { name.textContent = project.name }
        if (description) { description.textContent = project.description }
        if (status) { status.textContent = project.status }
        if (cost) { cost.textContent = project.cost.toString() }
        if (userRole) { userRole.textContent = project.userRole }
        if (finishDate) { finishDate.textContent = project.finishDate.toDateString() }
}

public setEditModal(project: Project){
    const editProjectName = document.getElementById("edit-project-name") as HTMLInputElement;
    const editProjectDescription = document.getElementById("edit-project-description") as HTMLInputElement;
    const editProjectCost= document.getElementById("edit-project-cost") as HTMLInputElement;
    const editProjectRole = document.getElementById("edit-project-role") as HTMLInputElement;
    const editProjectStatus = document.getElementById("edit-project-status") as HTMLInputElement;
    const editProjectDate = document.getElementById("edit-project-date") as HTMLInputElement;

    console.log(editProjectName)
    if (editProjectName) { editProjectName.value = project.name }
    if (editProjectDescription) { editProjectDescription.value = project.description }
    
    //ARREGLAR PARA DATE Y COST, PROBLEMA POR EL TIPO DE DATO
    console.log(project.cost)
    if (editProjectCost) { editProjectCost.value = project.cost.toString()  }
    if (editProjectRole) { editProjectRole.value = project.userRole }
    if (editProjectStatus) { editProjectStatus.value = project.status }
    //if (editProjectDate) { editProjectDate.value = project.finishDate }
    
}   



getProject(id: string) {
    const project = this.list.find((project) => {
        return project.id === id
    })
return project
}


deleteProject(id: string) {
    const project = this.getProject(id)
    if(!project) { return }
    project.ui.remove()
    const remaining = this.list.filter((project) => {
        return project.id !== id
    })
this.list = remaining
}


getProjecbyName(name: string) {
    const project = this.list.find((project) => {
        return project.name === name
    })
return project
}


exportToJSON(filename: string = "projects") {
    function replacer(key, value){
        if (key !== "ui"){
            return value;
        }
    }
    const json = JSON.stringify(this.list, replacer, 2)
    const blob = new Blob([json], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}


importFromJSON() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", () => {
        const json = reader.result
        if(!json) {return}
        const projects: IProject [] = JSON.parse(json as string)
        for (const project of projects) {
            try {
                this.newProject(project)
            } catch (error) {

            }
            
        }
    })
    input.addEventListener('change', () => {
        const filesList = input.files
        if (!filesList) { return }
        reader.readAsText(filesList[0])
    })
    input.click()
    }
}

