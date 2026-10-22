import { Injectable, signal } from '@angular/core';
import { EmployeeInterface } from 'employee-management-shared';

import { SEED_HIRES } from '../data/seed';
import { HireDraft } from '../models/hire.model';
import { isEmployeeList } from '../utils/employee-guards';
import { readJson, writeJson } from '../utils/safe-storage';

const STORAGE_KEY = 'employee-onboarding.hires';
const FIRST_ID = 201;

/** Owns the list of new hires and persists it to localStorage. */
@Injectable({ providedIn: 'root' })
export class HireService {
  private readonly state = signal<EmployeeInterface[]>(
    readJson(STORAGE_KEY, isEmployeeList) ?? [...SEED_HIRES],
  );

  public readonly hires = this.state.asReadonly();

  public getById(employeeId: number): EmployeeInterface | undefined {
    return this.state().find((hire) => hire.employeeId === employeeId);
  }

  public add(draft: HireDraft): EmployeeInterface {
    const hire: EmployeeInterface = { ...draft, employeeId: this.nextId() };
    this.commit([...this.state(), hire]);
    return hire;
  }

  public update(updated: EmployeeInterface): void {
    this.commit(
      this.state().map((hire) => (hire.employeeId === updated.employeeId ? updated : hire)),
    );
  }

  public remove(employeeId: number): void {
    this.commit(this.state().filter((hire) => hire.employeeId !== employeeId));
  }

  private nextId(): number {
    return this.state().reduce((max, hire) => Math.max(max, hire.employeeId), FIRST_ID - 1) + 1;
  }

  private commit(hires: EmployeeInterface[]): void {
    this.state.set(hires);
    writeJson(STORAGE_KEY, hires);
  }
}
