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

  username: string = config.user_name;
  beerHistoryChart: any;
  barChart: any;
  userData: any;


  constructor(public http: HttpProvider) {
    this.username = config.user_name;
    this.getUserData()
      .then((response) => {
        this.fillData()
      });
  }


  private getUserData() {
    return new Promise((resolve) => {
      // TODO remove for prod
      var url = 'http://kegbot-basel-460041187.eu-west-1.elb.amazonaws.com/api/v1/web/guest/default/get-drinks.http';
      // var url = './assets/data/data.json';
      this.http.get(url)
        .then((response) => {
          console.log(response);
          this.userData = response['objects'];
          resolve(response['objects']);
        });

    });
  }

  fillData() {
    var date = this.formatDate(this.userData[0].time);
    var fdate = date;
    var beerHistoryData = {}, labels = [];
    var nameOne = '', nameTwo = '', drinkOneCount = 0, drinkTwoCount = 0;
    for (let i = 0; i < this.userData.length; i++) {
      let d = this.formatDate(this.userData[i].time);
      if (d < date) {
        date = d;
        labels.push(date);
        if (nameOne) {
          beerHistoryData[nameOne][date] = 0;
        }
        if (nameTwo) {
          beerHistoryData[nameTwo][date] = 0;
        }
      }

      if (nameOne === '') {
        nameOne = this.userData[i].keg.beverage.name;
        beerHistoryData[nameOne] = {};
        beerHistoryData[nameOne][date] = 0;
      }

      if (nameOne !== this.userData[i].keg.beverage.name && !nameTwo) {
        nameTwo = this.userData[i].keg.beverage.name;
        beerHistoryData[nameTwo] = {};
        beerHistoryData[nameTwo][fdate] = 0;
        beerHistoryData[nameTwo][date] = 0;
      }


      if (this.userData[i].keg.beverage.name === nameOne) {
        beerHistoryData[nameOne][date] = beerHistoryData[nameOne][date] + parseInt(this.userData[i].volume_ml);
        drinkOneCount++;
      } else {
        beerHistoryData[nameTwo][date] = beerHistoryData[nameTwo][date] + parseInt(this.userData[i].volume_ml);
        drinkTwoCount++
      }
    }

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: [nameOne, nameTwo],
        datasets: [{
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
    var beerHistoryDataFormattedOne = Object.keys(beerHistoryData[nameOne]).map(x => beerHistoryData[nameOne][x]).reverse();
    var beerHistoryDataFormattedTwo = Object.keys(beerHistoryData[nameTwo]).map(x => beerHistoryData[nameTwo][x]).reverse();
    labels.reverse();
    var maxOne = Math.max.apply(null, beerHistoryDataFormattedOne);
    var maxTwo = Math.max.apply(null, beerHistoryDataFormattedTwo);
    var max = 0;
    if (maxOne > maxTwo) {
      max = maxOne;
    } else {
      max = maxTwo;
    }
    this.beerHistoryChart = new Chart(this.beerHistory.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: beerHistoryDataFormattedOne,
            label: nameOne,
            borderColor: "#3e95cd",
            fill: false
          },
          {
            data: beerHistoryDataFormattedTwo,
            label: nameTwo,
            borderColor: "#FF6384",
            fill: false
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              max: max,
              min: 0
            }
          }]
        },
        title: {
          display: true,
          text: 'Daily beer consumption'
        }
      }
    });

  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
  }
}
