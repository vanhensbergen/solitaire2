export default class AnimatedHTML{
    #html;
    #delay// in millisecs
    #startTime
    
    constructor(html,delay){
        this.#html = html;
        this.#delay = delay;
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
        if(this.#startTime===null){
            this.#startTime = timeStamp+this.#delay;
        }
        if(timestamp>this.#startTime){
            this.left -= Math.sign(this.left)*10;
            this.top -= Math.sign(this.top)*10
        }
    }
}