import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  // Ha standalone komponens, add meg a szükséges importokat (ha nem standalone, akkor a modulban kell importálni ReactiveFormsModule)
  // imports: [ReactiveFormsModule, RouterModule, CommonModule]
})
export class Login {
  f: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.f = this.fb.group({
      felhasznalo: ['', Validators.required],
      jelszo: ['', Validators.required]
    });
  }

  // Figyelj: event.preventDefault() leállítja a böngésző alapértelmezett GET navigációját (ha akármilyen action/href jelen lenne)
  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Login onSubmit hívva, form érték:', this.f.value);

    if (this.f.invalid) {
      console.warn('Form invalid');
      return;
    }

    const { felhasznalo, jelszo } = this.f.value;
    this.auth.login(felhasznalo, jelszo).subscribe({
      next: () => {
        console.log('Login sikeres, token elmentve');
        this.router.navigateByUrl('/');
      },
      error: err => {
        console.error('Login hiba', err);
        alert('Bejelentkezés sikertelen');
      }
    });
  }
}
