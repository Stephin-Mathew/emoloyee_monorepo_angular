import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EmployeeInterface } from 'employee-management-shared';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css'],
})
export class DeleteModalComponent {
  @Input() employee: EmployeeInterface | null = null;

  @Output() confirm = new EventEmitter<EmployeeInterface | null>();
  @Output() cancel = new EventEmitter<void>();
}
