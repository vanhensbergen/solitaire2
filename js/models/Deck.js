import Card from './Card.js'
export default class Deck{
	#cards;
	
	
	constructor(){
		this.#cards = [];
		for (let i =0; i<52; i++){
			this.#cards.push(new Card(i))
		}
		
	}
	
	shuffle(){
		let j;
		let tmp;
		let size = this.#cards.length;
		for(let i = 0; i<size; i++)
		{
			do{
				j = Math.floor(size*Math.random())
			}
			while(j===i)
			tmp = this.#cards[i];
			this.#cards[i]= this.#cards[j];
			this.#cards[j] = tmp;
		}
	}

	get cards(){
		return this.#cards;
	}

}