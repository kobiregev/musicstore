import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  baseUrl = 'http://localhost:1000'

  constructor(private http: HttpClient) { }
  
  storeInfo() {
    return this.http.get(this.baseUrl + '/storeinfo')
  }
}
