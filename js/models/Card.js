/**
*	de echte kaart model klasse beheert het id van een kaart en of dat zichtbaar is. Is de eigenschap visible op waarde true dan toont de view 
*	de kaart met zijn feitelijke waarde, anders zie je slechts de achterkant van de kaart. 
*/
export default class Card{
	#id
	visible;
	
	constructor(id){
		this.#id = id;
		this.visible = true;
	}
	
	get id (){
		return this.#id;
	}
	/**
	*	de value van een kaart is zijn  waarde in het spel die kan zijn 0 t/m 12
	*	in oplopende betekenis betekent dat aas, twee,......,heer
	*/
	get value(){
		return this.#id%13;
	}
	/**
	*	returnt de waarde van het symbool lopend van 0 t/m 3.
	*	0 komt overeen met KLAVEREN, 1 met SCHOPPEN, 2 met HARTEN en 3 met RUITEN
	*/
	get symbol(){
		return parseInt(this.#id/13);
	}
	
	
	/**
	* 	elke kaart kan zwart(0) of rood(1)zijn
	*/
	get color(){
		return this.symbol<2?0:1
	}
	/**
	* geeft true als hij de volgende kaart van hetzelfde type is: dus harten 5 is next in line van harten 4
	* een nextofkin kan op deze kaart (this) gelegd worden op de eindstapels
	*/
	isNextInLine(card){
		return this.symbol===card.symbol&&this.value ===card.value-1;
	}
	/**
	* een bestfriend is een goede kaart die op jou past op de speeltafel met de zeven kaart stapels
	* natuurlijkheb je geen bestfriend alsje een twee bent; de aas is geen bestfriend van de twee
	*/
	isBestFriend(card){
		return this.color!==card.color&&this.value === card.value+1&&this.value!==1;
	}
	//maak een copy van een kaart zodat je een bepaalde kaartstapel kan bewaren terwijl het origineel verandert.
	copy(){
		let copy = new Card(this.id);
		copy.visible = this.visible;
		return copy;
	}
	
	
}