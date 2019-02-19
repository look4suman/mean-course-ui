import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../service/auth.service";
import { AuthData } from "../model/auth-data.model";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  isLoading = false;
  authData: AuthData;

  constructor(public authService: AuthService) {}

  ngOnInit() {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authData = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.createUser(this.authData);
  }
}
