import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Event } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
      if(this.authService.isSisgnedIn){
        //this.router.navigate(["/landing"]);

      } else {
        this.authService.isAuthenticated;
      }
    }

  onSignIn(){
    this.router.navigate(["signin"],{ relativeTo: this.activatedRoute });
  }

  onActivate(event: Event) {
    window.scroll(0,0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)

}

}
