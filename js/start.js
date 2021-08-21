import SolitaireGame from "./models/SolitaireGame.js"
import SolitaireView from'./views/SolitaireView.js'
window.addEventListener('load',()=>{
		let model	= new SolitaireGame();
		let view 	= new SolitaireView();
		model.addEventListener('modelchange',view);
		view.addEventListener('viewnewgame',model);
		view.addEventListener('viewnewcard',model)
		view.addEventListener('viewcardsdropped',model)
		view.addEventListener('viewundomove',model)
		model.addEventListener('modelwin',view)
})