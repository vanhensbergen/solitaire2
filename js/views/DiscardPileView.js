import CardPileView from './CardPileView.js'
export default class DiscardPileView extends CardPileView{

	constructor(id){
		super(id)
	}
	/**
	*	overschrijving van de parentmethode	
	*	deze methode geeft het id af als array met één element van de zichtbare top kaart en verbergt het topexemplaar opde stapel
	*/
	getDraggables(e){
		let domElement = e.target;//gelukkig is dit zowel voor touchstart als voor mousedown hetzelfde domelement
		for(let viewcard of this.cardViews){
			if(viewcard.contains(domElement)){
				this.cardViews[this.cardViews.length-1].hide(true);//verberg de hoogst liggende weggesleepte kaart
				return [this.cardViews[this.cardViews.length-1].id]
			}
		}
		return [];
	}
		
}