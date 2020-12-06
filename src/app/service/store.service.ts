import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas';


@Injectable({
  providedIn: 'root'
})
export class StoreService {
  baseUrl = 'http://localhost:1000'
  sideNav;
  categories
  currentForm;
  currentPath;
  pdfInfo
  keywords = '';
  constructor(private http: HttpClient, private userService: UserService) { }

  storeInfo() {
    return this.http.get(this.baseUrl + '/storeinfo')
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
    this.currentForm.setValue({
      _id: product._id,
      name: product.name,
      category: product.category._id,
      price: product.price,
      imgUrl: product.imgUrl,
    })
  }
  setCartForPdf(pdfInfo) {
    this.pdfInfo = pdfInfo
  }
  saveProduct(product) {
    return this.http.put(this.baseUrl + '/products/editproduct', { ...product }, { headers: { 'Authorization': localStorage.token } })
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
    let DATA = this.pdfInfo.nativeElement
    html2canvas(DATA, { allowTaint: true, useCORS: true }).then((canvas) => {
      let imgData = canvas.toDataURL('image/jpeg')
      let pdf = new jsPDF('portrait', 'px', 'a4')
      let width = pdf.internal.pageSize.getWidth();
      let height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height)
      pdf.save("download.pdf");
    })
  }

}
