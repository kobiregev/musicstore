import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.component.html',
  styleUrls: ['./store-info.component.css']
})
export class StoreInfoComponent implements OnInit {
  constructor(private storeService: StoreService, public userService: UserService) { }
  info

  ngOnInit(): void {
    this.getStoreInfo()
  }
  getStoreInfo() {
    this.storeService.storeInfo().subscribe(
      (res: any) => {
        console.log(res)
        !res.error ? this.info = res : null
      }, (error) => {
        console.log(error)
      }
    )
  }
}
