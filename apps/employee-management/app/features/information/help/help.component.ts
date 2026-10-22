import { Component } from '@angular/core';

interface HelpSection {
  title: string;
  image: string;
  imageAlt: string;
  points: string[];
}

@Component({
  selector: 'app-help',
  standalone: true,
  templateUrl: './help.component.html',
  styleUrl: './help.component.css',
})
export class HelpComponent {
  public readonly sections: HelpSection[] = [
    {
      title: '1. Creating an account and logging in',
      image: 'assets/help/login.png',
      imageAlt: 'Login page',
      points: [
        'New users can click "Sign up" on the login page and fill in name, username, email and password.',
        'After signing up, log in with your username and password.',
        'For security, you are logged out automatically after 10 minutes.',
        'New accounts can only view employees. Ask the admin to grant you access to add, edit or delete.',
      ],
    },
    {
      title: '2. Employee table',
      image: 'assets/help/table.png',
      imageAlt: 'Employee table page',
      points: [
        'Open it with the table icon in the left sidebar.',
        'Use the search box to find an employee by name or ID.',
        'Click the ID or Age column heading to sort the table.',
        'The "Add Employee" button and the Edit / Delete icons are only shown to users who have been given that access.',
      ],
    },
    {
      title: '3. Adding and editing an employee',
      image: 'assets/help/modal.png',
      imageAlt: 'Add employee form',
      points: [
        'Click "+ Add Employee" to open the form, fill in the details and save.',
        'Click the pencil icon on a row to edit that employee.',
        'Click the bin icon on a row to delete an employee. You will be asked to confirm first.',
      ],
    },
    {
      title: '4. Employee list',
      image: 'assets/help/list.png',
      imageAlt: 'Employee list page',
      points: [
        'Open it with the people icon in the left sidebar.',
        'Pick any employee on the left to see their full details on the right.',
        'This page is view-only and is available to everyone.',
      ],
    },
    {
      title: '5. Header options',
      image: 'assets/help/settings.png',
      imageAlt: 'Settings menu',
      points: [
        'The sun / moon switch changes between day and night theme.',
        'The gear icon opens Help, About and (for admins only) Access Management.',
        'The person icon shows your profile and lets you log out.',
      ],
    },
    {
      title: '6. Access management (admin only)',
      image: 'assets/help/access.png',
      imageAlt: 'Access management page',
      points: [
        'Only the admin can see and open this page.',
        'Every registered user is listed with three checkboxes: Add, Edit and Delete.',
        'Tick a box to give that user the permission, untick it to take it away. Changes are saved straight away.',
        'The user sees the change the next time they open the employee table.',
      ],
    },
  ];

  // If a screenshot file is missing, hide the broken image.
  public hideImage(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
