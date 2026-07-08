export class KeyborbPlugin{
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
       
        const keyCode = event.keyCode;
        this.keyStatus[keyCode] = true

        for(let actionName in this.controller.actions){
            const action = this.controller.actions[actionName];
            console.log('/')
            console.log(this.controller.enabled )
            console.log(action.enabled )
            console.log(this.controller.focused )
            if(!this.controller.enabled || !action.enabled || !this.controller.focused)continue 
            console.log('Down') 
            if(!action.keys.includes(keyCode))continue 
            
            let allKey = true

            for (let key of action.keys){
                if(key!== keyCode && this.keyStatus[key]===true ){
                    allKey = false
                    break
                }
            }
            if(allKey){
                this.controller._activateAction(actionName,'keybord')
            }
           
        }
    }
    _handleKeyUp(event){
        const keyCode = event.keyCode;
        this.keyStatus[keyCode] = false
        for(let actionName in this.controller.actions){
            const action = this.controller.actions[actionName];
            if(!action.enabled) continue
            if(!action.keys.includes(keyCode))continue

            let allKey = true

            for (let key of action.keys){
                if(this.keyStatus[key]===true){
                    allKey = false
                    break
                }
            }
            if(allKey){
                this.controller._deactivateAction(actionName,'keybord')
            }
  
        }
    }
}