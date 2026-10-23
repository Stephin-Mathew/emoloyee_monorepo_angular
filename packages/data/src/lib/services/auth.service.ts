import { Injectable } from '@angular/core';
import { LoginCredentials } from '../models/login.interface';
import { SignupDetails, UserPermissions } from '../models/signup.interface';

export type PermissionName = keyof UserPermissions;

// Default administrator account, created automatically on first run.
const DEFAULT_ADMIN: SignupDetails = {
  name: 'Administrator',
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin',
  permissions: { add: true, edit: true, delete: true },
};

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private readonly usersStorageKey = 'users';
  private readonly loggedInUserStorageKey = 'loggedInUser';
  private readonly loginTimeStorageKey = 'loginTime';
  private readonly sessionDuration = 10 * 60 * 1000;

  public login(credentials: LoginCredentials): boolean {
    const user = this.getUsers().find(
      (registeredUser) =>
        registeredUser.username === credentials.username &&
        registeredUser.password === credentials.password
    );

    if (!user) {
      return false;
    }
    sessionStorage.setItem(this.loggedInUserStorageKey, user.username);
    sessionStorage.setItem(this.loginTimeStorageKey, Date.now().toString());
    return true;
  }

  public signup(user: SignupDetails): boolean {
    const users = this.getUsers();

    const usernameExists = users.some(
      (registeredUser) => registeredUser.username === user.username
    );
    const emailExists = users.some(
      (registeredUser) => registeredUser.email === user.email
    );

    if (usernameExists || emailExists) {
      return false;
    }

    users.push({
      ...user,
      role: 'user',
      permissions: { add: false, edit: false, delete: false },
    });
    this.saveUsers(users);

    return true;
  }

  public isLoggedIn(): boolean {
    return (
      sessionStorage.getItem(this.loggedInUserStorageKey) !== null &&
      sessionStorage.getItem(this.loginTimeStorageKey) !== null
    );
  }

  public validateSession(): boolean {
    const username = sessionStorage.getItem(this.loggedInUserStorageKey);
    const loginTime = sessionStorage.getItem(this.loginTimeStorageKey);

    if (!username || !loginTime) {
      this.logout();
      return false;
    }

    const elapsedTime = Date.now() - Number(loginTime);
    const sessionIsValid =
      elapsedTime >= 0 && elapsedTime < this.sessionDuration;

    if (!sessionIsValid) {
      this.logout();
      return false;
    }
    return true;
  }

  public getLoggedInUser(): SignupDetails | null {
    if (!this.isLoggedIn()) {
      return null;
    }
    const username = sessionStorage.getItem(this.loggedInUserStorageKey);
    return this.getUsers().find((user) => user.username === username) ?? null;
  }

  public isAdmin(): boolean {
    return this.getLoggedInUser()?.role === 'admin';
  }

  public hasPermission(permission: PermissionName): boolean {
    const user = this.getLoggedInUser();

    if (!user) {
      return false;
    }
    if (user.role === 'admin') {
      return true;
    }
    return user.permissions?.[permission] === true;
  }

  // Every registered user except the admin (used by Access Management).
  public getManageableUsers(): SignupDetails[] {
    return this.getUsers().filter((user) => user.role !== 'admin');
  }

  public updatePermissions(
    username: string,
    permission: PermissionName,
    allowed: boolean
  ): void {
    if (!this.isAdmin()) {
      return;
    }

    const users = this.getUsers();
    const target = users.find(
      (user) => user.username === username && user.role !== 'admin'
    );

    if (!target) {
      return;
    }

    // signup always sets all three permissions, so the object is complete.
    target.permissions = {
      ...(target.permissions as UserPermissions),
      [permission]: allowed,
    };
    this.saveUsers(users);
  }

  public logout(): void {
    sessionStorage.removeItem(this.loggedInUserStorageKey);
    sessionStorage.removeItem(this.loginTimeStorageKey);
  }

  // Returns all users, creating the default admin the first time.
  private getUsers(): SignupDetails[] {
    const users = this.readUsers();
    const adminExists = users.some(
      (user) => user.username === DEFAULT_ADMIN.username
    );

    if (!adminExists) {
      users.unshift({ ...DEFAULT_ADMIN });
      this.saveUsers(users);
    }
    return users;
  }

  private readUsers(): SignupDetails[] {
    const storedUsers = localStorage.getItem(this.usersStorageKey);
    if (!storedUsers) {
      return [];
    }

    try {
      const users: unknown = JSON.parse(storedUsers);
      return Array.isArray(users) ? (users as SignupDetails[]) : [];
    } catch {
      return [];
    }
  }

  private saveUsers(users: SignupDetails[]): void {
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
  }
}