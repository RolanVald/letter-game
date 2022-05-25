import { Component, Input, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Letters } from '../Interfaces/letters';
import { Score } from '../Interfaces/score';
import { LevelsInfoService } from '../service/levels-info.service';

@Component({
  selector: 'app-game-box',
  templateUrl: './game-box.component.html',
  styleUrls: ['./game-box.component.css']
})
export class GameBoxComponent implements OnInit, AfterViewInit {

  @Input() h : number = 8;
  @Input() w : number = 8;
  @Input() type : string = 'custom';

  @Output() levelEmitter : EventEmitter<number> = new EventEmitter();

  public indexN : number = 0;
  public gameWith : Letters = {mainLetter : '', hiddenLetter : ''}
  public gameArray : Array<string[]> = new Array<string[]>();
  public score : number = 0;
  public time = {hours : '0', min: '0', seconds: '0'};
  public counter : number = 0;
  public scoreList: Score[] = [];
  public level : number = 1;

  private lettersArr : Letters[] = [
    {mainLetter : 'p', hiddenLetter : 'q'},
    {mainLetter : 'q', hiddenLetter : 'p'},
    {mainLetter : '8', hiddenLetter : 'B'},
    {mainLetter : 'K', hiddenLetter : 'X'},
    {mainLetter : '0', hiddenLetter : 'O'},
    {mainLetter : 'I', hiddenLetter : '1'},
    {mainLetter : '1', hiddenLetter : 'I'},
    {mainLetter : '5', hiddenLetter : 'S'}
  ]

  constructor( private levelsInfoService : LevelsInfoService ) { 
  }
  ngAfterViewInit(): void {
    //this.basicTimer.autoStart = false;
  }

  ngOnInit(): void {
    this.checkSessionScores();
    this.startGame();
    //this.doCountup();
    this.sendLevel();
    this.getGameMode();
  }

  startGame():void{
    this.doCountup();
    this.clearGameArray();
    this.selectLetterToPlay();
    this.generateArray();
    this.insertHiddenLetter();
    this.counter = 0;
  }

  reset(){
    this.sendResetTime();
    this.startGame();
  }

  sendLevel():void{
    this.levelsInfoService.sendData(this.score);
  }

  sendResetTime():void{
    this.levelsInfoService.sendDataTime( 0 );
  }

  getGameMode():void{
    this.levelsInfoService.gamemode.subscribe( ( r ) =>{
      this.type = r;
    })
  }

  checkSessionScores(){
    let seVar = sessionStorage.getItem('score') || '';
    if( seVar !== '' ){
      this.scoreList = JSON.parse( seVar );
      this.score = this.scoreList[ this.scoreList.length - 1 ].level ;

      let addWith = Math.floor( this.score / 20 );
      this.h = this.h + addWith;
      this.w = this.w + addWith;

    }
  }

  clearGameArray():void{
    this.gameArray = new Array<string[]>();
  }

  selectLetterToPlay():void{
    this.indexN = Math.floor( (Math.random() * this.lettersArr.length) + 1 )-1;
    this.gameWith = this.lettersArr[this.indexN];
  }

  generateArray():void{
    for( let i = 0; this.h > i ; i++ ){
      let line = [];
      for( let j = 0; this.w > j; j++){
        line.push(this.gameWith.mainLetter);
      }
      this.gameArray.push(line);
    }
  }

  insertHiddenLetter():void{
    let hiddenH = Math.floor( (Math.random() * this.h) + 1 ) - 1;
    let hiddenW = Math.floor( (Math.random() * this.w) + 1 ) - 1;

    this.gameArray[hiddenH][hiddenW] = this.gameWith.hiddenLetter;
  }

  checkSuccess( field : string ): void{
    if( this.gameWith.hiddenLetter === field ){
      this.score+=1;
      this.level+=1;
      
      this.saveScore();
      this.sendLevel();
      this.sendResetTime();

      if( this.score%20 == 0 ){
        this.h = Number(this.h) + 1;
        this.w = Number(this.w) + 1;
      }
      this.startGame();
    }
      
  }

  saveScore():void{
    let levelScore = {
      time :  this.processTime(Math.floor( this.counter / 60 ) ) +" : " +
              this.processTime(this.counter % 60),
      level : this.score
    }
     
    this.scoreList.push(levelScore);
    sessionStorage.setItem('score', JSON.stringify(this.scoreList));
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
