export class MousePlugin{
    constructor(){
        this.controller=null
        this.buttonStatus = {};
        this._handleMouseDown=this._handleMouseDown.bind(this);
        this._handleMouseUp=this._handleMouseUp.bind(this);
    }
    init(controller){
        this.controller=controller
        
        document.body.addEventListener('mousedown', this._handleMouseDown)
        document.body.addEventListener('mouseup', this._handleMouseUp)
    }
    disable(){
        document.body.removeEventListener('mousedown', this._handleMouseDown)
        document.body.removeEventListener('mouseup', this._handleMouseUp)
    }
    _handleMouseDown(event){
        const buttonId = event.target.id;
        this.buttonStatus[buttonId] = true

        for(let actionName in this.controller.actions){
            const action = this.controller.actions[actionName];
            if(!this.controller.enabled || !action.enabled || !this.controller.focused)continue 
            if(action.button!==buttonId)continue 
            this.controller._activateAction(actionName,'mouse')
        }
    }
    _handleMouseUp(event){
        const buttonId = event.target.id;
        this.buttonStatus[buttonId] = false
        for(let actionName in this.controller.actions){
            const action = this.controller.actions[actionName];
            if(!this.controller.enabled || !action.enabled || !this.controller.focused) continue
            if(action.button!==buttonId)continue
            
            this.controller._deactivateAction(actionName,'mouse')
        }
    }
}