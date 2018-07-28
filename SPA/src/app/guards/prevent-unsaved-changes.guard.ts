import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ICanDeactivate } from '../interfaces/can-deactivate.interface';

@Injectable()
export class PreventUnsavedChanged<T extends ICanDeactivate>
  implements CanDeactivate<ICanDeactivate> {
  canDeactivate(component: T): boolean {
    if (component.canDeactivate()) {
      return confirm(
        'Are you sure you want to leave this page? You changes will not be saved'
      );
    }

    return true;
  }
}
