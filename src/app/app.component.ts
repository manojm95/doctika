import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tikapoc';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) { }


  ngOnInit() {
    
    this.router.navigate(["auth/signin"],{ relativeTo: this.activatedRoute });
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
