import { Injectable } from "@angular/core";
import { FieldToUpdate, Todo } from "../types/todo";
import { HttpClient } from "@angular/common/http";
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  shareReplay,
  switchMap,
  tap,
} from "rxjs";

const BASE_URL = "https://jsonplaceholder.typicode.com";

const todos: Todo[] = [
  { id: 1, title: "HTML + Css", completed: true },
  { id: 2, title: "js", completed: true },
  { id: 3, title: "ts", completed: false },
  { id: 4, title: "Angular", completed: false },
  { id: 5, title: "Rxjs", completed: false },
];

@Injectable({
  providedIn: "root",
})
export class TodosService {
  refresh$$ = new BehaviorSubject(null);
  todos$: Observable<Todo[]>;

  constructor(private http: HttpClient) {
    this.todos$ = this.refresh$$.pipe(switchMap(() => this.getTodos()));
  }

  getTodos() {
    return this.http.get<Todo[]>(`${BASE_URL}/todos`);
  }

  updateTodo(todo: Todo) {
    return this.http
      .patch<Todo>(`${BASE_URL}/todos/${todo.id}`, todo)
      .pipe(tap(() => this.refresh$$.next(null)));
  }
  createTodo(title: string) {
    return this.http
      .post<Todo>(`${BASE_URL}/todos`, {
        title,
        userId: 1,
        completed: false,
      })
      .pipe(tap(() => this.refresh$$.next(null)));
  }

  deleteTodo(todo: Todo) {
    return this.http
      .delete(`${BASE_URL}/todos/${todo.id}`)
      .pipe(tap(() => this.refresh$$.next(null)));
  }

  removeTodo(todoId: number) {
    return this.http
      .delete(`${BASE_URL}/todos/${todoId}`)
      .pipe(tap(() => this.refresh$$.next(null)));
  }

  patchTodo(todoId: number, fieldsToPutch: FieldToUpdate) {
    return this.http
      .patch<Todo>(`${BASE_URL}/todos/${todoId}`, {
        ...fieldsToPutch,
      })
      .pipe(tap(() => this.refresh$$.next(null)));
  }
}
