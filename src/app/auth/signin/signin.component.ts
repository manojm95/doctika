import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ElasticsearchService } from 'src/app/elasticsearch.service';
const rp = (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
  status: string;
  isConnected: boolean;


  constructor(private es: ElasticsearchService) { }

  ngOnInit() {
    this.signinForm = new FormGroup({
      "agency": new FormControl(null,[Validators.required]),
      "email": new FormControl(null,[Validators.required,Validators.email]),
      "password": new FormControl(null,[Validators.required,this.passwordRegex.bind(this)])
  })

  this.es.isAvailable().then(() => {
    this.status = 'OK';
    this.isConnected = true;
  }, error => {
    this.status = 'ERROR';
    this.isConnected = false;
    console.error('Server is down', error);
  }).then(() => {
    console.log('Error');
  });

  }

  passwordRegex(control: FormControl):{[s:string]:boolean}{
    if(rp.test(control.value)){
      return null;
    } else {
      return { passwordnotCompliant: true }
    }
}

onSubmit(){
  let { email, password } = this.signinForm.value;
  console.log( email +"<<>>"+ password );
  if(this.signinForm.valid){
      //this.authService.signin(email,password);
  }
}

}
