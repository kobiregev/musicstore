import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm
  errorMsg
  hide = true;

  constructor(public formService: FormBuilder, private routerService: Router, public userService: UserService, private ar: ActivatedRoute, private storeService: StoreService) { }

  ngOnInit(): void {
    this.storeService.setPath(this.ar.snapshot.routeConfig.path)
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
          this.errorMsg = ''
        }
      }, error => {
        error.error.error ? this.errorMsg = error.error.msg : null
      }
    )
  }
  createCart() {
    this.userService.createCart().subscribe(
      (res: any) => {
        if (!res.error) {
          this.userService.cartStatus.cartStatus = 'open'
          this.routerService.navigateByUrl('/shop')
        }
      }, error => {
        console.log(error)
      }
    )
  }
  resumeShopping() {
    this.userService.user ? this.routerService.navigateByUrl('/shop') : null
  }

}
