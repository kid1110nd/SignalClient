import { Injectable, NgZone } from '@angular/core';
import * as SignalR from '@aspnet/signalr';
import { Observable, fromEventPattern } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HubService {
  public hubConnection: SignalR.HubConnection;

  constructor(private ngZone: NgZone) {
    this.startConnection();
  }

  public startConnection() {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl('https://signalr.conektelecom.com/chart')
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);
      });
  }

  public listenEvent(event: string) {
    return new Observable(observer => {
      const handler = (data) => {
        this.ngZone.run(() => {
          observer.next(data);
        });
      };
      this.hubConnection.on(event, handler);
      return () => {
        this.hubConnection.off(event, handler);
      };
    });
  }
}
