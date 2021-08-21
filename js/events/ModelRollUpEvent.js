export default class ModelRollUpEvent extends Event{
	static #TYPE = 'modelrollup';
	#piles;
	
	
	constructor(piles){
		super(ModelRollUpEvent.#TYPE)
		this.#piles = piles;
	}
	
	get piles(){
		return this.#piles;
	}
}