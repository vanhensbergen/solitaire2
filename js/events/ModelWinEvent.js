export default class ModelWinEvent extends Event{
	static #TYPE = 'modelwin';
	#piles
	
	constructor(){
		super(ModelWinEvent.#TYPE)
	}
}