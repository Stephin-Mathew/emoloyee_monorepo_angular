import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-checkbox',
  standalone: true,
  templateUrl: './custom-checkbox.component.html',
  styleUrl: './custom-checkbox.component.css',
})
export class CustomCheckboxComponent {
  @Input() checked = false;
  @Input() ariaLabel = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  public onChange(event: Event): void {
    this.checkedChange.emit((event.target as HTMLInputElement).checked);
  }
}
