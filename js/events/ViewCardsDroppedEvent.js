export default class ViewCardsDroppedEvent extends Event{
	static #TYPE = 'viewcardsdropped'
	#pile_id
	#card_id
	
	
	constructor(pile_id,card_id){
		super(ViewCardsDroppedEvent.#TYPE)
		this.#pile_id = pile_id;
		this.#card_id = card_id;
	}
	
	get pileId(){
		return this.#pile_id;
	}
	
	get cardId(){
		return this.#card_id
	}

}