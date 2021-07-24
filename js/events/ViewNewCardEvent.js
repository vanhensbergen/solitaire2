export default class ViewNewCardEvent extends Event{

static #TYPE = 'viewnewcard';
	
	
	
	constructor(){
		super(ViewNewCardEvent.#TYPE)
	}

}