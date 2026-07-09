export class KeyborbPlugin{
    constructor(){
        this.callback=null
        this.keyStatus = {};
        this._handleKeyDown=this._handleKeyDown.bind(this);
        this._handleKeyUp=this._handleKeyUp.bind(this);
    }
    init(callback){
        this.callback=callback
        
        document.addEventListener('keydown', this._handleKeyDown)
        document.addEventListener('keyup', this._handleKeyUp)
    }
    disable(){
        document.removeEventListener('keydown', this._handleKeyDown)
        document.removeEventListener('keyup', this._handleKeyUp)
    }
   

    _handleKeyDown(event){  
        const isEnabled = this.callback.isEnabled();
        const isFocused = this.callback.isFocused(); 
        const actions = this.callback.getActions(); 

        const keyCode = event.keyCode;
        this.keyStatus[keyCode] = true

        for(let actionName in actions){
            const action = actions[actionName];
            if(!isEnabled || !action.enabled || !isFocused)continue  
            if(!action.keys.includes(keyCode))continue 
            
            let allKey = true

            for (let key of action.keys){
                if(key!== keyCode && this.keyStatus[key]===true ){
                    allKey = false
                    break
                }
            }
            if(allKey){
                this.callback.activateAction(actionName)
            }
        
        }
    }
    _handleKeyUp(event){
        const isEnabled = this.callback.isEnabled();
        const isFocused = this.callback.isFocused(); 
        const actions = this.callback.getActions(); 

        const keyCode = event.keyCode;
        this.keyStatus[keyCode] = false

        for(let actionName in actions){
            const action = actions[actionName];
             if(!isEnabled || !action.enabled || !isFocused)continue  
            if(!action.keys.includes(keyCode))continue

            let allKey = true

            for (let key of action.keys){
                if(this.keyStatus[key]===true){
                    allKey = false
                    break
                }
            }
            if(allKey){
                this.callback.deactivateAction(actionName)
            }
        }
    }
}