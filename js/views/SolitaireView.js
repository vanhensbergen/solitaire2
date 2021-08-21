import CardPileView from'./CardPileView.js'
import DisCardPileView from'./DisCardPileView.js'
import GamePileView from './GamePileView.js'
import CardView from './CardView.js'
import ViewNewGameEvent from '../events/ViewNewGameEvent.js'
import ViewNewCardEvent from '../events/ViewNewCardEvent.js'
import ViewUndoMoveEvent from '../events/ViewUndoMoveEvent.js'
import ViewCardsDroppedEvent from '../events/ViewCardsDroppedEvent.js'
import RoleUpHandler from './RollUpHandler.js'
export default class SolitaireView extends EventTarget{
    #piles
	#ghostDiv
	
    constructor(){
		super()
		this.#ghostDiv = null;
		document.querySelector('body').addEventListener('contextmenu',(e)=>{e.preventDefault()})//uitschakelen contextmenu bij per ongeluk rechtsklikken
		this.#piles= []
		for (let i = 0; i<13; i++){
			if(i === 0||i>8)this.#piles.push(new CardPileView(i))
			if(i === 1)this.#piles.push(new DisCardPileView(i))
			if(i>1&&i<9)this.#piles.push(new GamePileView(i))
		}
		//dit zijn de stapels die gevoelig zijn voor dragstart
		for(let i = 1; i<9; i++){
			
			this.#piles[i].addEventListener('piledragstart',this)
		}
		//dit zijn de stapel die gevoelig zijn voor drop
		for(let i = 1; i<13;i++){
			this.#piles[i].addEventListener('piledragdrop',this)
		}
		this.#createNewGameEventDispatcher()
		this.#createNewCardEventDispatcher()
		this.#createUndoMoveEventDispatcher()
		
    }
	
	#createNewGameEventDispatcher(){
		let button = document.querySelectorAll('nav>img')[0];
		button.addEventListener('click',()=>{
			this.dispatchEvent(new ViewNewGameEvent())
			
		});
		
	}

    #createNewCardEventDispatcher(){
		this.#piles[0].addEventListener('click',()=>{
			this.dispatchEvent(new ViewNewCardEvent())
			
		})
		
	}
	#createUndoMoveEventDispatcher(){
		let button = document.querySelectorAll('nav>img')[1];
		button.addEventListener('click',()=>{
			this.dispatchEvent(new ViewUndoMoveEvent())
		});
	}
	
	

	#startDrag(event){
		let draggables = event.draggables;
		this.#ghostDiv = document.createElement('div')
		this.#ghostDiv.id = 'ghostdiv'
		this.#ghostDiv.classList.add('card');
		document.body.style.cursor="url('img/cursor.png'), pointer";
		let html =[];
		let top = 0;
		for (let id of draggables){
			let dragview = new CardView(id)
			dragview.front = true;
			dragview.top = top;
			top +=30;
			html.push(dragview.html)
		}
		this.#ghostDiv.replaceChildren(...html);
		document.querySelector('.playfield').appendChild(this.#ghostDiv);
		this.#ghostDiv.style.left = (event.pageX - 50)+"px";
		this.#ghostDiv.style.top = (event.pageY +4)+"px";
		const handler  = (e)=>this.#onDrag(e)
		document.addEventListener('touchmove',handler,{passive:false})
		document.addEventListener('mousemove',handler)
		document.addEventListener('touchend',
				(e)=>{
					if(this.#ghostDiv!==null){
						document.removeEventListener('touchmove',handler)
						this.#ghostDiv.remove();
						this.#ghostDiv = null;
						this.#showHiddenCards();
						document.body.style.cursor = 'default'
						e.preventDefault()
						
					}
				}
			)
		document.addEventListener('mouseup',
				(e)=>{
					if(this.#ghostDiv!==null){
						
						document.removeEventListener('mousemove',handler)
						this.#ghostDiv.remove();
						this.#ghostDiv = null;
						this.#showHiddenCards();
						document.body.style.cursor = 'default'
						
					}
				}
			)
	}
	
	#showHiddenCards(){
    	let cards = document.querySelectorAll('.card');
    	for(let card of cards){
    		card.classList.remove('hidden');
		}
	}
	#onDrag(event){
			if(this.#ghostDiv!==null)
			{
				let pageX =0;
				let pageY = 0;
				switch(event.type){
					case "touchmove":
						pageX = event.changedTouches[0].pageX;
						pageY = event.changedTouches[0].pageY;
						event.preventDefault();
						break;
					case "mousemove":
						pageX = event.pageX;
						pageY = event.pageY;
						break;
				}
				this.#ghostDiv.style.left = (pageX-50)+"px";
				this.#ghostDiv.style.top = (pageY+4)+"px"
			}

	}
	
	
    #show(piles){
		for(let i =0; i<piles.length; i++){
			let cards = piles[i];
			if(cards!==null)
			{
				this.#piles[i].show(cards)
			}
		}
	}
	#showRound(value){
		document.querySelector('#round').value = value;
	}
	
	

    /**
	* interface EventListener implementatie, deze methode wordt automatisch aangeroepen als er een relevant event is. Moet deze naam hebben.
	* @param event
	*/
	handleEvent(event){
		switch(event.type)
		{
			case 'modelwin':
				new RoleUpHandler(event.piles);
			break; 
			case 'modelchange':
				this.#show(event.piles);
				this.#showRound(event.round);
			break;
			case 'piledragstart':
				this.#startDrag(event)
			break;
			case 'piledragdrop':
				let pileId = event.pileId;
				let cardId = event.cardId;
				this.dispatchEvent(new ViewCardsDroppedEvent(pileId, cardId));
			break;
			
			
		}
		
	}
}