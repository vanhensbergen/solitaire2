/**
* 	Deze klasse beheert de view van een kaart, er zijn er in totaal 52 van. 
*	Elke kaar kan zich tonen en heeft dan deeienschap #front op true,staat e waarde voor front op false 
	dan toont de view de achterkant van de kaart. De kaart beheer ook zijn eigen alt waarde en de positie in de stapel middels
*	de property top.
*	de property html geeft de benodigde html om zich te tonen. Pas wel eerst de property top en front toe.
*/
export default class CardView{
	#front;
	static #BACK = 'img/back.png'
	static #SYMBOLS = ['KLAVEREN', 'SCHOPPEN', 'HARTEN', 'RUITEN'];
	static #VALUES =['AAS','TWEE','DRIE','VIER','VIJF','ZES','ZEVEN','ACHT','NEGEN','TIEN','BOER','VROUW','HEER']
	#html
	#id;
	
	constructor(id){
		this.#html = document.createElement('div');
		this.#html.className='card';
		let img = document.createElement('img');
		this.#html.appendChild(img);
		img.src = CardView.#BACK; 
		
		img.alt= 'achterkant kaart'
		this.#id = id;
		this.#front=`img/${this.#id}.png`;
		
	}
	/**
	*	returnt de huidige html benodigd voor het rendren in de browser van een kaart. Spreek wel eerst top en front properties 
	*	aan voor een correcte rendering.
	*/
	get html(){
		return this.#html;
	}
	
	set front(value){
		let img = this.#html.querySelector('img');
		if(value===true){
			img.src = this.#front;
			img.alt=`${this.symbol} ${this.value}`;	 
		}
		else{
			img.alt= 'achterkant kaart';
			img.src = CardView.#BACK;
		}
	}
	
	set top(value){
		this.#html.style.top = `${value}px`	
	}
	
	get symbol(){
		return CardView.#SYMBOLS[parseInt(this.id/13)]
	}
	
	get value(){
		return CardView.#VALUES[this.id%13];
	}
	
	get id(){
		return this.#id;
	}
	
	contains(domElement){
		return this.html.firstChild === domElement
	}
	/**
	*	returnt true als de betrfeffende cardview zijn voorkant toont
	*	returnt false als de cardview de achterkant toont
	*/
	visible(){
		let img = this.#html.querySelector('img');
		return img.src.includes(this.#front);
	}


	hide(value){
		if(value){
			this.#html.classList.add('hidden')
		}
		else{
			this.#html.classList.remove('hidden')
		}
	}
}