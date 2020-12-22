import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  value = ''
  reciptSearchValue = ''
  path;
  constructor(private routerService: Router, private _snackBar: MatSnackBar, public userService: UserService, public storeService: StoreService) { }

  ngOnInit(): void {
  }

  goToMainPage() {
    this.routerService.navigateByUrl('')
  }
  searchProduct() {
    this.userService.searchProducts(this.value).subscribe(
      (res: any) => {
        if (!res.error) {
          this.userService.products = res
          this.clearValue()
          this.storeService.unselectCategories()
        }
      }, error => {
        this.openSnackBar(error.error.msg)
        console.log(error)
      }
    )
  }
  clearValue() {
    this.value = ''
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right'
    });
  }
  logout() {
    this.userService.logOut()
  }
}
