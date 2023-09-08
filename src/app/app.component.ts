import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { FieldToUpdate, Todo } from "./types/todo";

import { TodosService } from "./services/todos.service";

type FilterBy = "All" | "Completed" | "Active";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];

  //  get visibleTodos(): Todo[] {
  //   return setVisibleTodos()
  //  };

  // setVisibleTodos(sortBy: FilterBy) {
  //   this._visibleTodos = this.todos.filter(({ completed }) => {
  //     switch (sortBy) {
  //       case "All":
  //         return true;
  //       case "Active":
  //         return !completed;
  //       case "Completed":
  //         return completed;
  //     }
  //   });
  // }

  get activeTodos() {
    return this.todos.filter(({ completed }) => !completed);
  }

  constructor(private todosServeise: TodosService) {}

  ngOnInit(): void {
    this.todosServeise.getTodos().subscribe((todos) => {
      this.todos = todos.slice(0, 5);
    });
  }

  addTodo(title: string) {
    if (!title.trim()) {
      return;
    }

    this.todosServeise.createTodo(title).subscribe((newTodo) => {
      this.todos = [...this.todos, newTodo];
    });
  }

  updateTodo(todoId: number, fieldToUpdate: FieldToUpdate) {
    this.todosServeise
      .patchTodo(todoId, fieldToUpdate)
      .subscribe((updatedTodo) => {
        this.todos = this.todos.map((todo) =>
          todoId === todo.id ? { ...updatedTodo } : todo
        );
      });
  }

  toggleAll() {
    console.log(this.activeTodos);
    if (this.activeTodos.length) {
      this.todos = this.todos.map((todo) => ({ ...todo, completed: true }));
    } else {
      this.todos = this.todos.map((todo) => ({ ...todo, completed: false }));
    }
  }

  deleteTodo(todoId: number) {
    this.todosServeise.removeTodo(todoId).subscribe((res) => {
      this.todos = this.todos.filter(({ id }) => todoId !== id);
    });
  }

  trackById(i: number, todo: Todo) {
    return todo.id;
  }
}
