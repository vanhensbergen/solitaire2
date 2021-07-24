import CardView from './CardView.js'
import PileDragStartEvent from '../events/PileDragStartEvent.js'
import PileDragDropEvent from'../events/PileDragDropEvent.js'
/**
*	deze klasse krijgt een stapel kaarten in de view. deze stapel maakt een stapel kaarten die op elkaar liggen. Er zijn in totaal 5 stapels met
* 	dit gedrag de startstapel en de 4 eindstapels Die 5 stapels zijn ook niet gekoppeld aan een dragstarthandler in de view.
*	Elke stapel heeft een handler die de default bij dragstart overruled. Er komt dus geen ghostimage achter de muis aan bij draggen.
*	Tijdens de startdrag wordt er op een kaart geklikt die als leiding kaart meegesleept wordt. De id van deze kaart is van belang en
*	wordt bewaard in een statische variabele oadat elke instantie de waarde te pakken kan kijgen en setten,dit gebeurt tijdens de viewdragstart fase
*	deze waarde wordt aan het viewdragdropevent meegegeven naast de id van de gedropte stapel.
*/
export default class CardPileView extends EventTarget{
	top;
	#id;//het id van de kaartstapel.Loopt van 0 t/m 12
	#cardViews;
	static LEADING_DROPPED_CARD_ID;//het id van de leading kaart die als eerste meegesleept is. Het model bepaalt of deze id passend is bij de gedropte stapel.
	static CARD_CONTAINERS = document.querySelectorAll('.playfield>div>div')

	constructor(id)
	{
		super();
		this.#id = id;
		
		//voorkom dat drag and drop api een ghostimage maakt als je gaat slepen.
		this.container.addEventListener('dragstart', (e)=>
			{
				e.preventDefault();
				return false;
			})
		
		this.top = 0;
		
	}
	/**
	* property om het dom-element op het halen dat de container is waarbinnen de kaarten absoluut gepositioneerd worden.
	*/
	get container(){
		return CardPileView.CARD_CONTAINERS[this.#id];
	}
	get cardViews(){
		return this.#cardViews;
	}
	empty(){
		this.#cardViews=[];
	}
	addEventListener(type,callback){
		
		switch(type)
		{
			case 'piledragstart':
					super.addEventListener(type,callback)
					this.container.addEventListener('touchstart', (e)=>{
					this.handleStartDrag(e);
				})
					this.container.addEventListener('mousedown', (e)=>{
					this.handleStartDrag(e);
					e.stopPropagation();
					e.preventDefault();
				})
				break;
			case 'piledragdrop':
					super.addEventListener(type,callback)
					this.container.addEventListener('touchend',(e)=>{
					this.handleDragDrop(e);			
					},true)
					this.container.addEventListener('mouseup',(e)=>{
					this.handleDragDrop(e);	
					},true)
				
			default:
				this.container.addEventListener(type,callback);
				break;
		}
		
	}
	
	/**
	*	deze methode krijgt een stapel cardview objecten en maakt in de view deze stapel zichtbaar.
	*/
	show(cards){
		this.empty();
		let html = [];
		this.top = 0;
		for (let card of cards)
		{
			let cardview = this.cardToView(card)
			cardview.top = this.top
			this.#cardViews.push(cardview)
			html.push(cardview.html)
		}
		this.container.replaceChildren(...html);
	}
	
	handleStartDrag(e){
		let cards = this.getDraggables(e)
		let pageX =0;
		let pageY = 0;
		switch(e.type){
			case 'mousedown':
				pageX = e.pageX;
				pageY = e.pageY;
				break;
			case 'touchstart':
				pageX = e.changedTouches[0].pageX;
				pageY = e.changedTouches[0].pageY;
				break;
		}
		CardPileView.LEADING_DROPPED_CARD_ID = -1;
		if ( cards.length>0){
			CardPileView.LEADING_DROPPED_CARD_ID = cards[0];
			this.#fireDragStarted(cards,pageX, pageY);
		}
	}
	
	handleDragDrop(e){
		/*
			het touchevent target blijft gedurende de gehele drag verbonden met het startelement en je weet dus niet waarop
			gedropt wordt "this" blijft dus ook steeds verbonden met het startelement en niet met het element
			waarop gedropt wordt,
			Dit verschilt wezenlijk met de mouseevents; het mouseup event heeft als target het element waar je op dropt en 'this'
			hoort bij het element waarop je dropt.
			see: https://www.html5rocks.com/en/mobile/touchandmouse/
			5.5 The touchend event
			A user agent must dispatch this event type to indicate when the user removes a touch point from the touch surface, 
			also including cases where the touch point physically leaves the touch surface, such as being dragged off of the screen.
			The target of this event must be the same Element on which the touch point started when it was first placed on the surface, 
			even if the touch point has since moved outside the interactive area of the target element.
			The touch point or points that were removed must be included in the changedTouches attribute of the TouchEvent, and must 
			not be included in the touches and targetTouches attributes.
		 */
		let ID = this.#getIdDroppedContainer(e)
		if(ID===-1) return
		this.#fireDragDropped(ID)
	}

	/**
	 * method bepaalt het id van de geklikte kaart container geeft een waarde van 0 t/m 12
	 * @param event
	 * @returns {het ID van de geklikte container}
	 */
	#getIdDroppedContainer(e){
		if(e.type==='mouseup'){
			return this.#id;//mouseup wordt afgevuurd door het element waarop gedropt wordt in casu het eventtargetelement waar je op los laat
		}
		//helaas is dat niet zo voor touchend dat blijft contact houden met de startplek
		if(e.type === 'touchend'){
			const containers = CardPileView.CARD_CONTAINERS;
			let ID = -1;		
			clientX = e.changedTouches[0].clientX;
			clientY = e.changedTouches[0].clientY;
			
			let dropContainer = document.elementFromPoint(clientX, clientY);
			if(dropContainer.tagName.toLowerCase()==='img'){//als je op een kaart klikt klik je op de img
				dropContainer = dropContainer.parentNode.parentNode
			}
		
			let i= 0;
			for(let container of containers){
				if(dropContainer===container){
					return i;
				}
				i++;
			}
		}
		return -1
	}
	/*
	*	deze methode wordt overschreven in de overerving;
	*	levert uiteindelijk de id's van de kaarten die meegesleept moeten worden met de muis
	*/
	getDraggables(e){
		//nullimplementatie
	}
	#fireDragStarted(cards,pageX, pageY){
		this.dispatchEvent(new PileDragStartEvent(cards,pageX,pageY))
	}
	#fireDragDropped(id){
		if(CardPileView.LEADING_DROPPED_CARD_ID!==-1){
			this.dispatchEvent(new PileDragDropEvent(id,CardPileView.LEADING_DROPPED_CARD_ID));
		}
	}
	
	cardToView(card){
		let cardview = new CardView(card.id);
		cardview.front = card.visible;
		return cardview
	}
	
}