import { Component, DestroyRef, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { EmployeeInterface, EmployeeService } from '@employee-management/data';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css',
})
export class EmployeeDetailsComponent implements OnInit {

  private readonly employeeId = signal<number | null>(null);
  public readonly employee = computed<EmployeeInterface | null>(() => {
    const employeeId = this.employeeId();
    return employeeId === null
      ? null
      : this.employeeService.getEmployeeById(employeeId);
  });
  private activatedRoute = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  private destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const employeeId = params.get('employeeId');
        this.employeeId.set(employeeId === null ? null : Number(employeeId));
      });
  }
}