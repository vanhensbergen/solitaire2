export default class AnimationClock{

    #updatables;
    #delay;
    
    #nextUpdateTime;

    constructor(){
        this.#updatables = [];
        this.#delay = 2000;
        this.#nextUpdateTime = -1;
    }
    start(){
        window.requestAnimationFrame(t=>{this.tick(t)})
    }


    tick(timestamp){
        //initialiseer de nextUpdateTime
        if(this.#nextUpdateTime===-1){
            this.#nextUpdateTime = timestamp;
        }
        //maak een request voor een nieuwe updatable en zo er een is voeg hem toe aan de lijst; hoog vervolgens de tijd op 
        if(timestamp>=this.#nextUpdateTime){
            let u = this.retrieveUpdatable();
            if(u!==null){
                this.addUpdatable(u)
            }
            this.#nextUpdateTime += this.#delay;
        }
        //laat alle updatables hun taak uitvoeren en vraag of ze klaar zijn 
        let stop = true;
        for (const updatable of this.#updatables){
            updatable.tick(timestamp);
            stop = stop&&updatable.arrived;

        }
        //is alles geree stopdan het aanroepen van requestAnimationFrame
        if(!stop){
            window.requestAnimationFrame(t=>{this.tick(t)})
        }
        else{
            console.log('klok gestopt');
        }
        
    }
    /**
     * abstracte methode wordt geset na instantiatie. middels een aangeboden methode,
     * die zal vervolgens aangeroepen worden. De klok kan nietweten hoe updatables gemaaakt worden. 
     * Hij vraagt in zijn tck methode elke 1500 ms een nieuw object om te animeren
     */
     retrieveUpdatable(){
        throw new Error("override this method");
    }
    addUpdatable(html){
        this.#updatables.push(html);
    }
}