// // import { AbstractControl } from '@angular/forms';
// // import { UserService } from '../service/user.service';

// import { Injectable } from '@angular/core';
// import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { UserService } from '../service/user.service';
// import { of } from 'rxjs';

// map

// // export class ValidateEmailNotTaken {
// //     static createValidator(userService: UserService) {
// //         return (control: AbstractControl) => {
// //             return of(userService.validateEmail(control.value).subscribe(
// //                 (res: any) => {
// //                     if (res.error) {
// //                         console.log('here in true')
// //                         return { emailTaken: true }
// //                     } else {
// //                         console.log('here in null')
// //                         return null
// //                     }
// //                 }, error => {
// //                 }
// //             ))
// //         }
// //     }
// // }
// @Injectable({ providedIn: 'root' })
// export class UniqueAlterEgoValidator implements AsyncValidator {
//     constructor(private userService: UserService) { }

//     validate(
//         ctrl: AbstractControl
//     ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
//         return this.userService.validateEmail(ctrl.value).pipe(
//             map(isTaken => (isTaken ? { uniqueAlterEgo: true } : null)),
//             catchError(() => of(null))
//         );
//     }
// }