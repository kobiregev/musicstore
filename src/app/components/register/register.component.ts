import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from 'src/app/service/user.service';
import { RegisterValidators } from 'src/app/validators/notTaken.validator';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
  firstForm
  secondForm
  isEditable = false;
  cities = [
    { value: 'Tel-Aviv' },
    { value: 'Yavne' },
    { value: 'Holon' },
    { value: 'Hifa' },
    { value: 'Eilat' },
    { value: 'Jerusalem' },
    { value: 'Ashdod' },
    { value: 'Bat-Yam' },
    { value: 'Beersheba' },
    { value: 'Herzliya' },
  ]


  constructor(public formService: FormBuilder, public userService: UserService, private registerValidators: RegisterValidators, private router: Router) { }

  ngOnInit(): void {
    this.firstForm = this.formService.group({
      israeliId: ["", [Validators.required, this.registerValidators.israelIdValidator], [this.registerValidators.idValidator()]],
      email: ["", [Validators.required, Validators.email,], [this.registerValidators.emailValidator()]],
      password: ["", [Validators.required, Validators.minLength(4)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(4)]],
    }, { validator: this.registerValidators.confirmPasswordValidator() })

    this.secondForm = this.formService.group({
      city: ["", Validators.required],
      street: ["", Validators.required],
      fname: ["", Validators.required],
      lname: ["", Validators.required],
    })
  }
  register(stepper) {
    this.userService.register({ ...this.firstForm.value, ...this.secondForm.value }).subscribe(
      (res: any) => {
        !res.error ? this.router.navigateByUrl('') : null
      }, error => {
        console.log(error)
      }
    )
  }
}


// ValidateEmailNotTaken.createValidator(this.userService)