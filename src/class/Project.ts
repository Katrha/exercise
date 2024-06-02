import { v4 as uuidv4 } from 'uuid'
export type ProjectStatus = "pending" | "active" | "finished"  
export type UserRole = "architect" | "engineer" | "developer"


export interface IProject {
    name: string
    description: string
    cost: number | string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
}

// implments OBLIGA A QUE CADA VEZ QUE HAGAMOS UN OBJETO PROJECT, TENGA TODOS LAS PROPIEDADES DE LA INTERFACE
export class Project implements IProject {
    name: string
    description: string
    cost: number | string
    status: "pending" | "active" | "finished"  
    userRole: "architect" | "engineer" | "developer"
    finishDate: Date

    //Class internals
    ui: HTMLDivElement
    progress: number = 0
    id: string


// (data: IProject) YA DEFINE TODOS LOS TIPOS DE DATOS NECESARIOS DESDE LA INTERFAZ
    constructor(data: IProject) {
        this.id = uuidv4()
        //Project data definition
        for (const key in data) {
            if (key === "ui"){
                continue
            }
            this[key] = data[key]
        }
        //LLAMAMOS AL METODO setUI PARA CREAR ACONTINUACION LA UI (CARD) DEL PROYECTO CREADO.
        this.setUI()
    }


    //CREAMOS EL ELEMENTO DIV PARA EL PROYECTO.
    setUI() {
        //ASEGURAMOS QUE SI SE HA CREADO LA UI YA, NO CREAMOS OTRA VEZ LA MISMA.
        if (this.ui) {return}

        // CREAMOS EL ELEMENTO DIV, Y LE DAMOS LA CLASE "project-card".
        this.ui = document.createElement("div")
        this.ui.className = "project-card"

        //DEFINIMOS EL CONTENIDO DE ESE DIV. USAMOS ${} PARA METER INFORMACION DINAMICA CUANDO SE CREE ESTE ELEMENTO HTML. PODEMOS HACER ESTO POR QUE USAMOS '' EN VEZ DE ""
        this.ui.innerHTML = 
        `<div class="project-card">
            <div class="card-header">
                <p style="background-color: ${getRandomColor()}; padding: 10px; border-radius: 8px; aspect-ratio: 1;">${this.name.slice(0,2).toUpperCase()}</p>
                <div>
                    <h5>${this.name}</h5>
                    <p>${this.description}</p>
                </div>
            </div>
            <div class="card-content">
                <div class="card-property">
                    <p style="color: #969696;">Status</p>
                    <p>${this.status}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Role</p>
                    <p>${this.userRole}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Cost</p>
                    <p>$${this.cost}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Estimated Progress</p>
                    <p>${this.progress * 100}%</p>
                </div>
            </div>
        </div>`
    }
}
function getRandomColor(){
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() *16)];
    }
    return color
}