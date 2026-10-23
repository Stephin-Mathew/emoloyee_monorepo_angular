import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  CustomInputComponent,
} from '@employee-management/shared-ui';
import {
  EmployeeFormErrorsInterface,
  EmployeeInterface,
} from '@employee-management/data';

@Component({
  selector: 'app-employee-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent],
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.css'],
})
export class EmployeeModalComponent {
  private  formBuilder = inject(FormBuilder);

  @Output() save = new EventEmitter<EmployeeInterface>();
  @Output() cancel = new EventEmitter<void>();

  @Input() existingEmployees: EmployeeInterface[] = [];

  @Input()
  set employee(value: EmployeeInterface | null) {
    this.currentEmployee = value;
    this.isEditMode = !!value;

    if (value) {
      this.employeeForm.patchValue({
        employeeId: value.employeeId,
        employeeName: value.employeeName,
        employeeAge: value.employeeAge,
        employeeDepartment: value.employeeDepartment,
        employeeRole: value.employeeRole,
      });
      this.employeeForm.controls.employeeId.disable({ emitEvent: false });
    } else {
      this.employeeForm.controls.employeeId.enable({ emitEvent: false });
      this.employeeForm.reset();
    }
  }

  private currentEmployee: EmployeeInterface | null = null;
  public isEditMode = false;
  public formErrors: EmployeeFormErrorsInterface = {};

  public employeeForm = this.formBuilder.group({
    employeeId: [
      null as number | null,
      [Validators.required,
      Validators.min(101)]
    ],

    employeeName: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-Za-z ]+$/),
      ],
    ],

    employeeAge: [
      null as number | null,
      [
        Validators.required,
        Validators.min(18),
        Validators.max(65),
      ],
    ],

    employeeDepartment: [
      '',
      Validators.required,
    ],

    employeeRole: [
      '',
      Validators.required,
    ],
  });

  private readonly formSubscription = this.employeeForm.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateFormErrors());

  public submitForm(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    const formValue = this.employeeForm.getRawValue();

    if (
      formValue.employeeId === null ||
      formValue.employeeAge === null ||
      formValue.employeeName === null ||
      formValue.employeeDepartment === null ||
      formValue.employeeRole === null
    ) {
      return;
    }

    if (this.hasDuplicateId(formValue.employeeId)) {
      return;
    }

    const employeeName = formValue.employeeName.trim();
    const employeeDepartment = formValue.employeeDepartment.trim();
    const employeeRole = formValue.employeeRole.trim();

    if (!employeeName || !employeeDepartment || !employeeRole) {
      return;
    }

    const employee: EmployeeInterface = {
      employeeId: formValue.employeeId,
      employeeName,
      employeeAge: formValue.employeeAge,
      employeeDepartment,
      employeeRole,
    };

    this.save.emit(employee);
  }

  public hasDuplicateId(employeeId: number): boolean {
    return this.existingEmployees.some(
      (employee) =>
        employee.employeeId === employeeId &&
        (!this.currentEmployee ||
          employee.employeeId !== this.currentEmployee.employeeId)
    );
  }

  private updateFormErrors(): void {
    const controls = this.employeeForm.controls;
    const employeeId = controls.employeeId.value;
    const errors: EmployeeFormErrorsInterface = {};

    if (controls.employeeId.dirty) {
      if (controls.employeeId.hasError('required')) {
        errors.employeeId = 'Employee ID is required.';
      }else if (controls.employeeId.hasError('min')){
        errors.employeeId = 'Employee ID cannot be less than 100';
      }
       else if (employeeId !== null && this.hasDuplicateId(employeeId)) {
        errors.employeeId = 'Employee ID already exists.';
      }
    }

    if (controls.employeeName.dirty) {
      if (controls.employeeName.hasError('required')) {
        errors.employeeName = 'Employee name is required.';
      } else if (controls.employeeName.hasError('pattern')) {
        errors.employeeName = 'Employee name can only contain letters and spaces.';
      }
    }

    if (controls.employeeAge.dirty) {
      if (controls.employeeAge.hasError('required')) {
        errors.employeeAge = 'Employee age is required.';
      } else if (
        controls.employeeAge.hasError('min') ||
        controls.employeeAge.hasError('max')
      ) {
        errors.employeeAge = 'Employee age must be between 18 and 65.';
      }
    }

    if (
      controls.employeeDepartment.dirty &&
      controls.employeeDepartment.hasError('required')
    ) {
      errors.employeeDepartment = 'Employee department is required.';
    }

    if (
      controls.employeeRole.dirty &&
      controls.employeeRole.hasError('required')
    ) {
      errors.employeeRole = 'Employee role is required.';
    }
    this.formErrors = errors;
  }
}
