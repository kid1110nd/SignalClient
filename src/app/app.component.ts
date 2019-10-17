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
  public title = 'SignalClient';
  public data: ReceiveModel[];

  public viewLabel: string = '';
  public viewValue: string = '';

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
        if (this.data.length > 0) {
          this.viewLabel = this.data[0].label;
          let obj: any = <any>this.data[0].data;
          this.viewValue = obj[0];
          console.log('Label: ' + this.viewLabel + '     Value: ' + this.viewValue);
        }
      }
    });
  }
}
