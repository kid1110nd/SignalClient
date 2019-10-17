import { Component, OnInit } from '@angular/core';
import * as SignalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { ReceiveModel } from './models/ReceiveModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public title = 'SignalClient';
  public data: ReceiveModel[];
  public bradcastedData: ReceiveModel[];
  private hubConnection: SignalR.HubConnection

  public viewLabel: string = '';
  public viewValue: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.startConnection();
    this.addTransferChartDataListener();
    this.addBroadcastChartDataListener();
    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http.get('https://signalr.conektelecom.com/api/chart')
      .subscribe(res => {
        console.log(res);
      })
  }

  public startConnection = () => {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl('https://signalr.conektelecom.com/chart')
      .build();

    this.hubConnection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      if (data) {
        this.data = <ReceiveModel[]>data;
        if (this.data.length > 0) {
          this.viewLabel = this.data[0].label;
          let obj: any = <any>this.data[0].data;
          this.viewValue = obj[0];
          console.log('Label: ' + this.viewLabel + '     Value: ' + this.viewValue);
        }
      }
    });
  }

  public broadcastChartData = () => {
    this.hubConnection.invoke('broadcastchartdata', this.data)
      .catch(err => console.error(err));
  }

  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      this.bradcastedData = data;
    })
  }
}
