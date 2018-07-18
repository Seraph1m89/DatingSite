import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import 'rxjs/add/observable/throw';

@Injectable()
export class ErrorHandlerService {
  constructor() {}

  handleError(error: Response) {
    console.log(error);
    const applicatioError = error.headers.get('Application-Error');
    if (applicatioError) {
      return Observable.throw(applicatioError);
    }
    const errorText = error.text();
    let serverError;
    try {
      serverError = error.json();
    } catch (e) {
      console.log('Response is not JSON');
    }

    let modelStateErrors = '';
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += `${serverError[key]}\n`;
        }
      }
    } else {
      modelStateErrors += errorText;
    }

    return Observable.throw(modelStateErrors || 'Server error');
  }
}
