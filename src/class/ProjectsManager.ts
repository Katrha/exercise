import { IProject, Project } from "./Project"

export class ProjectsManager {
    list: Project [] = []
    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
    }

newProject(data: IProject){
    const projectNames = this.list.map((project) => {
        return project.name
    })
    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {
        throw new Error(`A project with the name "${data.name}" already exists`)

    }
    const project = new Project(data)
    project.ui.addEventListener("click", () => {
        const projectsPage = document.getElementById("projects-page")
        const detailsPage = document.getElementById("project-details")
        if (!(projectsPage && detailsPage)) { return }
        projectsPage.style.display = "none"
        detailsPage.style.display = "flex"
        this.setDetailsPage(project)
    })
    this.ui.append(project.ui)
    this.list.push(project)
    return project
}

private setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details")
    if (!detailsPage) { return }
        const nameTitle= detailsPage.querySelector("[data-project-info='name-title']")
        const descriptionTitle = detailsPage.querySelector("[data-project-info='description-title']")
        const name = detailsPage.querySelector("[data-project-info='name']")
        const description = detailsPage.querySelector("[data-project-info='description']")
        const status = detailsPage.querySelector("[data-project-info='status']")
        const cost = detailsPage.querySelector("[data-project-info='cost']")


        if (nameTitle) { nameTitle.textContent = project.name }
        if (descriptionTitle) { descriptionTitle.textContent = project.description }
        if (name) { name.textContent = project.name }
        if (description) { description.textContent = project.description }
        if (status) { status.textContent = project.status }
        if (cost) { 
            const projectCostString = project.cost.toString()
            cost.textContent = projectCostString }

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

