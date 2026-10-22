import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  public readonly open = input(false);
  public readonly title = input.required<string>();
  public readonly message = input('');
  public readonly confirmLabel = input('Confirm');

  public readonly confirmed = output<void>();
  public readonly cancelled = output<void>();

  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  public constructor() {
    // Move focus into the dialog when it opens so Escape and keyboard users work immediately.
    effect(() => this.dialog()?.nativeElement.focus());
  }
}
