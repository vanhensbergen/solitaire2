export default class AnimatedHTML{
    #html;
    #delay// in millisecs
    #startTime
    #arrived;
    
    constructor(html,delay){
        this.#html = html;
        this.#delay = delay;
        this.#startTime = null;
        this.#arrived = false;
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
            if(this.#startTime===null){
                this.#startTime = timestamp+this.#delay;
            }
            if(timestamp>this.#startTime){
                this.left -= Math.sign(this.left);
                this.top -= Math.sign(this.top)
                this.#arrived = Math.abs(this.left)<=1&&Math.abs(this.top)<=1;
            }
           
        }
        
    }

    get arrived(){
        return this.#arrived;
    }
}