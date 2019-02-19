import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthData } from "../model/auth-data.model";
import { AuthService } from "../service/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  isLoading = false;
  authData: AuthData;

  constructor(public authService: AuthService) {}

  ngOnInit() {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authData = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.login(this.authData);
  }
}
