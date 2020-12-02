import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  baseUrl = 'http://localhost:1000'
  sideNav;
  categories
  currentForm;
  constructor(private http: HttpClient) { }

  storeInfo() {
    return this.http.get(this.baseUrl + '/storeinfo')
  }
  setSideNav(nav) {
    this.sideNav = nav
  }
  setCategories(categories) {
    this.categories = categories
  }

  setForm(product) {
    this.currentForm.setValue({
      _id: product._id,
      name: product.name,
      category: product.category._id,
      price: product.price,
      imgUrl: product.imgUrl,
    })
  }
  saveProduct(product) {
    return this.http.put(this.baseUrl + '/products/editproduct', { ...product }, { headers: { 'Authorization': localStorage.token } })
  }
  unselectCategories(){
    this.categories._buttonToggles.map(btn => btn.checked = false)

  }
}
