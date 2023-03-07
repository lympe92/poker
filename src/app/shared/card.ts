export class card {
    name:string;
    cardId:number;
    shape:string;
    available:boolean;
    img:string;

    constructor(name:string,cardId:number,shape:string,available:boolean,img:string){
        this.name=name;
        this.cardId=cardId;
        this.shape=shape;
        this.available=available;
        this.img=img;
    }
}

 