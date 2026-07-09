export class MousePlugin{
    constructor(){
        this.callback=null
        this.buttonStatus = {};
        this._handleMouseDown=this._handleMouseDown.bind(this);
        this._handleMouseUp=this._handleMouseUp.bind(this);
    }
    init(callback){
        this.callback=callback
        
        document.body.addEventListener('mousedown', this._handleMouseDown)
        document.body.addEventListener('mouseup', this._handleMouseUp)
    }
    disable(){
        document.body.removeEventListener('mousedown', this._handleMouseDown)
        document.body.removeEventListener('mouseup', this._handleMouseUp)
    }
    _handleMouseDown(event){
        const isEnabled = this.callback.isEnabled();
        const isFocused = this.callback.isFocused(); 
        const actions = this.callback.getActions();

        const buttonId = event.target.id;
        this.buttonStatus[buttonId] = true

        for(let actionName in actions){
            const action = actions[actionName];
            if(!isEnabled || !action.enabled || !isFocused)continue 
            if(action.button!==buttonId)continue 
            this.callback.activateAction(actionName)
        }
    }
    _handleMouseUp(event){
        const isEnabled = this.callback.isEnabled();
        const isFocused = this.callback.isFocused(); 
        const actions = this.callback.getActions();

        const buttonId = event.target.id;
        this.buttonStatus[buttonId] = false
        for(let actionName in actions){
            const action = actions[actionName];
            if(!isEnabled || !action.enabled || !isFocused) continue
            if(action.button!==buttonId)continue
            
            this.callback.deactivateAction(actionName)
        }
    }
}