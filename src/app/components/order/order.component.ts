import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import { UserService } from 'src/app/service/user.service';
import { OrderConfirmationComponent } from '../order-confirmation/order-confirmation.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @ViewChild('cart') cart;

  orderForm
  minDate = new Date()
  constructor(private _snackBar: MatSnackBar, public fb: FormBuilder, public userService: UserService,
    private r: Router,
    private storeService: StoreService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      city: ["", [Validators.required]],
      street: ["", [Validators.required]],
      deliveryDate: ["", [Validators.required,]],
      creditCard: ["", [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    })
  }
  ngAfterViewInit(): void {
    this.storeService.setCartForPdf(this.cart)
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
          this.openDialog()
          this.userService.cartStatus.cartStatus = 'notActive'
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
  openDialog() {
    const dialogRef = this.dialog.open(OrderConfirmationComponent)
    dialogRef.afterClosed().subscribe(() => {
      this.r.navigateByUrl('')
    });
  }
}
