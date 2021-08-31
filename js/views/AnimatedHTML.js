export default class AnimatedHTML{
    #html;
    #arrived;
    #startTime;
    #startLeft;
    #startTop;
    static #TRAVEL_TIME = 6

    
    constructor(html){
        this.#html = html;
        this.#arrived = false;
        
        this.#startLeft = this.left;
        this.#startTop = this.top;
        this.#startTime = null;
    }

    
    set left(value){
        this.#html.style.left=value+"px";
    }
    set top(value){
        this.#html.style.top = value +"px";
    }
    get top(){
        return Number.parseInt(this.#html.style.top);
    }
    get left(){
        return Number.parseInt(this.#html.style.left)
    }

    tick(timestamp){
        if(!this.arrived){
            if(this.#startTime === null){
                this.#startTime = timestamp
            }
            let activeTime = (timestamp - this.#startTime)/1000;
            this.top = this.#startTop*(1-activeTime/AnimatedHTML.#TRAVEL_TIME)
            this.left = this.#startLeft*(1-activeTime/AnimatedHTML.#TRAVEL_TIME)
            this.#arrived = activeTime>AnimatedHTML.#TRAVEL_TIME
            if(this.arrrived){//voor de correcte landing activeTime may overshoot.
                this.left =0;
                this.top =0;
            }
        }
    }

    get arrived(){
        return this.#arrived;
    }
}