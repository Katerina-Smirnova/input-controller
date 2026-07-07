export class InputController {
    static ACTION_ACTIVATED ="input-controller:action-activate";
    static ACTION_DEACTIVATED = "input-controller:deactivate";
    constructor(actionsToBind, target){
        this._enabled = false;
        this.focused = true;
        this.actions = {};
        this.target=null;
        this.keyStatus = {};
        this.actionStatus = {};
        this._handleKeyDown=this._handleKeyDown.bind(this);
        this._handleKeyUp=this._handleKeyUp.bind(this);
        this._handleFocus=this._handleFocus.bind(this)
        this._handleBlur=this._handleBlur.bind(this)
        if(actionsToBind){
            this.bindActions(actionsToBind)
        }
        if(target){
            this.attach(target)
        }
       
        
    }
    get enabled(){
        return this._enabled
    }
    set enabled(value){
        if(value){
            this._enabled=true
            for(let name in this.actions){
                if(this.actionStatus[name]==true){
                    this._dispatchEvent(InputController.ACTION_ACTIVATED, name) 
                }
            }
        }
        else{
            this._enabled = false
            for(let name in this.actions){
                if(this.actionStatus[name]==true){
                    this._dispatchEvent(InputController.ACTION_DEACTIVATED, name)
                }
            }
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
        this.actionStatus[actionName] = false
        for (let key of this.actions[actionName].keys){
            this.keyStatus[key]=false
        }
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
        document.addEventListener('keydown', this._handleKeyDown)
        document.addEventListener('keyup', this._handleKeyUp)
        this.target.addEventListener('focus', this._handleFocus)
        this.target.addEventListener('blur', this._handleBlur)

    }
    detach(){
     
        if(!this.target) return
        document.removeEventListener('keydown', this._handleKeyDown)
        document.removeEventListener('keyup', this._handleKeyUp)
        this.target.removeEventListener('focus', this._handleFocus)
        this.target.removeEventListener('blur', this._handleBlur)

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

    _handleKeyDown(event){
        if(!this.enabled || !this.focused) return 
  
        const keyCode = event.keyCode;
        this.keyStatus[keyCode] = true

        for(let actionName in this.actions){
            const action = this.actions[actionName];
            if(!action.enabled)continue
            if(!action.keys.includes(keyCode))continue
            if(!this.actionStatus[actionName]){
                this.actionStatus[actionName]=true
                this._dispatchEvent(InputController.ACTION_ACTIVATED, actionName) 
            }
        }
    }
    _handleKeyUp(event){
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
            if(allKey && this.actionStatus[actionName] ){
                this.actionStatus[actionName] = false
                if(this.enabled && this.focused){
                    this._dispatchEvent(InputController.ACTION_DEACTIVATED, actionName)
                }
                
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
    _handleFocus(event){
        this.focused=true
        
    }
    _handleBlur(event){
        this.focused=false
        
    }

}