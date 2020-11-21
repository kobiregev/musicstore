import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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


  constructor(public formService: FormBuilder, public userService: UserService, private registerValidators: RegisterValidators) { }

  ngOnInit(): void {
    this.firstForm = this.formService.group({
      id: ["", [Validators.required, this.registerValidators.israelIdValidator]],
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
  val() {
    console.log(this.firstForm)
  }
  confirmPasswordValidator() {
    return this.firstForm?.password.value !== this.firstForm?.confirmPassword.value ? { mustMatch: true } : null
  }
}


// ValidateEmailNotTaken.createValidator(this.userService)