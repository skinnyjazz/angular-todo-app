export interface Todo {
    id: number;
    title: string;
    completed: boolean;
  }
  
export type FieldToUpdate = Pick<Todo, "title"> | Pick<Todo, "completed">;