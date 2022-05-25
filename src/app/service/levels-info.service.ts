import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelsInfoService {
  private dataSource: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public data: Observable<number> = this.dataSource.asObservable();
 
  private dataSourceTime : BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public time : Observable<number> = this.dataSourceTime.asObservable();

  private dataSourceGameMode : BehaviorSubject<string> = new BehaviorSubject<string>('');
  public gamemode : Observable<string> = this.dataSourceGameMode.asObservable();

  constructor() { }
 
  sendData(data: number) {
    this.dataSource.next(data);
  }

  sendDataTime( data : number ){
    this.dataSourceTime.next( data );
  }

  sendDataGameMode( data : string ){
    this.dataSourceGameMode.next( data );
  }
}
