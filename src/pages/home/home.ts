import {Component, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';
import {HttpProvider} from "../../providers/http/http";
import {config} from "../../app/app.module";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('beerHistory') beerHistory;
  @ViewChild('barCanvas') barCanvas;


  beerHistoryChart: any;
  barChart: any;
  userData: any;


  constructor(public http: HttpProvider) {
    this.getUserData()
      .then((response) => {
        this.fillData()
      });
  }


  private getUserData() {
    return new Promise((resolve) => {
      // TODO remove for prod
      // var url = config.user_url_base + config.user_name + config.user_url_ending;
      var url = './assets/data/data.json';
      this.http.get(url)
        .then((response) => {
          console.log(response);
          this.userData = response.objects;
          resolve(response.objects);
        });

    });
  }

  fillData() {
    var date = this.userData[0].time;
    var beerHistoryData = {};
    var nameOne = '', nameTwo = '', drinkOneCount = 0, drinkTwoCount = 0;
    for (let i = 0; i < this.userData.length; i++) {
      if (nameOne === '') {
        nameOne = this.userData[i].keg.beverage.name;
      }
      if (nameOne !== this.userData[i].keg.beverage.name) {
        nameTwo = this.userData[i].keg.beverage.name;
      }

      if (this.userData[i].keg.beverage.name === nameOne) {
        drinkOneCount++;
      } else {
        drinkTwoCount++
      }
      if (this.userData[i].time < date){
        date = this.userData[i].time;

      }
      beerHistoryData[date] += this.userData[i].volume_ml;
    }

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: [nameOne, nameTwo],
        datasets: [{
          label: '# of Drinks',
          data: [drinkOneCount, drinkTwoCount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              mirror: true
            },
            stacked: true
          }],
          xAxes: [{
            stacked: true
          }]
        }
      }

    });
    this.beerHistoryChart = new Chart(this.beerHistory.nativeElement, {
      type: 'line',
        data: {
        labels: [nameOne, nameTwo],
          datasets: [{
          data: beerHistoryData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              mirror: true
            },
            stacked: true
          }],
            xAxes: [{
            stacked: true
          }]
        }
      }

    });

  }
}
