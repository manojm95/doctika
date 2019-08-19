import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() headerMsg: string;
  @Input() headerContent: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  isAuthenticated(): boolean{
    return true;
  }

  onLogout(){
    this.router.navigate(["/auth/signin"]);
  }

  onSaveData(){

  }

  onFetchData(){
    
  }

}
