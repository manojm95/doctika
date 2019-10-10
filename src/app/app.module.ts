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
import { UploadFileComponent } from './upload-file/upload-file.component';
import { DragDropDirective } from './drag-drop.directive';
import { OcrSearchComponent } from './ocr-search/ocr-search.component';
import { QbuildComponent } from './qbuild/qbuild.component';


const routes : Routes  = [
  {path: 'auth', component: AuthComponent, children:[
    {path: 'signin', component: SigninComponent},
  ]},
  // {path: 'upload', component: UploadComponent},
  {path: 'upload', component: QbuildComponent},
  {path: 'search', component: SearchComponent},
  {path: 'uploadfiles', component: UploadFileComponent},
  {path: 'searchOcr', component: OcrSearchComponent},
  {path: 'download', component: QbuildComponent},

]

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SigninComponent,
    UploadComponent,
    HeaderComponent,
    SearchComponent,
    EmployeeDetailComponent,
    UploadFileComponent,
    DragDropDirective,
    OcrSearchComponent,
    QbuildComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MDBBootstrapModule.forRoot()
  ],
  providers: [AuthService, ElasticsearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
