import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user
  //{fname,id,role}
  cart
  cartStatus
  //{cartStatus,msg}
  baseUrl = 'http://localhost:1000/'

  constructor(private http: HttpClient, private r: Router) { }

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

  verifyToken(token) {
    return this.http.get(this.baseUrl + 'users/validateToken', {
      headers: { 'Authorization': token }
    })
  }

  setUser(token, cart) {
    this.user = jwt_decode(token)
    const tokenDate = this.user.exp * 1000
    const currentTime = new Date().getTime()
    const ms = tokenDate - currentTime
    this.cartStatus = cart
    localStorage.token = token
    setTimeout(() => {
      this.logOut()
    }, ms)
  }
}
