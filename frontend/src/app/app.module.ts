import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// HttpClientModule removed to address deprecation warning. 
// You must now add provideHttpClient() to your main.ts/app.config.ts file.
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

// Core Angular Modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Component Imports
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TrucksComponent } from './trucks/trucks.component'; 
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    // Declare All Components
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    TrucksComponent,
    CreateComponent,
    EditComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // HttpClientModule REMOVED
    FormsModule, 
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }