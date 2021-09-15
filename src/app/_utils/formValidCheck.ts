import { FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

export function isFormInvalid(form: FormGroup, cdr?: ChangeDetectorRef): boolean {
  if (form.invalid) {
    Object.keys(form.controls).forEach((control) => {
      if (form.get(control)?.invalid) {
        form.get(control)?.markAsTouched();
        if (cdr) cdr.detectChanges();
      }
    });
    return true;
  }
  return false;
}
