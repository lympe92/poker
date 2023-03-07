


export class player {
    public number:number;
    public name:string;
    public id:number;
    public chips:number;
    public isDealer:boolean;
    public isBigBlind:boolean;
    public isSmallBlind:boolean;
    public isActivePlayer:boolean;
    public bettingAmount:number;
    public temporaryBetting:number;
    public toSpeak:boolean;

    constructor(number:number,name:string,id:number,chips:number,isDealer:boolean,isBigBlind:boolean,isSmallBlind:boolean,isActivePlayer:boolean,bettingAmount:number,temporaryBetting:number,toSpeak:boolean){
         this.number=number;
         this.name=name;
         this.id=id;
         this.chips=chips;
         this.isDealer=isDealer;
         this.isBigBlind=isBigBlind;
         this.isSmallBlind=isSmallBlind;
         this.isActivePlayer=isActivePlayer;
         this.bettingAmount=bettingAmount;
         this.temporaryBetting=temporaryBetting;
         this.toSpeak=toSpeak;
    }   
}
