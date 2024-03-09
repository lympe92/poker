import { Player } from "./player";

 

export interface BlindPlayers { 
 dealer:Player;
 smallBlind:Player;
 bigBlind:Player;
 underTheGun:Player;
}
