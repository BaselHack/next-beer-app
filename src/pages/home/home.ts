import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HttpProvider} from "../../providers/http/http";
import {config} from "../../app/app.module";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public userData: any;

  constructor(public http: HttpProvider) {
    this.getUserData()
      .then((response) => {

      });
  }


  private getUserData() {
    return new Promise((resolve) => {
      this.http.get(config.user_url).then((response) => {
        this.userData = response;
        resolve(response);
      });
    });
  }

  private processData(){

  }
}
