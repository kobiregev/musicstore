import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StoreService } from 'src/app/service/store.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  @ViewChild('drawer') drawer
  @ViewChild('categories') categories
  category;

  constructor(public userService: UserService, public storeService: StoreService) { }

  ngOnInit(): void {
    this.getProducts()
  }

  ngAfterViewInit(): void {
    this.storeService.setSideNav(this.drawer);
    this.storeService.setCategories(this.categories);
  }
  ngOnDestroy(): void {
    this.storeService.setSideNav(null)
    this.storeService.setCategories(null);
  }
  getProducts() {
    let category = !this.category || this.category === 'All' ? "" : this.category
    this.userService.getProducts(category).subscribe(
      (res: any) => {
        console.log(res)
        !res.error ? this.userService.products = res : null
      }, error => {
        console.log(error)
      }
    )
  }
  onValChange(e) {
    this.userService.products = []
    this.category = e.value
    this.getProducts()
  }
  
}
