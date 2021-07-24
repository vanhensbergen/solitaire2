export default class PileDragDropEvent extends Event{
	static #TYPE = 'piledragdrop';
	
	#pile_id
	#card_id
	
	
	constructor(pile_id,card_id){
		super(PileDragDropEvent.#TYPE)
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
	
	