import { Component } from '@angular/core';

interface PageInfo {
  name: string;
  description: string;
  who: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  public readonly features: string[] = [
    'View, search and sort employees in a table',
    'Browse employee details in a simple list view',
    'Add, edit and delete employees (for users with access)',
    'Admin-controlled access management for every registered user',
    'Sign up and login with an automatic 10-minute session timeout',
    'Day and night themes that are remembered between visits',
    'Built-in Help page with screenshots',
  ];

  public readonly gettingStarted: string[] = [
    'Create an account from the Sign up page, then log in.',
    'New accounts can view employees but cannot make changes.',
    'Ask the admin to open Access Management and tick Add, Edit or Delete for you.',
    'Open the employee table again to see your new options.',
  ];

  public readonly pages: PageInfo[] = [
    {
      name: 'Employee table',
      description:
        'Shows every employee with ID, name, age, department and role. Search by name or ID, and sort by ID or age.',
      who: 'Everyone (changes need access)',
    },
    {
      name: 'Employee list',
      description:
        'A list of employees on the left. Select one to see their full details on the right.',
      who: 'Everyone',
    },
    {
      name: 'Help',
      description: 'A step-by-step guide to each part of the app, with screenshots.',
      who: 'Everyone',
    },
    {
      name: 'About',
      description: 'This page: what the app does, how it works and its limits.',
      who: 'Everyone',
    },
    {
      name: 'Access Management',
      description:
        'Lists registered users and lets the admin choose who can add, edit or delete employees.',
      who: 'Admin only',
    },
  ];

  public readonly technologies: string[] = [
    'Angular (standalone components and route guards)',
    'TypeScript',
    'HTML and CSS with light and dark theme variables',
    'Browser localStorage and sessionStorage for data',
  ];

  public readonly dataNotes: string[] = [
    'Users and their permissions are saved in your browser (localStorage).',
    'Employee records are loaded from a sample file the first time the app opens, then saved in your browser. Your add, edit and delete changes stay there.',
    'Your login is kept in sessionStorage, so it ends when the browser tab is closed, or after 10 minutes.',
    'Your theme choice (day or night) is remembered in your browser.',
    'Nothing is sent to a server, so data is not shared between browsers or devices.',
  ];

  public readonly faqs: FaqItem[] = [
    {
      question: 'Why can I not see the Add, Edit or Delete options?',
      answer:
        'Your account has not been given that access yet. Ask the admin to enable it for you in Access Management.',
    },
    {
      question: 'Why is Access Management missing from my settings menu?',
      answer: 'It is only available to the admin.',
    },
    {
      question: 'I was logged out suddenly. Why?',
      answer:
        'For safety, every session ends automatically after 10 minutes. Just log in again.',
    },
    {
      question: 'I made changes but they are gone on another computer.',
      answer:
        'Data is stored only in the browser you used, so another browser or device will not have it.',
    },
    {
      question: 'Do permission changes need me to log in again?',
      answer:
        'No. Once the admin saves a change, it applies the next time you open the employee table.',
    },
  ];

  public readonly disclaimers: string[] = [
    'This is a demo application. All data (users and employees) is stored in your own browser and is not sent to any server.',
    'Passwords are stored in the browser without encryption, so please do not use a real or important password.',
    'Clearing your browser data will remove all registered users, permissions and employee changes.',
    'Access control in this app works only in the browser and is not a replacement for server-side security.',
    'The employee information shown is sample data only.',
  ];
}
