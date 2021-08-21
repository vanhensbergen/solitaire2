export default class RoleUpHandler{
    #piles;
    constructor(piles){
        this.#piles = piles;
        window.alert("ik ga het spel oprollen volautomatisch straks met "+this.#piles.length)
    }
}