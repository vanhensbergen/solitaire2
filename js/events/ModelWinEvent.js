export default class ModelWinEvent extends Event{
	static #TYPE = 'modelwin';
	#piles
	
	constructor(piles, round){
		super(ModelWinEvent.#TYPE)
		this.#piles = piles;
        console.log('er is een win event afgegeven');
	}
	
	get piles(){
		return this.#piles;
	}
}