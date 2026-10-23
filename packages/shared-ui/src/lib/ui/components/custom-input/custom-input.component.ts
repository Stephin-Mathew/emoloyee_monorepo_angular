import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import {
  InputType,
  InputValue,
  InputVariant,
} from '@employee-management/data';

let nextInputId = 0;

@Component({
  selector: 'app-custom-input',
  standalone: true,
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.css'],
})
export class CustomInputComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  /** auth = login/signup look, compact = modal look, search = search box look. */
  @Input() variant: InputVariant = 'auth';
  @Input() markRequired = false;
  @Input() inputId = `app-input-${nextInputId++}`;
  @Input() ariaLabel = '';
  /** An error message decided by the parent (shown as is). */
  @Input() error: string | null | undefined = '';
  /** Messages for validator errors, e.g. { required: 'Name is required.' }.
   *  Shown once the control has been touched. */
  @Input() errors: Record<string, string> = {};

  @Input()
  set value(newValue: InputValue | undefined) {
    this.current = newValue ?? '';
  }

  @Output() valueChange = new EventEmitter<InputValue>();

  public current: InputValue = '';
  public isDisabled = false;

  public get displayValue(): string {
    return this.current === null ? '' : String(this.current);
  }

  private onChange: (value: InputValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  public get invalid(): boolean {
    const control = this.ngControl?.control;
    return !!control && control.invalid && control.touched;
  }

  public get errorMessage(): string {
    if (this.error) {
      return this.error;
    }

    const control = this.ngControl?.control;

    if (control?.touched && control.errors) {
      for (const key of Object.keys(control.errors)) {
        if (this.errors[key]) {
          return this.errors[key];
        }
      }
    }

    return '';
  }

  public onInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (this.type === 'number') {
      this.commit(element.value === '' ? null : Number(element.value));
      return;
    }
    this.commit(element.value);
  }
  public onBlur(): void {
    this.onTouched();
  }
  private commit(newValue: InputValue): void {
    this.current = newValue;
    this.valueChange.emit(newValue);
    this.onChange(newValue);
  }

  // ControlValueAccessor
  public writeValue(newValue: InputValue | undefined): void {
    this.current = newValue ?? '';
  }
  public registerOnChange(fn: (value: InputValue) => void): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
