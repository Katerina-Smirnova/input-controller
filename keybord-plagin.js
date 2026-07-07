export class KeyborbPlagin{
    constructor(){
        this.controller=null
        this.keyStatus = {};
        this._handleKeyDown=this._handleKeyDown.bind(this);
        this._handleKeyUp=this._handleKeyUp.bind(this);
    }
    init(controller){
        this.controller=controller
        
        document.addEventListener('keydown', this._handleKeyDown)
        document.addEventListener('keyup', this._handleKeyUp)
    }
    disable(){
        document.removeEventListener('keydown', this._handleKeyDown)
        document.removeEventListener('keyup', this._handleKeyUp)
    }
   

    _handleKeyDown(event){
        // if(!this.controller.enabled || !this.controller.focused) return 
        const keyCode = event.keyCode;
        this.keyStatus[keyCode] = true

        for(let actionName in this.controller.actions){
            const action = this.controller.actions[actionName];
            if(!action.controller.enabled)continue // запрещенно действие 
            if(!action.keys.includes(keyCode))continue 
            this.controller._activateAction(actionName)
        }
    }
    _handleKeyUp(event){
        const keyCode = event.keyCode;
        this.keyStatus[keyCode] = false

        for(let actionName in this.actions){
            const action = this.controller.actions[actionName];
            if(!action.enabled) continue
            if(!action.keys.includes(keyCode))continue

            let allKey = true

            for (let key of action.keys){
                if(this.keyStatus[key]){
                    allKey = false
                    break
                }
            }
            if(allKey){
                this.controller._deactivateAction()
            }
  
        }
    }
}