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
  
  userName: string;
  logout: string = "(logout)";

  constructor(private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    this.userName = "hi guest!" 
  }

  isAuthenticated(): boolean{
    return true;
  }

  onLogout(){
  }

  onSaveData(){

  }

  onFetchData(){
    
  }

}
