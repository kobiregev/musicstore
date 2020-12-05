import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'quantity', 'price', 'image', 'action']
  productForm
  path
  newProduct = false
  categories = [
    { value: '5fafcd48a1b1d99c71096d04', viewValue: 'Guitars and Basses' },
    { value: '5fafcdeba1b1d99c71096d07', viewValue: 'Drums and Percussion' },
    { value: '5fafce2ba1b1d99c71096d08', viewValue: 'Electric Guitar Amps' },
    { value: '5fafce63a1b1d99c71096d09', viewValue: 'Keys' },
    { value: '5fafce93a1b1d99c71096d0a', viewValue: 'DJ Equipment' },
  ];
  constructor(
    public userService: UserService, public storeService: StoreService,
    public fb: FormBuilder, public r: Router, public ar: ActivatedRoute) { }

  ngOnInit(): void {
    this.storeService.setPath(this.ar.snapshot.routeConfig.path)
    this.getCart()
    this.productForm = this.fb.group({
      _id: [''],
      name: [''],
      category: [''],
      price: [''],
      imgUrl: ['']
    })
    // can be shortend
    this.storeService.currentPath === 'shop' ? this.displayedColumns = ['name', 'quantity', 'price', 'image', 'action'] : this.displayedColumns = ['name', 'quantity', 'price', 'image']
  }

  ngAfterViewInit(): void {
    this.userService.setPaginator(this.paginator)
    this.storeService.currentForm = this.productForm
  }
  ngOnDestroy(): void {
    this.userService.setPaginator(null)
  }

  getCart() {
    this.userService.getCart().subscribe(
      (res: any) => {
        if (!res.error) {
          this.userService.cart = res
          this.userService.setDataSource(res.products)
        }
        !res.error ? this.userService.cart = res : null
      }, error => {
        console.log(error)
      }
    )
  }

  removeFromCart(productId) {
    this.userService.removeFromCart(productId).subscribe(
      (res: any) => {
        if (!res.error) {
          this.userService.cart = res
          this.userService.setDataSource(res.products)
        }
      }, error => {
        console.log(error)
      }
    )
  }
  saveProduct() {
    this.storeService.saveProduct(this.productForm.value).subscribe(
      (res: any) => {
        if (!res.error) {
          this.userService.products = res
          this.storeService.unselectCategories()
          this.closeNav()
        }
      }, error => {
        console.log(error)
      }
    )
  }
  closeNav() {
    this.storeService.sideNav.close()
  }

  order() {
    this.r.navigateByUrl('order')
  }
}
