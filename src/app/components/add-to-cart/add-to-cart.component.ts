import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  quantity = 0
  product
  constructor(private userService: UserService,
    private dialogRef: MatDialogRef<AddToCartComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.product = data.product
  }
  ngOnInit(): void {
  }
  setQuantity(quantity) {
    this.quantity = quantity.target.value
  }
  cancel() {
    this.dialogRef.close()
  }
  addToCart() {
    this.userService.addToCart(this.product._id, this.quantity).subscribe(
      (res: any) => {
        if (!res.error) {
          this.userService.cart = res
          this.userService.setDataSource(res.products)
          this.dialogRef.close()
        }
      }, error => {
        console.log(error)
      }
    )
  }

}
