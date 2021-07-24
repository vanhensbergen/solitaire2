import GameMove from './GameMove.js'
/*
* 	bewaart de gemaakte zetten tot aan de huidige binnen een ponde van het spel;
*	als je teruggaat wordt de geschiedenis aan zetten afgebouwd ga je verder wordt de geschiedenis weer opgebouwd
*	Je kan kortom niet op en neer lopen in de geschiedenis. 
*/
export default class GameRoundHistory{

	#moves
	
	constructor(){
		this.#moves =[];
	}
	
	add(fromId, fromCardPile,toId, toCardPile ){
		this.#moves.push(new GameMove(fromId, fromCardPile,toId, toCardPile));
	}
	
	/*
	*	heeft als returnwaaarde de meest recente/laatste zet op de stapel
	*	bouwt fysiek de stapel af tot een lege stapel;
	*/
	previous(){
		return (this.#moves.length===0)?null:this.#moves.pop();
	}
	
	
	clear(){
		this.#moves =[];
	}

}