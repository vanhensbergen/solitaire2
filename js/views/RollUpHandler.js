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
    #piles;
    constructor(piles){
        this.#piles = piles;
        window.alert("ik ga het spel oprollen volautomatisch straks met "+this.#piles.length)
        console.log(this.#piles)
    }
    }