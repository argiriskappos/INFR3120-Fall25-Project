
import { Routes } from '@angular/router';

// Import all your standalone components
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TrucksComponent } from './trucks/trucks.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

//Define and export the routes array
export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'trucks', component: TrucksComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit-trip/:id', component: EditComponent }, 

  // Wildcard route for 404/Not Found
  { path: '**', redirectTo: '' }
];