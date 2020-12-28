import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'



@Injectable({
  providedIn: 'root'
})
export class StoreService {
  baseUrl = 'http://localhost:1000'
  sideNav;
  categories
  currentForm;
  currentPath;
  storeInfo;
  keywords = '';
  newProductMode = false;
  constructor(private http: HttpClient, private userService: UserService) { }

  getStoreInfo() {
    return this.http.get(this.baseUrl + '/storeinfo')
  }
  checkOrderDates() {
    return this.http.get(this.baseUrl + '/orders', { headers: { 'Authorization': localStorage.token } })
  }
  setSideNav(nav) {
    this.sideNav = nav
  }
  setCategories(categories) {
    this.categories = categories
  }
  setPath(path) {
    this.currentPath = path
  }
  setForm(product) {
    this.currentForm.patchValue({
      _id: product._id,
      name: product.name,
      category: product.category._id,
      price: product.price,
    })
  }

  saveProduct(product) {
    return this.http.post(this.baseUrl + '/products/editproduct', product, { headers: { 'Authorization': localStorage.token } })
  }
  addProduct(product) {
    return this.http.post(this.baseUrl + '/products/addproduct', product, { headers: { 'Authorization': localStorage.token } })
  }
  unselectCategories() {
    this.categories._buttonToggles.map(btn => btn.checked = false)
  }
  clearSerchValue() {
    this.keywords = ''
  }
  Mark(product) {
    let filtered = this.keywords ? this.userService.cart.products.filter(p => p.productId.name.match(this.keywords)) : []
    if (this.currentPath !== 'order') {
      return product.productId.name
    }
    return filtered.some(sr => sr.productId._id === product.productId._id) ? `<mark>${product.productId.name}</mark>` : product.productId.name
  }
  downloadPdf() {
    const doc = new jsPDF()
    const cart = this.userService.cart.products
    let rows = []
    for (let i = 0; i < cart.length; i++) {
      rows.push([cart[i].productId.name, cart[i].quantity, cart[i].productId.price])
    }
    autoTable(doc, {
      head: [['name', 'quantity', 'price']],
      body: [...rows],
      foot: [['Total Price', this.userService.cart.price]]
    })
    doc.save('table.pdf')
  }

}
