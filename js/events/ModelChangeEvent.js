export default class ModelChangeEvent extends Event{
	static #TYPE = 'modelchange';
	#piles;
	#round;
	
	constructor(piles, round){
		super(ModelChangeEvent.#TYPE)
		this.#piles = piles;
		this.#round = round;
	}
	
	get piles(){
		return this.#piles;
	}
	
	get round(){
		return this.#round;
	}
}