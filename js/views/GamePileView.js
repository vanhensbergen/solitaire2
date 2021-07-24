import CardPileView from './CardPileView.js'
export default class GamePileView extends CardPileView{
	constructor(id){
		super(id)
		this.delta =30;
		this.top = 0;
	}
	
	show(cards){
		this.empty();
		this.top = 0;
		let html =[]
		let length = cards.length;
		for (let card of cards){
			let cardview = this.cardToView(card)
			cardview.top = this.top
			this.cardViews.push(cardview)
			html.push(cardview.html)
			this.top += this.delta;
		}
		this.container.replaceChildren(...html);
	}
	/**
	*	returnt de array met al de ids van de kaarten die gesleept moeten worden
	*/
	getDraggables(e){
		let domElement = e.target;//gelukkig geldt zowel voor mousedown als voor touchstart dat dit het zelfde element is!!
		let draggables = [];
		let cardview = null;
		
		let start = -1;
		for ( let i = 0; i<this.cardViews.length; i++){
			cardview = this.cardViews[i];
			if(cardview.visible()){
				if(cardview.contains(domElement)){
					start = i;
				}
			}
			if(start>-1){
				draggables.push(cardview.id);
				cardview.hide(true);
			}
		}
		return draggables
	}
} 