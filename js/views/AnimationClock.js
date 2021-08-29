export default class AnimationClock{

    #updatables;

    constructor(){
        this.#updatables = [];
    }
    start(){
        window.requestAnimationFrame(t=>{this.tick(t)})
    }


    tick(timestamp){
        let stop = true;
        for (const updatable of this.#updatables){
            updatable.tick(timestamp);
            stop = stop&&updatable.arrived;

        }
        if(!stop){
            window.requestAnimationFrame(t=>{this.tick(t)})
        }
        else{
            console.log('klok gestopt');
        }
        
    }

    addUpdatable(html){
        this.#updatables.push(html);
    }
}