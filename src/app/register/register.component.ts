import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User;
  @Output() registerCancel = new EventEmitter<boolean>();
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, [this.passwordMatchValidator]);
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(24)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService
        .register(this.user)
        .subscribe(
          () => this.alertifyService.success('Successfully registered'),
          error => this.alertifyService.error(error),
          () => this.authService.login(this.user).subscribe(() => this.router.navigate(['/members']))
        );
    }
  }

  cancel() {
    this.registerCancel.emit(false);
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value
      ? null
      : { missmatch: true };
  }

  getValidationClass(fieldName: string) {
    return {
      'has-error':
        this.registerForm.get(fieldName).errors &&
        this.registerForm.get(fieldName).touched
    };
  }

  hasErrorAndTouched(error: string, fieldName: string) {
    return (
      this.registerForm.get(fieldName).hasError(error) &&
      this.registerForm.get(fieldName).touched
    );
  }

  hasErrorsAndTouched(fieldName: string) {
    return (
      this.registerForm.get(fieldName).errors &&
      this.registerForm.get(fieldName).touched
    );
  }
}
