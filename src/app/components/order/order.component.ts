import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderForm
  minDate = new Date()
  constructor(private _snackBar: MatSnackBar, public fb: FormBuilder, public userService: UserService, private r: Router) { }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      city: ["", [Validators.required]],
      street: ["", [Validators.required]],
      deliveryDate: ["", [Validators.required,]],
      creditCard: ["", [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    })
  }
  autoFillCity() {
    this.orderForm.patchValue({
      city: this.userService.user.city
    })
  }
  autoFillStreet() {
    this.orderForm.patchValue({
      street: this.userService.user.street
    })
  }
  order() {
    this.userService.order(this.orderForm.value).subscribe(
      (res: any) => {
        console.log(res)
        if (!res.error) {
          this.openSnackBar(res.msg)
          setTimeout(() => {
            this.userService.cartStatus.cartStatus = 'notActive'
            this.r.navigateByUrl('')
          }, 1000)
        }
      }, error => {
        error.error.error && error.error.msg ? this.openSnackBar(error.error.msg) : null
      }
    )
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'close', {
      duration: 4000,
    });
  }
}
