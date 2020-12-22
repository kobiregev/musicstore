import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import { UserService } from 'src/app/service/user.service';
import { requiredFileType } from 'src/app/validators/requiredFileType.validator';

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
  addProductForm;
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
    private _snackBar: MatSnackBar,
    public userService: UserService, public storeService: StoreService,
    public fb: FormBuilder, public r: Router, public ar: ActivatedRoute,) { }

  ngOnInit(): void {
    this.storeService.setPath(this.ar.snapshot.routeConfig.path)
    this.getCart()
    this.productForm = this.fb.group({
      _id: [{ value: '', disabled: true }, Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', requiredFileType('jpg')]
    })
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', [Validators.required, requiredFileType('jpg')]]
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

  removeFromCart(productId: string, clearCart: boolean) {
    this.userService.removeFromCart(productId, clearCart).subscribe(
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
    this.storeService.saveProduct(this.toFormData(this.productForm.value)).subscribe(
      (res: any) => {
        if (!res.error) {
          this.userService.products = res
          this.storeService.unselectCategories()
          this.openSnackBar('Saved Successfully')
          this.closeNav()
        }
      }, error => {
        console.log(error)
      }
    )
  }
  addProducts() {
    this.storeService.addProduct(this.toFormData(this.addProductForm.value)).subscribe(
      (res: any) => {
        if (!res.error) {
          this.userService.products = res
          this.storeService.unselectCategories()
          this.openSnackBar('Added Successfully')
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

  toFormData<T>(formValue) {
    const formData = new FormData();
    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }
    return formData;
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'close', {
      duration: 3000,
    });
  }
  test() {
    console.log(this.addProductForm)
  }
  backToShop() {
    this.r.navigateByUrl('/shop')
  }
}
