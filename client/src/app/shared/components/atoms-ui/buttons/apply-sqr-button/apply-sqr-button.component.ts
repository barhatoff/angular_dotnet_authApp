import { Component, input, output } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ui-apply-sqr-button',
  imports: [MatFabButton, MatIcon],
  templateUrl: './apply-sqr-button.component.html',
})
export class ApplySqrButtonComponent {
  isDisabled = input<boolean>();
}
