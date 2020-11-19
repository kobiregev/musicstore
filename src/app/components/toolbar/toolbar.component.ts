import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private routerService: Router,public userService:UserService) { }

  ngOnInit(): void {
  }

  goToMainPage() {
    this.routerService.navigateByUrl('')
  }

}
