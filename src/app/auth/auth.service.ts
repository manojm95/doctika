import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable()
export class AuthService {

constructor(private router: Router){}

//isauthenticate = new Subject<boolean>();
isSisgnedIn: boolean = true;
isAuthenticated: boolean = false;

}