export class InputController {
    static ACTION_ACTIVATED ="input-controller:action-activate";
    static ACTION_DEACTIVATED = "input-controller:deactivate";
    constructor(actionsToBind, target){
        this._enabled = false;
        this.focused = true;
        this.actions = {};
        this.target=null;

        this.actionStatus = {};
        this.plagins={}

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
    addPlagin(plagin){
        this.plagins.push(plagin)
        plagin.init(this)

    }
    removePlagin(plagin){
        this.plagins = this.plagins.filter(namePlagin => namePlagin!==plagin)
        plagin.disable()
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
        this.target.addEventListener('focus', this._handleFocus)
        this.target.addEventListener('blur', this._handleBlur)

    }
    detach(){
     
        if(!this.target) return
        this.target.removeEventListener('focus', this._handleFocus)
        this.target.removeEventListener('blur', this._handleBlur)

        this.target=null;
        this.enabled = false;
        this.actionStatus = {};
        this.focused=false;
    }
    isActionActive(actionName){
        if(!this.actions[actionName]) return false
        if(!this.actions[actionName].enabled)return false

        // const action = this.actions[actionName]
        // let keyActive = false
        //     for (let key of action.keys){
        //         if(this.keyStatus[key]){
        //             keyActive = true
        //             break
        //         }
        //     }
        
        // return keyActive
    }
    // isKeyPressed(keyCode){
    //     return this.keyStatus[keyCode]||false
    // }

    // 
    _activateAction(actionName){
        if(!this.enabled || !this.focused) return 
        if(!this.actionStatus[actionName]){
            this.actionStatus[actionName]=true
            this._dispatchEvent(InputController.ACTION_ACTIVATED, actionName) 
        }
    }
    _deactivateAction(actionName){
        if( this.actionStatus[actionName] ){
            this.actionStatus[actionName] = false
            if(this.enabled && this.focused){
                this._dispatchEvent(InputController.ACTION_DEACTIVATED, actionName)
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