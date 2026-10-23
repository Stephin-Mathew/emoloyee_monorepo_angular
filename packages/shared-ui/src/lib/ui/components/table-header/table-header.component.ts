import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { InputValue } from '@employee-management/data';
import { CustomInputComponent } from '../custom-input/custom-input.component';

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CustomInputComponent],
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css'],
})
export class TableHeaderComponent {

  @Input()
  searchPlaceholder = 'Search by name or ID...';

  @Input()
  canAdd = false;

  @Output()
  searchChange = new EventEmitter<InputValue>();

  @Output()
  addEmployee = new EventEmitter<void>();
}
