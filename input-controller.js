export class InputController {
    constructor(actionsToBind, target){
        this.enabled = false;
        this.focused = true;
        this.ACTION_ACTIVATED ="input-controller:action-activated";
        this.ACTION_DEACTIVATED = "input-controller:deactivate";
        this.actions = {};
        this.target=null;
        this.keyStatus = {};
        this.actionStatus = {};
        this._helderKeyDown=this._helderKeyDown.bind(this);
        this._helderKeyUp=this._helderKeyUp.bind(this);

        if(actionsToBind){
            this.bindActions(actionsToBind)
        }
        if(target){
            this.attach(target)
        }
        
    }
    bindActions(actionsToBind){
        this.actions
        Object.assign(this.actions,actionsToBind)
        for (let name in actionsToBind){
            this.actionStatus[name] = false;
            if(actionsToBind[name].enabled===undefined){
                actionsToBind[name].enabled = true;
            }
        }
    }
    enableAction(actionName){
        if(!this.actions[actionName])return
        this.actions[actionName].enabled=true 
    }
    disableAction(actionName){
        if(!this.actions[actionName])return
        this.actions[actionName].enabled=false
        if(this.actionStatus[actionName]){
            this.actionStatus[actionName]=false
        }
    }
    attach(target, dontEnable){
         console.log("attach")
        if(this.target){
            this.detach()
        }
        this.target=target
        this.focused=true
        console.log(this.target)
        if(!dontEnable){
            this.enabled = true;
        }
        document.addEventListener('keydown', this._helderKeyDown)
        document.addEventListener('keyup', this._helderKeyUp)
    }
    detach(){
        console.log("detach")
        if(!this.target) return
        document.removeEventListener('keydown', this._helderKeyDown)
        document.removeEventListener('keyup', this._helderKeyUp)
        this.target=null;
        this.enabled = false;
        this.keyStatus = {};
        this.actionStatus = {};
        this.focused=false;
    }
    isActionActive(actionName){
        if(!this.actions[actionName]) return false
        if(!this.actions[actionName].enabled)return false
        const action = this.actions[actionName]
        let keyActive = false
            for (let key of action.keys){
                if(this.keyStatus[key]){
                    keyActive = true
                    break
                }
            }
        
        return keyActive
    }
    isKeyPressed(keyCode){
        return this.keyStatus[keyCode]||false
    }

    _helderKeyDown(event){
        if(!this.enabled || !this.focused) return
        console.log('KeyDown')
        const keyCode = event.keyCode;
        this.keyStatus[keyCode] = true
        for(let actionName in this.actions){
            const action = this.actions[actionName];
            if(!action.enabled)continue

            if(!action.keys.includes(keyCode))continue
            if(!this.actionStatus[actionName]){
                this.actionStatus[actionName]=true
                this._dispatchEvent(this.ACTION_ACTIVATED, actionName) 
            }
        }
    }
    _helderKeyUp(event){
        if(!this.enabled || !this.focused) return
        console.log('KeyUp')
        const keyCode = event.keyCode;
        this.keyStatus[keyCode] = false
        for(let actionName in this.actions){
            const action = this.actions[actionName];
            if(!action.enabled) continue
            if(!action.keys.includes(keyCode))continue

            let allKey = true

            for (let key of action.keys){
                if(this.keyStatus[key]){
                    allKey = false
                    break
                }
            }
            if(allKey && this.actionStatus[actionName]){
                this.actionStatus[actionName] = false
            }

            if(action.enabled){
                this._dispatchEvent(this.ACTION_DEACTIVATED, actionName)
            }
            
        }
    }
    _dispatchEvent(name, action){
        const event = new CustomEvent(name,{
            detail:{
                action: action
            },
            bubbles: true
        })
        this.target.dispatchEvent(event)
    }
}