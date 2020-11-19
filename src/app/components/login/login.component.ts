import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm
  hide = true;

  constructor(public formService: FormBuilder, private routerService: Router, public userService: UserService) { }

  ngOnInit(): void {
    this.loginForm = this.formService.group({
      email: ["", Validators.email],
      password: ["", [Validators.minLength(4), Validators.required]],
    })
  }
  getErrorMessage() {
    if (this.loginForm.controls.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.loginForm.controls.email.hasError('email') ? 'Not a valid email' : '';
  }

  register() {
    this.routerService.navigateByUrl('/register')
  }

  login() {
    this.userService.login(this.loginForm.value).subscribe(
      (res: any) => {
        if (!res.error) {
          this.userService.setUser(res.token, res.cart)
        }
      }, error => {
        console.log(error)
      }
    )
  }
}
