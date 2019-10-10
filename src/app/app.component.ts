import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "./auth/auth.service";
import axios from "axios";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "tikapoc";
  isAuthenticated: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const query = {};
    //await axios.get('https://search-tika-es-bn3u2vyptgvxdnjzw2ieewnllq.us-west-1.es.amazonaws.com/_search',  {
    //  data: JSON.stringify(query),
    //}).then((res) => {
    //  console.log('Val is MMMMM--->',res);
    //});

    if (!this.isAuthenticated)
      this.router.navigate(["/auth/signin"], {
        relativeTo: this.activatedRoute
      });
    else {
      this.router.navigate(["/upload"], { relativeTo: this.activatedRoute });
    }
  }

  onSignIn() {
    this.router.navigate(["signin"], { relativeTo: this.activatedRoute });
  }

  onActivate(event: Event) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }
}
