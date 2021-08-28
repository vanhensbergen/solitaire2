export default class AnimationClock{

    #updatables;

    constructor(){
        this.#updatables = [];
    }
    start(){
        window.requestAnimationFrame(()=>this.tick(t))
    }


    tick(timestamp){
        console.log(timestamp)
        for (const updatable of this.#updatables){
            updatable.tick(timestamp);
        }
        window.requestAnimationFrame((t)=>this.tick(t))
    }

    addUpdatable(html){
        this.#updatables.push(html);
        console.log(html)
    }
}