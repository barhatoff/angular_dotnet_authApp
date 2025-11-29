import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ui-edit-button',
  imports: [MatIcon, MatIconButton],
  templateUrl: './edit-button.component.html',
})
export class EditButtonComponent {}
