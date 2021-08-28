import AnimatedHTML from "./AnimatedHTML.js";
import AnimationClock from "./AnimationClock.js";
export default class RollUpHandler{
    /**
     * #piles bavat 4 arrays.Elke array bevat de id's van de kaarten in de betreffende
     * stapel op het speelvel vande view.
     * De daarop liggende kaaren moeten op genummerde volgode op
     * de eindstapels gebracht worden.
     * op de eerste eindstapel komen id's 0 t/m 13
     * op de tweede eindstapel komen id's  14 t/m 27 etc...
     * De taak van dit object is de kaarten geanimerd naar hu eindstapel te brengen en daarmee de 
     * kaartstapels in de view af te bouwen tot ze leeg zijn
     */
    #sourceIds;
    #destinationIds;
    #sourcePiles
    #destinationPiles;
    constructor(sources, destinations){
        this.#sourceIds = sources;
        this.#destinationIds = destinations;
        this.#init();
    }

    #init(){
        this.#sourcePiles =[];
        this.#destinationPiles = [];
        const containers = document.querySelectorAll('.playfield>div>div');
        for(let i = 2;i<6;i++){
            this.#sourcePiles.push(containers[i]);
        }
        for(let i = 9; i<13; i++){
            this.#destinationPiles.push(containers[i])
        }
        
        //console.log(this.#sourceIds)
       // console.log(this.#destinationIds)
        let animationHTML= this.next()
        this.move(animationHTML);
    }


    next(){
        for(let d =0; d<this.#destinationIds.length; d++){
            let nextId = this.#destinationIds[d]+1;
            for(let s = 0; s <this.#sourceIds.length; s++){
                let sourcePile  = this.#sourceIds[s]
                let lastId  = sourcePile[sourcePile.length -1];
                if(nextId === lastId){
                    let toBeMoved = this.#sourcePiles[s].lastChild;
                    let sourceBounds = toBeMoved.getBoundingClientRect()
                    let destinationBounds =  this.#destinationPiles[d].getBoundingClientRect();
                    toBeMoved.style.left= (sourceBounds.left - destinationBounds.left)+"px"
                    toBeMoved.style.top= (sourceBounds.top - destinationBounds.top)+"px"
                    this.#destinationPiles[d].append(toBeMoved);
                    return new AnimatedHTML(toBeMoved,10000);
                }
            }
        }
    }

    move(html){
        let clock = new AnimationClock();
        clock.addUpdatable(html);
        clock.start();
    }


}