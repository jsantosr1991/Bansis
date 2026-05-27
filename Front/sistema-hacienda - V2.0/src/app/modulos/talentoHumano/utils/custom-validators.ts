import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    /**
     * Validador que no permite campos con solo espacios en blanco.
     */
    static noWhitespace(control: AbstractControl): ValidationErrors | null {
        if (control.value === null || control.value === undefined || control.value === '') return null;
        const isWhitespace = (control.value || '').toString().trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    /**
     * Validador para confirmar que dos campos coinciden (ej: número de cuenta).
     */
    static mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const control = group.get(controlName);
            const matchingControl = group.get(matchingControlName);

            if (!control || !matchingControl) return null;

            // Retornar si otro validador ya encontró un error en matchingControl
            if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
                return null;
            }

            // Marcar error si no coinciden
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
                return { mustMatch: true };
            } else {
                matchingControl.setErrors(null);
                return null;
            }
        };
    }

    /**
     * Validador para asegurar esquema de vacunación mínimo (2 dosis).
     */
    static covidVaccineValidator(group: AbstractControl): ValidationErrors | null {
        const v0 = group.get('vacunaCovid0')?.value;
        const v1 = group.get('vacunaCovid1')?.value;
        const v2 = group.get('vacunaCovid2')?.value;
        const count = (v1 ? 1 : 0) + (v2 ? 1 : 0) + (v0 ? 0 : 0);
        return count >= 0 ? null : { minVaccinesRequired: true };
    }

    /**
     * Validador para longitud mínima de FormArray.
     */
    static minArrayLength(min: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control instanceof FormArray) {
                return control.length >= min ? null : { minLength: { required: min, actual: control.length } };
            }
            return null;
        };
    }
}
