import { Component, OnInit, ViewChild } from '@angular/core';
import { Score } from '../Interfaces/score';
import { GameBoxComponent } from '../game-box/game-box.component';
import { LevelsInfoService } from '../service/levels-info.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild(GameBoxComponent) game: any;

  public level : number = 1;
  public counter : number = 0;
  public time  = { min : '00', seconds : '00' }
  public gamemode : string = 'arcade';
  public gamemodeList : string[] = ['arcade', 'custom'];
  public selected = 'arcade';

  constructor( private levelsInfoService : LevelsInfoService) { }

  ngOnInit(): void {
    this.getLevel();
    this.doCountup();
    this.getTimeReset();
  }

  changeGameMode(){
    this.levelsInfoService.sendDataGameMode(this.gamemode);
  }
  getLevel():void{
    this.levelsInfoService.data.subscribe( r => {
      this.level = r;
    })
  }
  getTimeReset():void{
    this.levelsInfoService.time.subscribe( r => {
      this.counter = r;
    })
  }

  doCountup(){
    setInterval( () =>{
      this.counter = this.counter +1;
      this.time.min = this.processTime(Math.floor( this.counter / 60 ) );
      this.time.seconds =  this.processTime(this.counter % 60);
    }, 1000);
  }

  processTime( time : number ):string{
    if( time < 10 )
      return '0'+time;
    else
      return time+'';
  }
}
