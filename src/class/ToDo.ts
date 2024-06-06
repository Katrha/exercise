import { v4 as uuidv4 } from 'uuid'
export type TodoStatus = "pending" | "active" | "finished"  


export interface ITodo {
    title: string
    description: string
    status: TodoStatus
    statusColor: string
    user: string
    creationDate: Date
    finishDate: Date
}

export class Todo implements ITodo {
    title: string
    description: string
    status: "pending" | "active" | "finished"  
    statusColor: string
    user: string
    creationDate: Date
    finishDate: Date

    ui: HTMLDivElement
    id: string


    constructor(data: ITodo) {
        this.id = uuidv4()
        for (const key in data) {
            if (key === "ui"){
                continue
            }
            this[key] = data[key]
        }
        //CREAMOS LA UI
        this.setTodoUI()
    }

    setTodoUI(){
        if (this.ui) {return}
        this.ui = document.createElement("div")
        this.ui.className = "todo-item"
        this.ui.innerHTML = 
        ` <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; column-gap: 15px; align-items: center;">
                <span class="material-symbols-outlined" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
                <p>${this.title}</p>
        </div>
            <p style="text-wrap: nowrap; margin-left: 10px;">${this.creationDate}</p>
        </div>`
    }
}




