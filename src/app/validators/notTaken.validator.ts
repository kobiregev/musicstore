import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import isIsraeliIdValid from 'israeli-id-validator';


@Injectable({
    providedIn: 'root'
})
export class RegisterValidators {
    constructor(private http: HttpClient) { }
    url = 'http://localhost:1000/users/validateEmail'
    searchEmail(email) {
        return timer(1000)
            .pipe(
                switchMap(() => {
                    return this.http.post(this.url, { email })
                })
            );
    }
    emailValidator(): AsyncValidatorFn {
        return (control: AbstractControl) => {
            return this.searchEmail(control.value)
                .pipe(
                    map((res: any) => {
                        return res.error ? { 'emailExists': true } : null
                    })
                );
        };
    }
    confirmPasswordValidator() {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls.password;
            const matchingControl = formGroup.controls.confirmPassword;
            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }
    israelIdValidator(id) {
        return isIsraeliIdValid(id.value) ? null : { idInvalid: true }
    }
}
