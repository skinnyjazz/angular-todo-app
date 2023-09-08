import {
  Component,
  Input,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Todo } from "src/app/types/todo";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnChanges {
  @Output() delete = new EventEmitter();
  // @Output() toggle = new EventEmitter();
  // @Output() rename = new EventEmitter<string>();
  @Output() update = new EventEmitter();
  @Input() todo!: Todo;
  @ViewChild("titleField")
  set titleField(field: ElementRef) {
    if (field) {
      field.nativeElement.focus();
    }
  }

  editing = false;

  title = "";

  ngOnChanges({ todo }: SimpleChanges): void {
    if (todo.currentValue.title !== todo.previousValue?.title) {
      this.title = todo.currentValue.title;
    }
  }

  edit() {
    this.editing = true;
    this.title = this.todo.title;
  }

  save() {
    if (!this.editing) {
      return;
    }
    this.editing = false;
    this.update.emit({ title: this.title });
  }
}
