import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.component.html',
  styleUrls: ['./store-info.component.css']
})
export class StoreInfoComponent implements OnInit {
  constructor(public storeService: StoreService, public userService: UserService) { }


  ngOnInit(): void {
    this.getStoreInfo()
  }

  getStoreInfo() {
    this.storeService.getStoreInfo().subscribe(
      (res: any) => {
        !res.error ? this.storeService.storeInfo = res : null
      }, (error) => {
        console.log(error)
      }
    )
  }
}
