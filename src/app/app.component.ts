import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReceiveModel } from './models/ReceiveModel';
import { HubService } from './hub.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public chartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  public chartLabels: string[] = ['luan demo: Real time data for the chart'];
  public chartType: string = 'bar';
  public chartLegend: boolean = true;
  public colors: any[] = [{ backgroundColor: '#5491DA' }, { backgroundColor: '#E74C3C' }, { backgroundColor: '#82E0AA' }, { backgroundColor: '#E5E7E9' }]

  public data: ReceiveModel[];

  constructor(
    private cdr: ChangeDetectorRef,
    private hubService: HubService,
    private http: HttpClient
  ) {
    this.addTransferChartDataListener();
    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http.get('https://signalr.conektelecom.com/api/chart/start')
      .subscribe(res => {
        console.log(res);
      })
  }

  public addTransferChartDataListener = () => {
    this.hubService.listenEvent('transferchartdata').subscribe(data => {
      if (data) {
        this.data = <ReceiveModel[]>data;
        console.log(data);
      }
    });
  }

  public chartClicked = (event) => {
    console.log(event);
  }
}
