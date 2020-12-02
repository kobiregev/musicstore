import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from 'src/app/service/store.service';
import { UserService } from 'src/app/service/user.service';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product
  constructor(public userService: UserService, public dialog: MatDialog, public storeService: StoreService) { }

  ngOnInit(): void {

  }

  openDialog() {
    const dialogRef = this.dialog.open(AddToCartComponent, {
      data: { product: this.product }
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  funcz() {
    this.storeService.setForm(this.product)
    console.log(this.storeService.currentForm)
    this.storeService.sideNav.open()
  }
}
