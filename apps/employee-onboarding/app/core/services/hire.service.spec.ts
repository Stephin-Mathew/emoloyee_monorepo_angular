import { TestBed } from '@angular/core/testing';

import { SEED_HIRES } from '../data/seed';
import { HireService } from './hire.service';

describe('HireService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  const create = (): HireService => TestBed.inject(HireService);

  it('starts from seed data when storage is empty', () => {
    expect(create().hires()).toHaveLength(SEED_HIRES.length);
  });

  it('assigns the next id after the highest existing one', () => {
    const service = create();
    const added = service.add({
      employeeName: 'New Person',
      employeeAge: 30,
      employeeDepartment: 'Design',
      employeeRole: 'Designer',
    });
    expect(added.employeeId).toBe(209);
    expect(service.getById(209)?.employeeName).toBe('New Person');
  });

  it('updates and removes hires', () => {
    const service = create();
    const first = service.hires()[0];

    service.update({ ...first, employeeRole: 'Principal Engineer' });
    expect(service.getById(first.employeeId)?.employeeRole).toBe('Principal Engineer');

    service.remove(first.employeeId);
    expect(service.getById(first.employeeId)).toBeUndefined();
  });

  it('persists changes and restores them in a fresh instance', () => {
    create().remove(201);
    TestBed.resetTestingModule();
    expect(create().getById(201)).toBeUndefined();
  });

  it('falls back to seed data when stored JSON is corrupt', () => {
    localStorage.setItem('employee-onboarding.hires', '{not json');
    expect(create().hires()).toHaveLength(SEED_HIRES.length);
  });

  it('rejects stored data with the wrong shape', () => {
    localStorage.setItem('employee-onboarding.hires', JSON.stringify([{ employeeId: 'x' }]));
    expect(create().hires()).toHaveLength(SEED_HIRES.length);
  });
});
