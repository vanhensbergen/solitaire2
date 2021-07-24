export default class PileDragStartEvent extends Event{
	static #TYPE = 'piledragstart';
	#draggables;
	#pageX
	#pageY
	
	constructor(cards, pageX, pageY){
		super(PileDragStartEvent.#TYPE)
		this.#draggables = cards;
		this.#pageX = pageX;
		this.#pageY = pageY;
		
	}
	
	get draggables(){
		return this.#draggables;
	}
	get pageX(){
			return this.#pageX
	}
	get pageY(){
		return this.#pageY;
	}
}