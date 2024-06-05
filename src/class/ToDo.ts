export type TodoStatus = "pending" | "active" | "finished"  


export interface ITodo {
    name: string
    description: string
    status: TodoStatus
    statusColor: string
    user: string
    creationDate: Date
    finishDate: Date
}

export class Todo implements ITodo {
    name: string
    description: string
    status: "pending" | "active" | "finished"  
    statusColor: string
    user: string
    creationDate: Date
    finishDate: Date
}