export default class ModelRollUpEvent extends Event{
	static #TYPE = 'modelrollup';
	#sources;
	#destinations;
	
	
	constructor(sources, destinations){
		super(ModelRollUpEvent.#TYPE)
		this.#sources = sources;
		this.#destinations = destinations
	}
	
	get sources(){
		return this.#sources;
	}
	get destinations(){
		return this.#destinations;
	}
}