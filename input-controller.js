export const ACTION_ACTIVATED ="input-controller:action-activate";
export const ACTION_DEACTIVATED = "input-controller:deactivate";
export class InputController {
    constructor(actionsToBind, target){
        this.enabled = false;
        this.focused = true;
        this.actions = {};
        this.target=null;
        this.keyStatus = {};
        this.actionStatus = {};
        this._helderKeyDown=this._helderKeyDown.bind(this);
        this._helderKeyUp=this._helderKeyUp.bind(this);
        this._helderFocus=this._helderFocus.bind(this)
        this._helderBlur=this._helderBlur.bind(this)


        if(actionsToBind){
            this.bindActions(actionsToBind)
        }
        if(target){
            this.attach(target)
        }
        
    }
    bindActions(actionsToBind){
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
        if(this.target){
            this.detach()
        }
        this.target=target
        this.focused=true

        if(!dontEnable){
            this.enabled = true;
        }
        document.addEventListener('keydown', this._helderKeyDown)
        document.addEventListener('keyup', this._helderKeyUp)
        this.target.addEventListener('focus', this._helderFocus)
        this.target.addEventListener('blur', this._helderBlur)

    }
    detach(){
     
        if(!this.target) return
        document.removeEventListener('keydown', this._helderKeyDown)
        document.removeEventListener('keyup', this._helderKeyUp)
        this.target.removeEventListener('focus', this._helderFocus)
        this.target.removeEventListener('blur', this._helderBlur)

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
  
        const keyCode = event.keyCode;
        this.keyStatus[keyCode] = true

        for(let actionName in this.actions){
            const action = this.actions[actionName];
            if(!action.enabled)continue
            if(!action.keys.includes(keyCode))continue
            if(!this.actionStatus[actionName]){
                this.actionStatus[actionName]=true
                this._dispatchEvent(ACTION_ACTIVATED, actionName) 
            }
        }
    }
    _helderKeyUp(event){
        if(!this.enabled || !this.focused) return
   
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
                this._dispatchEvent(ACTION_DEACTIVATED, actionName)
            }
            
        }
    }
    _dispatchEvent(name, action){
        const event = new CustomEvent(name,{
            detail:{
                target: this.target,
                action: action
            },
            bubbles: true
        })
        this.target.dispatchEvent(event)
    }
    _helderFocus(event){
        console.log('true')
        this.focused=true
        
    }
    _helderBlur(event){
        console.log('false')
        this.focused=false
        
    }

}