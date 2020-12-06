import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
  }
 
  downloadPdf() {
    this.storeService.downloadPdf()
  }
}
