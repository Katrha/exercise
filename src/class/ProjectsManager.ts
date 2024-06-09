import { IProject, Project, ProjectStatus, UserRole } from "./Project"
import { ITodo, Todo } from "./ToDo"

export class ProjectsManager {
    list: Project [] = []
    ui: HTMLElement
    todoUi: HTMLElement
    editingProject: Project

    constructor(container: HTMLElement, todoContainer: HTMLElement) {
        this.ui = container
        this.todoUi = todoContainer
    }

//FUNCION QUE CREA EL PROYECTO NUEVO. INTERFACE PARA ASEGURARNOS TIPOS DE DATOS CORRECTOS.
newProject(data: IProject){

    this.validationNameInUse(data.name)
    this.validationNameLength(data.name,5)

//CONFIRMAR CAMBIOS EN VALIDACION PARA QUITAR ESTOS COMENTARIOS
    // projectNames ES EL RESULTADO DE APLICAR LA FUNCION "return project.name" A TODOS LOS ELEMENTOS DE LIST.projectVariable SOLO SIRVE DE MANERA LOCAL A ESTA FUNCION.
    //const projectNames = this.list.map((projectVariable) => {      
            //return projectVariable.name 
    //})
    // SI "data.name" SE ENCUENTRA EN projectNames, DA ERROR.
    //const nameInUse = projectNames.includes(data.name)
   // if (nameInUse) {
    //    throw new Error(`"${data.name}" already exists`)
    //}
    //VALIDACION PARA CONFIRMAR QUE NAME DEL PROYECTO TIENE MAS DE 4 CARACTERES.
    //const validationName = data.name
    //if (validationName && validationName.length <5){
     //   throw new Error(`"${data.name}" is not a valid Project name cause it is too short. Please enter a new Project name at least 5 character long.`)
    //}
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
        //cCREAR LA FUNCION 
        //this.setTodoList(project)
        this.editingProject = project
    })
    
    //AÑADIMOS project.ui, DIV HTML CARD DEL PROYECTO, DENTRO DEL ui de  ProjectsManager. AÑADE LA CARTA DEL PROYECTO A LA PAGINA.
    this.ui.append(project.ui)
    //AÑADIMOS AL ATRIBUTO list DE TIPO ARRAY DE ProjectsManager, EL OBJETO project. 
    this.list.push(project)
    //DEVUELVE EL OBJETO project
    return project    
}


newTodo (data: ITodo) { 

    //VALIDACIONES
    this.validationTodoInUse(data.title)
    this.validationNameLength(data.title,5)

    const todo = new Todo(data)
    let todoList = this.editingProject.todo
    todoList.push(todo)

    this.todoUi.append(todo.ui)
}

public setDetailsPage(project: Project) {
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
        const finishDateConst = new Date(project.finishDate)
        const progress = document.getElementById("progress-bar")

        //COGE LAS PROPIEDADES DEL project PASADO A LA FUNCION, Y LAS INYECTA EN LOS ELEMENTOS HTML, VIA EL "data-project-info"
        if (nameTitle) { nameTitle.textContent = project.name }
        if (descriptionTitle) { descriptionTitle.textContent = project.description }
        if (acronym) { acronym.style.backgroundColor = project.acronynColor; acronym.textContent = project.name.slice(0,2).toUpperCase() }
        if (name) { name.textContent = project.name }
        if (description) { description.textContent = project.description }
        if (status) { status.textContent = project.status }
        if (cost) { cost.textContent = project.cost.toString() }
        if (userRole) { userRole.textContent = project.userRole }
        if (finishDate) { finishDate.textContent = finishDateConst.toDateString() }
        if (progress) { progress.style.width = project.progress.toString() +"%"; progress.textContent=project.progress.toString() +"%"}

        // MUESTRA LOS TODO DEL PROYECTO 

        const todoListDiv = document.getElementById("todo-list") as HTMLDivElement
        todoListDiv.innerHTML =""
        const todoElements = project.todo 
        todoElements.forEach(element => {
            todoListDiv.append(element.ui);
        });
}

public setEditModal(project: Project){
    const editProjectName = document.getElementById("edit-project-name") as HTMLInputElement;
    const editProjectDescription = document.getElementById("edit-project-description") as HTMLInputElement;
    const editProjectCost= document.getElementById("edit-project-cost") as HTMLInputElement;
    const editProjectRole = document.getElementById("edit-project-role") as HTMLInputElement;
    const editProjectStatus = document.getElementById("edit-project-status") as HTMLInputElement;
    const editDateConst = new Date(project.finishDate)
    const editProjectDate = document.getElementById("edit-finish-date") as HTMLInputElement;
    
    if (editProjectName) { editProjectName.value = project.name }
    if (editProjectDescription) { editProjectDescription.value = project.description }
    
    if (editProjectCost) { editProjectCost.value = project.cost.toString()  }
    if (editProjectRole) { editProjectRole.value = project.userRole }
    if (editProjectStatus) { editProjectStatus.value = project.status }

    if (editProjectDate) { editProjectDate.value = editDateConst.toISOString().slice(0,10) }
}   
public editProjectCard(project: Project,) {
    const newInnerDIV =
        `<div class="project-card">
        <div class="card-header">
            <p style="background-color: ${project.acronynColor}; padding: 10px; border-radius: 8px; aspect-ratio: 1;">${project.name.slice(0, 2).toUpperCase()}</p>
            <div>
                <h5>${project.name}</h5>
                <p>${project.description}</p>
            </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${project.status}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Role</p>
                <p>${project.userRole}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Cost</p>
                <p>${project.cost}€</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Estimated Progress</p>
                <p>${project.progress}%</p>
            </div>
        </div>
    </div>`
    project.ui.innerHTML = newInnerDIV
}

public validationNameLength(name: string, length: number ){
const validationName = name
if (name.length <length){
    throw new Error(`"${name}" is not a valid cause it is too short. Please enter a new name at least 5 character long.`)
    }
}


public validationNameInUseEdit(editingProject: string, newProjectName: string,){
    // projectNames ES EL RESULTADO DE APLICAR LA FUNCION "return project.name" A TODOS LOS ELEMENTOS DE LIST.projectVariable SOLO SIRVE DE MANERA LOCAL A ESTA FUNCION.
    const projectNames = this.list.map((projectVariable) => { return projectVariable.name  })
    // SI "data.name" SE ENCUENTRA EN projectNames, DA ERROR.
        let excludedProjectNames = projectNames.filter(excepcionName => excepcionName !== editingProject);
        const nameInUse = excludedProjectNames.includes(newProjectName)
        if (nameInUse) {
        throw new Error(`"${newProjectName}" already exists`)
    }
}

public validationNameInUse(name: string){
    // projectNames ES EL RESULTADO DE APLICAR LA FUNCION "return project.name" A TODOS LOS ELEMENTOS DE LIST.projectVariable SOLO SIRVE DE MANERA LOCAL A ESTA FUNCION.
    const projectNames = this.list.map((projectVariable) => { return projectVariable.name  })
    // SI "data.name" SE ENCUENTRA EN projectNames, DA ERROR.
    const nameInUse = projectNames.includes(name)
    if (nameInUse) {
    throw new Error(`"${name}" already exists`)
    }
}

public validationTodoInUse(title:string){
    const todoTitles = this.editingProject.todo.map((todoTitle) => { return todoTitle.title  })
    const todoInUse = todoTitles.includes(title)
    if (todoInUse) {
        throw new Error(`"${title}" already exists`)
    }
}

public validationProgress(progress: number){
    if (progress<0 || progress>100){
        throw new Error ("Progres info must be between 0 and 100")
    }
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
        // rawProjects tiene el array en bruto del json, a traves de IProject, parseao json.
        const rawProjects: IProject [] = JSON.parse(json as string)
        // projects es una array de projects,  desde rawProjects con map, creando los distintos projects. y hace la misa operacion anidada 
        // sacar una array de todo.
        const projects: Project[] = rawProjects.map(rawProject => {
            const todos = rawProject.todo.map(rawTodo => {
                return new Todo({
                //id: rawTodo.id,
                title: rawTodo.title,
                description: rawTodo.description,
                user: rawTodo.user,
                status: rawTodo.status,
                statusColor: rawTodo.statusColor,
                creationDate: new Date(rawTodo.creationDate),
                finishDate: new Date(rawTodo.finishDate)
            });
        });
        // crear project, con todo ya hecha.
        return new Project({
            progress: rawProject.progress,
            //id: rawProject.id,
            todo: todos,
            name: rawProject.name,
            description: rawProject.description,
            cost: rawProject.cost,
            userRole: rawProject.userRole,
            status: rawProject.status,
            finishDate: rawProject.finishDate,
           // acronynColor: rawProject.acronynColor
        });
        })
        // crea todos los projectos, con el formato adecuado tras el parseao.
        for (const project of projects) {
            try {   
                console.log(project)         
                this.newProject(project)    
            } catch (error) {
                console.error(error);
            }
            
        }
    });


    input.addEventListener('change', () => {
        const filesList = input.files
        if (!filesList) { return }
        reader.readAsText(filesList[0])})
    input.click()
    
console.log(this.list)
    
}



}

