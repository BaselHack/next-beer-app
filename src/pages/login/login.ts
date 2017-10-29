import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {HttpProvider} from "../../providers/http/http";
import {config} from "../../app/app.module";
import {HomePage} from "../home/home";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  error: boolean = false;

  constructor(private http: HttpProvider, private nav: NavController) {
  }

  getUser() {
    this.error = false;
    let url = 'http://kegbot-basel-460041187.eu-west-1.elb.amazonaws.com/api/v1/web/guest/default/get-user-data.http';
    this.http.get(url)
      .then((response) => {
          if (response.meta.result === 'error') {
            this.error = true;
          } else {
            config.user_name = this.username;
            this.nav.push(HomePage);
          }
        },
        (xhr) => {
          this.error = true;
        });
  }
}
