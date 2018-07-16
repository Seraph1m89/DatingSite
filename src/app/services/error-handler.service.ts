import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class ErrorHandlerService {
  constructor() {}

  handleError(error: any) {
    console.log(error);
    const applicatioError = error.headers.get('Application-Error');
    if (applicatioError) {
      return Observable.throw(applicatioError);
    }
    const serverError = error.json();
    let modelStateErrors = '';
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += `${serverError[key]}\n`;
        }
      }
    }

    return Observable.throw(modelStateErrors || 'Server error');
  }
}
