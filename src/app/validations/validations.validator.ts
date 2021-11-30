import { FormControl, FormGroup } from '@angular/forms';

// Allow alphanumeric(char + number) char and space only
export class TextFieldValidator {
    static validTextField(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {

            const regex = /^[0-9a-zA-Z ]+$/;
            if (regex.test(fc.value)) {

                return null;

            }
            else {

                return { validTextField: true }; // yha kuch bhi name de sakte hai. but maine method ka name e de diya.
            }

        }

        else {

            return null;
        }
    }
}

// Allow numeric chars
export class NumericFieldValidator {
    static validNumericField(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {

            const regex = /[0-9]+/;
            if (regex.test(fc.value)) {

                return null;

            }
            else {

                return { validNumericField: true }; // yha kuch bhi name de sakte hai. but maine method ka name e de diya.
            }

        }

        else {

            return null;
        }
    }
}

// Allow char  and space only
export class CharFieldValidator {
    static validCharField(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {

            const regex = /^[a-zA-Z ]+$/;
            if (regex.test(fc.value)) {

                return null;

            }
            else {

                return { validCharField: true }; // yha kuch bhi name de sakte hai. but maine method ka name e de diya.
            }

        }

        else {

            return null;
        }
    }
}


// Allow Email only
export class EmailValidator {
    static validEmail(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {

            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
            if (regex.test(fc.value)) {

                return null;

            }
            else {

                return { validEmail: true }; // yha kuch bhi name de sakte hai. but maine method ka name e de diya.
            }

        }

        else {

            return null;
        }
    }
}


//Validations : Not Allow Whitespace only
export class NoWhiteSpaceValidator {
    static noWhiteSpaceValidator(fc: FormControl) {
        if (fc.value != undefined && fc.value != "" && fc.value != null) {
            const isWhiteSpace = (fc.value.toString().trim().length === 0); // triple equal to sevalue ke saath type bhi check kr sakte
            if (!isWhiteSpace) {
                return null;
            } else {
                return { noWhiteSpaceValidator: true };
            }
        } else {
            return null;
        }
    }
}


//Validations : To check 2 fields match
export function MustMatchValidator(controlName: string, matchingControlName: string) {
    return (fromGroup: FormGroup) => {
        const control = fromGroup.controls[controlName]; // P
        const matchingControl = fromGroup.controls[matchingControlName]; // CP

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value != matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true }); // mustMatch ki jagha kuch bhi name de sakte hai.
        } else {
            matchingControl.setErrors(null);
        }
    }
}
