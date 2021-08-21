import Deck from './Deck.js'
import ModelChangeEvent from'../events/ModelChangeEvent.js'
import ModelWinEvent from '../events/ModelWinEvent.js';
import GameRoundHistory from './GameRoundHistory.js'
import ModelRollUpEvent from '../events/ModelRollUpEvent.js';
export default class SolitaireGame extends EventTarget{
	#deck;
	#cardPiles
	#gameRoundHistory
	#round;
	#succesEnding;
	constructor(){
		super()
		this.#deck = new Deck();
		this.#cardPiles = [[],[],[],[],[],[],[],[],[],[],[],[],[]]
		this.#gameRoundHistory = new GameRoundHistory();
		this.#succesEnding = false;
	}
	
	handleEvent(event){
		switch(event.type)
		{
			case 'viewnewgame':
				this.#start()
			break;
			case 'viewnewcard':
				if(this.#hasRoundEnded()){
					this.#nextRound();
				}else{
					this.#openNewCard();
				}
			break;
			case 'viewundomove':
				this.#undoMove();
			break;
			case 'viewcardsdropped':
				let pileId = event.pileId;
				let cardId = event.cardId;
				this.#placeCardsOnPile(pileId,cardId);
				this.#testHasWon()
				this.#testRollUpConditionMet()
			break;
		}
	}
	#testHasWon(){
		if(!this.#succesEnding){
			let hasWon = this.#cardPiles[0].length===0&&this.#cardPiles[1].length ===0;
			if(!hasWon){
				return;
			}
			for(let i = 2; i <9; i++){
				for(const card of this.#cardPiles[i]){
					if(!card.visible){
						return ;
					}
				}
			}
			this.#succesEnding = true;
			this.#fireGameWon();
		}
	}
	/**
	 * deze methode test of de conditie om het beeindigde gewonnen spel 
	 * middels animatie te laten oprollen naar de eindstapels gerealiseerd is.
	 * Deze conditie is dat de speelkaarten op de speeltafel op de eerste 4 rijen 
	 * liggen klaar om verplaatst te worden naar de eindstapels. Dan moet het event gegenereerd worden.
	 */
	#testRollUpConditionMet(){
		if(this.#succesEnding){
			let condition = false
			for(let i=2; i<6; i++){
				condition = condition||this.#cardPiles[i].length>0;
			}
			for(let i = 6; i<9; i++){
				condition = condition&&this.#cardPiles[i].length===0;
			}
			if(condition){
				this.#fireRollUpConditionMet(this.#cardPiles);
			}
		}

	}
	#start(){
		this.#round = 1;
		this.#succesEnding = false;
		this.#gameRoundHistory.clear();
		this.#deck.shuffle();
		this.#cardPiles = [[],[],[],[],[],[],[],[],[],[],[],[],[]]
		let cards = this.#deck.cards;
		let k= 0;
		for(let i =2; i<9; i++)
		{
			 let pileSize = i -1;
			 for(let j =0; j < pileSize; j++)
			 {
				 //maak de laatste kaart zichtbaar al de andere kaarte zijn onzichtbaar
				 //zo start het spel op.
				 cards[k].visible = (j===(pileSize-1))
				 this.#cardPiles[i].push(cards[k])
				 k++;
			 }				 
		}
		for (let i = k; i<cards.length; i++){
			cards[i].visible = false;
			this.#cardPiles[0].push(cards[i]);
		}
		this.#fireModelChanged(this.#cardPiles);
	}
	
	
	
	#fireModelChanged(changedPiles){
		this.dispatchEvent(new ModelChangeEvent(changedPiles,this.#round))
	}

	#fireGameWon(){
		this.dispatchEvent(new ModelWinEvent());
	}
	#fireRollUpConditionMet(piles){
		this.dispatchEvent(new ModelRollUpEvent(piles))
	}
	/**
	*	breng een stel nieuwe kaaren open op de stapel om te gebruiken
	als returnaarde false dan zijn er geen nieuwe kaarten; de stapel was leeg.
	*/
	#openNewCard(){
		let stackPile = this.#cardPiles[0]
		let discardPile = this.#cardPiles[1];
		let stackPileLength = stackPile.length;
		if(stackPileLength>0)
		{
			this.#updateRoundHistory(0,stackPile,1,discardPile)
			let card = stackPile.pop()
			card.visible = true;
			discardPile.push(card);
			this.#fireModelChanged([stackPile,discardPile,null, null,null, null, null, null, null,null, null,null, null])
			return true;
		}
		return false;
	}
	/**
	*	breng de bovenste open kaart van de stapel op één van de 7 stapels de id is de gewenste stapelomop te plaatsen.
	*/
	#placeCardsOnPile(dropPileId,cardId){
		let changesMade = false;
		let sourcePileId = this.#getSourcePileId(cardId);
		let sourcePile = this.#cardPiles[sourcePileId];
		let dropPile = this.#cardPiles[dropPileId];
		let endCard = null;
		if(dropPile.length>0){
			endCard = dropPile[dropPile.length-1];
		}
		let cardsToDrop = this.#getCardsToDrop(sourcePile,cardId);
		if(dropPileId>1&&dropPileId<9)//drop op een game stapel; 
		{
			
			if(sourcePileId === 1){//je dragt van de discardstapel en dropt op een gamestapel 
				let dropCard = cardsToDrop[0];//er is maar één drop kaart
				if(endCard!==null && dropCard.id===cardId&&endCard.isBestFriend(dropCard)){
					this.#updateRoundHistory(sourcePileId,sourcePile,dropPileId,dropPile)
					dropPile.push(sourcePile.pop(dropCard));
					changesMade =true;
					
				}
				if(endCard===null&&dropCard.value===12){
					this.#updateRoundHistory(sourcePileId,sourcePile,dropPileId,dropPile)
					dropPile.push(sourcePile.pop(dropCard));
					changesMade =true;
				}
			}
			if(sourcePileId>1&&sourcePileId<9){//je dragt van een gamestapel en dropt  een gamestapel
				let connectingCard = cardsToDrop[0];
				if(endCard!==null&&endCard.isBestFriend(connectingCard)){
					this.#updateRoundHistory(sourcePileId,sourcePile,dropPileId,dropPile)
					for(let card of cardsToDrop){
						dropPile.push(card);
						sourcePile.pop();
					}
					changesMade =true;
				}
				
				if(endCard===null&&connectingCard.value===12){
					this.#updateRoundHistory(sourcePileId,sourcePile,dropPileId,dropPile)
					for(let card of cardsToDrop){
						dropPile.push(card);
						sourcePile.pop();
					}
					changesMade =true;
				}
			}
		}
		if(dropPileId>8&&cardsToDrop.length===1){//je dropt op een endstapel
			let dropCard = cardsToDrop[0];
			if (endCard===null){
				let pileSymbol = dropPileId%9//0 voor KLAVEREN, 1 voor SCHOPPEN, 2 voor HARTEN, 3 voor RUITEN
				if (dropCard.symbol === pileSymbol&&dropCard.value===0){
					this.#updateRoundHistory(sourcePileId,sourcePile,dropPileId,dropPile)
					dropPile.push(sourcePile.pop())
					changesMade =true;
				}
			}
			else{
				
				if(endCard.isNextInLine(dropCard)){
					this.#updateRoundHistory(sourcePileId,sourcePile,dropPileId,dropPile)
					dropPile.push(sourcePile.pop())
					changesMade =true;
				}
			}
		}
		
		if(changesMade===true){
			if(sourcePile.length!==0){
				let endCard = sourcePile[sourcePile.length-1];
				endCard.visible = true//zorg ervoor dat de pile die geeft altijd een zichtbare kaart heeft;
			}
			let changes = this.#getChanges(sourcePileId, dropPileId)
			this.#fireModelChanged(changes)
		}
		
	}
	/**
	*	bepaalt de veranderde 2 piles en maakt deze beschikbaar voor ovrdracht aan de viw middels event
	*/
	#getChanges(pileId1,pileId2){
		let changes = [null];
		for(let i =1; i<13; i++){
			changes.push(i===pileId1||i===pileId2?this.#cardPiles[i]:null)
		}
		return changes;
	}
	//het model bepaalt aan de hand van het geeverde cardId de kaarten die verpaaltst gaan worden.
	//alle kaarten met een locatie hoger dan die van cardId worden ook meegnenomen
	#getCardsToDrop(sourcePile,cardId){
		let cardsToDrop =[];
		let participates = false;
		for(let card of sourcePile){
			if(card.id === cardId){
				participates = true;
			}
			if(participates ===true){
				cardsToDrop.push(card);
			}
		}
		return cardsToDrop;
	}
	
	#getSourcePileId(cardId){
		cardId =parseInt(cardId);
		for(let i=1; i<this.#cardPiles.length ;i++)
		{
			let pile = this.#cardPiles[i];
			
			for(let j =0; j<pile.length; j++)
			{
				let card = pile[j]
				if(card.id==cardId)
				{
					return i;
				}
			}
		}
		return -1;
	}
	
	#hasRoundEnded(){
		return this.#cardPiles[0].length ===0;
	}
	
	#nextRound(){
		this.#gameRoundHistory.clear();
		this.#round++;
		let cards = this.#cardPiles[1];
		cards.forEach(element=>element.visible=false);
		this.#cardPiles[1] = [];
		this.#cardPiles[0]= cards.reverse();
		this.#fireModelChanged([this.#cardPiles[0],this.#cardPiles[1],null, null,null, null, null, null, null,null, null,null, null])
	}
	
	/*
	*	maak een harde kopie van de 2 kaartstapels die gaan wijzigen.
	*	dit doe je natuurlijk wel vóór de feitelijke wijziging in de stapels is doorgevoerd.
	*	Sla deze oude toestand op in de Geschiedenis.
	*/
	#updateRoundHistory(sourceId, source, destinationId, destination){
		
		let lastSourcePile =[];
		let lastDestinationPile = [];
		source.forEach((element)=>{
					lastSourcePile.push(element.copy())
		})
		destination.forEach((element)=>{
					lastDestinationPile.push(element.copy())
		})
		this.#gameRoundHistory.add(sourceId, lastSourcePile, destinationId, lastDestinationPile);
	}
	
	#undoMove(){
		let lastMove = this.#gameRoundHistory.previous();
		if(lastMove!==null){
			let source = lastMove.source;
			let sourcePile = source.pile;
			let sourceId = source.id;
			this.#cardPiles[sourceId] = sourcePile;
			let destination = lastMove.destination;
			let destinationPile = destination.pile
			let destinationId = destination.id;
			this.#cardPiles[destinationId]=destinationPile;
			
			let changes = [];
			for(let i =0; i <this.#cardPiles.length; i++){
				changes[i] = (i===sourceId||i===destinationId)?this.#cardPiles[i]:null;
			}
			this.#fireModelChanged(changes)
		}
		
	}

}