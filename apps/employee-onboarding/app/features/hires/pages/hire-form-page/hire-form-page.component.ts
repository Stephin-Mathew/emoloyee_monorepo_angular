import { Component, inject, input, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomInputComponent, EmployeeInterface, InputValue } from 'employee-management-shared';

import { DEPARTMENTS } from '../../../../core/constants/departments';
import { HireDraft } from '../../../../core/models/hire.model';
import { HireService } from '../../../../core/services/hire.service';
import { notBlank } from '../../../../core/validators/not-blank.validator';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';

const MIN_AGE = 18;
const MAX_AGE = 70;

@Component({
  selector: 'app-hire-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CustomInputComponent, PageHeaderComponent],
  templateUrl: './hire-form-page.component.html',
  styleUrl: './hire-form-page.component.css',
})
export class HireFormPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly hireService = inject(HireService);

  /** Bound from the `:id` route param; undefined when adding a new hire. */
  public readonly id = input<string>();

  protected readonly departments = DEPARTMENTS;
  protected editing: EmployeeInterface | null = null;

  protected readonly form = new FormGroup({
    employeeName: new FormControl<InputValue>('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.minLength(2)],
    }),
    employeeAge: new FormControl<InputValue>(null, {
      validators: [Validators.required, Validators.min(MIN_AGE), Validators.max(MAX_AGE)],
    }),
    employeeDepartment: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    employeeRole: new FormControl<InputValue>('', {
      nonNullable: true,
      validators: [Validators.required, notBlank],
    }),
  });

  protected readonly nameErrors = {
    required: 'Full name is required.',
    blank: 'Full name is required.',
    minlength: 'Enter at least 2 characters.',
  };
  protected readonly ageErrors = {
    required: 'Age is required.',
    min: `Hires must be at least ${MIN_AGE}.`,
    max: `Age can't be more than ${MAX_AGE}.`,
  };
  protected readonly roleErrors = {
    required: 'Job title is required.',
    blank: 'Job title is required.',
  };

  // Components are OnPush by default (Angular 22) and <app-custom-input> reads `touched` imperatively,
  // so `markAllAsTouched()` alone never re-renders its error text. After a failed submit we instead
  // push the message in through its `error` input, which does mark it for check. Tracking the form
  // status keeps those messages in sync as the user fixes each field.
  private readonly submitAttempted = signal(false);
  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  public ngOnInit(): void {
    const rawId = this.id();
    if (rawId === undefined) {
      return;
    }

    const existing = this.hireService.getById(Number(rawId));
    if (!existing) {
      void this.router.navigate(['/hires'], { replaceUrl: true });
      return;
    }

    this.editing = existing;
    this.form.patchValue(existing);
  }

  protected get department(): FormControl<string> {
    return this.form.controls.employeeDepartment;
  }

  /** Error text to force-show after a failed submit; empty lets the input use its own touched logic. */
  protected submitError(control: FormControl<InputValue>, messages: Record<string, string>): string {
    this.formStatus(); // re-evaluate whenever validity changes
    if (!this.submitAttempted() || !control.errors) {
      return '';
    }
    const key = Object.keys(control.errors).find((errorKey) => messages[errorKey]);
    return key ? (messages[key] ?? '') : '';
  }

  protected save(): void {
    if (this.form.invalid) {
      this.submitAttempted.set(true);
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const draft: HireDraft = {
      employeeName: String(value.employeeName).trim(),
      employeeAge: Number(value.employeeAge),
      employeeDepartment: value.employeeDepartment,
      employeeRole: String(value.employeeRole).trim(),
    };

    if (this.editing) {
      this.hireService.update({ ...draft, employeeId: this.editing.employeeId });
    } else {
      this.hireService.add(draft);
    }

    void this.router.navigate(['/hires']);
  }
}
