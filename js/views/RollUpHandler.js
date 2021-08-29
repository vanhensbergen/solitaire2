import AnimatedHTML from "./AnimatedHTML.js";
import AnimationClock from "./AnimationClock.js";
export default class RollUpHandler{
    /**
     * #sourceIds bavat 4 arrays.Elke array bevat de id's van de kaarten in de betreffende
     * stapel op het speelvel vande view.
     * De daarop liggende kaarten moeten op genummerde volgode op
     * de eindstapels gebracht worden.
     * op de eerste eindstapel komen id's 0 t/m 13
     * op de tweede eindstapel komen id's  14 t/m 27 etc...
     * De taak van dit object is de kaarten geanimeerd naar hun eindstapel te brengen en daarmee de 
     * kaartstapels in de view af te bouwen tot ze leeg zijn
     */
    /**
     * de #sourceIds bevat de geordende 4 stapels van ids van de kaarten die op die 4 eerste stapels liggen
     * aan het eind van het spel
     */
    #sourceIds;
    /**
     * #destinationIds bevat de 4 ids van de eindstapels laatste kaarten die erop gelegd zijn. 
     * Deze info is voldoende om te bepalen wat de volgende kaart is die ero moet komen.
     */
    #destinationIds;
    #sourcePiles
    #destinationPiles;
    #animationClock;
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
        this.#animationClock = new AnimationClock();
        let delay = 1000;
        let animationHTML= this.#next(delay) 
        do{
            this.#animationClock.addUpdatable(animationHTML);
            delay +=2000;
            animationHTML= this.#next(delay)

        }while(animationHTML!==null)

        this.startAnimation();
    }


    #next(delay){
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
                    this.#destinationPiles[d].append(toBeMoved);//verwijderen uit de sourcePiles is automatisch na append elders
                    this.#destinationIds[d]= sourcePile.pop()//verwijder dit element van de sourceIds en plaats in destinationIds
                    return new AnimatedHTML(toBeMoved,delay);
                }
            }
        }
        return null;
    }

    startAnimation(){
        
        this.#animationClock.start();
    }


}