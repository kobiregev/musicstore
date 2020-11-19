import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user
  //{fname,id,role}
  cart
  cartStatus
  //{cartStatus,msg}
  baseUrl = 'http://localhost:1000/users'
  constructor(private http: HttpClient) { }

  login(loginDetials) {
    return this.http.post(this.baseUrl + '/login', loginDetials)
  }
  register(registerDetials) {
    return this.http.post(this.baseUrl + '/register', registerDetials)
  }
  setUser(token, cart) {
    this.user = jwt_decode(token)
    this.cartStatus = cart
    localStorage.token = token
  }
}
