import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  displayedColumns: string[] = ['name', 'quantity', 'price', 'image']
  constructor(public userService: UserService, public storeService: StoreService) { }
  @ViewChild('drawer') drawer
  ngOnInit(): void {
    this.getCart()
  }
  ngAfterViewInit(): void {
    this.storeService.setSideNav(this.drawer);
  }
  ngOnDestroy(): void {
    this.storeService.setSideNav(null)
  }
  getCart() {
    this.userService.getCart().subscribe(
      (res: any) => {
        !res.error ? this.userService.cart = res : null
      }, error => {
        console.log(error)
      }
    )
  }

}
