import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ui-delete-button',
  imports: [MatIconButton, MatIcon],
  templateUrl: './delete-button.component.html',
})
export class DeleteButtonComponent {}
