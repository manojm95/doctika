import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { SigninComponent } from './auth/signin/signin.component';
import { Routes, RouterModule } from "@angular/router";
import { AuthService } from './auth/auth.service';
import { UploadComponent } from './upload/upload.component';
import { HeaderComponent } from './comps/header/header.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ElasticsearchService } from './elasticsearch.service';
import { SearchComponent } from './search/search.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';



const routes : Routes  = [
  {path: '', redirectTo: '/auth', pathMatch:'full'},
  {path: 'auth', component: AuthComponent, children:[
    {path: 'signin', component: SigninComponent},
  ]},
  {path: 'upload', component: UploadComponent},
  {path: 'search', component: SearchComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SigninComponent,
    UploadComponent,
    HeaderComponent,
    SearchComponent,
    EmployeeDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MDBBootstrapModule.forRoot(),
  ],
  providers: [AuthService, ElasticsearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
