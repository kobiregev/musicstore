import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user;
  cart;
  cartTableDataSource = new MatTableDataSource<any>();
  paginator;
  cartStatus;
  products;
  baseUrl = 'http://localhost:1000/';

  constructor(private http: HttpClient, private r: Router,) { }

  login(loginDetials) {
    return this.http.post(this.baseUrl + 'users/login', loginDetials)
  }

  logOut() {
    this.user = this.cart = this.cartStatus = ''
    localStorage.removeItem('token')
    alert('logging out token expired')
    this.r.navigateByUrl('')
  }
  register(registerDetials) {
    return this.http.post(this.baseUrl + 'users/register', registerDetials)
  }
  createCart() {
    return this.http.post(this.baseUrl + 'cart/createcart', {}, { headers: { 'Authorization': localStorage.token } })
  }
  addToCart(productId: string, quantity: number) {
    return this.http.post(this.baseUrl + 'cart/add', { productId, quantity }, { headers: { 'Authorization': localStorage.token } })
  }
  removeFromCart(productId: string, clearCart: boolean) {
    return this.http.post(this.baseUrl + 'cart/remove', { productId,clearCart }, { headers: { 'Authorization': localStorage.token } })
  }
  order(orderDetails) {
    return this.http.post(this.baseUrl + 'orders', orderDetails, { headers: { 'Authorization': localStorage.token } })
  }
  verifyToken(token) {
    return this.http.get(this.baseUrl + 'users/validateToken', {
      headers: { 'Authorization': token }
    })
  }
  getCart() {
    return this.http.get(this.baseUrl + 'cart', { headers: { 'Authorization': localStorage.token } })
  }
  setDataSource(data) {
    this.cartTableDataSource = new MatTableDataSource<any>(data);
    this.cartTableDataSource.paginator = this.paginator;
  }
  setPaginator(paginator) {
    this.paginator = paginator;
  }

  getProducts(category) {
    return this.http.get(this.baseUrl + 'products/?category=' + category, { headers: { 'Authorization': localStorage.token } })
  }
  searchProducts(keywords) {
    return this.http.post(this.baseUrl + 'products/search', { keywords }, { headers: { 'Authorization': localStorage.token } })
  }
  searchInRecipt(keywords) {
    console.log(this.cart.products)
  }

  setUser(token, cart) {
    let toNavigate;
    this.user = jwt_decode(token)
    const tokenDate = this.user.exp * 1000
    const currentTime = new Date().getTime()
    const ms = tokenDate - currentTime
    this.cartStatus = cart
    localStorage.token = token
    setTimeout(() => {
      this.logOut()
    }, ms)
    this.user.role === 'admin' ? toNavigate = '/shop' : toNavigate = ''
    this.r.navigateByUrl(toNavigate)  // not sure about this do further checks
  }
}
