export default class ViewNewGameEvent extends Event{

static #TYPE = 'viewnewgame';
	
	
	
	constructor(){
		super(ViewNewGameEvent.#TYPE)
	}

}