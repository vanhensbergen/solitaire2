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
    #ids;
    #sourcePiles
    #destinationPiles;
    #stats;
    constructor(piles){
        this.#ids = piles;
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
        console.log(`sources ${this.#sourcePiles.length} destinations ${this.#destinationPiles.length}`)
        this.#stats = this.getDestinationStats();
        console.log(this.#stats)
        console.log(this.#ids)
        this.next()
    }

    getDestinationStats(){
        let counts =[{},{},{},{}];
        let teller = 0;
        const playField = (document.querySelector('.playfield')).getBoundingClientRect();
        for (const dest of this.#destinationPiles){
            counts[teller].nextid = dest.children.length + teller*13;
            let el =dest.getBoundingClientRect();
            counts[teller].left = el.left - playField.left;
            counts[teller].top = el.top - playField.top;
            teller++;
        }
        return counts
    }

    next(){
        
        let destinationId = 0;
        for (const stat of this.#stats)
        {
            let nextId = stat.nextid;
            let sourceId = 0;
            for(const idSet of this.#ids)
            {
                let ID =  idSet[idSet.length-1]
                if(nextId ===ID){
                    
                    console.log(`te verplaatsen van source ${sourceId} naar destination ${destinationId}`)
                    let toBeMoved = this.#sourcePiles[sourceId].lastChild;
                    this.#destinationPiles[destinationId].append(toBeMoved);
                    return;

                }
                sourceId++;
            }
            destinationId++;
        }
    }


}