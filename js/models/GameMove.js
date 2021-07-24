export default class GameMove{

  #source//de oude toestand van de stapel waar je vanaf gaat halen
  #sourceId
  #destination;//de oude toestand van de stapel waar je op gaat droppen
  #destinationId

  
  constructor(sourceId, source, destinationId, destination)
  {
	  this.#source = source;
	  this.#sourceId = sourceId;
	  this.#destinationId = destinationId
	  this.#destination = destination;
  }
  
  
 
  
  get destination(){
	  let o = new Object();
	  o.id = this.#destinationId;
	  o.pile = this.#destination;
	  return o
  }
  
  
  get source(){
	  let o = new Object();
	  o.id = this.#sourceId;
	  o.pile = this.#source;
	  return o
  }
  

  
  

}