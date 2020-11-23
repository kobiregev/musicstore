import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  constructor(private userService: UserService, private r: Router) { }
  ngOnInit() {
    if (!this.userService.user && !localStorage.token) {
      this.r.navigateByUrl('')
    } else if (localStorage.token && !this.userService.user) {
      this.userService.verifyToken(localStorage.token).subscribe(
        (res: any) => {
          this.userService.setUser(localStorage.token, res.cart)
        }, error => {
          // console.log(error)
        }
      )
    }
  }

}
