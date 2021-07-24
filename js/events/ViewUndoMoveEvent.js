export default class ViewUndoMoveEvent extends Event{

static #TYPE = 'viewundomove';
	
	
	
	constructor(){
		super(ViewUndoMoveEvent.#TYPE)
	}

}