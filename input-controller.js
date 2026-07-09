export class InputController {
    static ACTION_ACTIVATED ="input-controller:action-activate";
    static ACTION_DEACTIVATED = "input-controller:deactivate";
    constructor(actionsToBind, target){
        this._enabled = false;
        this.focused = true;
        this.actions = {};
        this.target=null;

        this.actionStatus = {};
        this.plugins=[]

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
            for(let plugin in this.actionStatus){
                for(let name in this.actions){
                    if(this.actionStatus[plugin][name]==true){
                        this._dispatchEvent(InputController.ACTION_ACTIVATED, name) 
                    }
                }
            }
        }
        else{
            this._enabled = false
            for(let plugin in this.actionStatus){
                for(let name in this.actions){
                    if(this.actionStatus[plugin][name]==true){
                        this._dispatchEvent(InputController.ACTION_DEACTIVATED, name) 
                    }
                }
            }
        }
         
    }
    addPlagin(plugin, pluginName){
        this.plugins.push(plugin)
        plugin.init(this)
        let allAction = Object.fromEntries(Object.keys(this.actions).map(key=>[key,false]))
        this.actionStatus[pluginName]=allAction

    }
    removePlagin(plugin,pluginName){
        plugin.disable()
        this.plugins = this.plugins.filter(namePlugin => namePlugin!==plugin)
        delete this.actionStatus[pluginName]
    }

    bindActions(actionsToBind){
        Object.assign(this.actions,actionsToBind)
        for (let name in actionsToBind){
            if(actionsToBind[name].enabled===undefined){
                actionsToBind[name].enabled = true;
            }
        }
    }
    enableAction(actionName){
        if(!this.actions[actionName])return
        this.actions[actionName].enabled=true 
        for(let plugin in this.actionStatus){
            this.actionStatus[plugin][actionName]=false
        }
    }
    disableAction(actionName){
        if(!this.actions[actionName])return
        this.actions[actionName].enabled=false
         for(let plugin in this.actionStatus){
            this.actionStatus[plugin][actionName]=false
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
        this.focused=false;
        for(let plugin in this.actionStatus){
            for(let name in this.actions){
                this.actionStatus[plugin][name]=false
            }
        }
    }
    isActionActive(actionName){
        if(!this.actions[actionName]) return false
        if(!this.actions[actionName].enabled)return false

       return true
    }
    // isKeyPressed(keyCode){
    //     return this.keyStatus[keyCode]||false
    // }
    _activateAction(actionName, pluginName){
        let inAll = true
        for(let plugin in this.actionStatus){
            if(this.actionStatus[plugin][actionName]==true){
                inAll=false
            }
        }
        if(inAll){
            this._dispatchEvent(InputController.ACTION_ACTIVATED, actionName) 
        }
        this.actionStatus[pluginName][actionName] = true
        

    }
    _deactivateAction(actionName, pluginName){
        let inAll=true
        for(let plugin in this.actionStatus){
            if(plugin!==pluginName && this.actionStatus[plugin][actionName]==true){
                inAll=false
            }
        }
        if(inAll){
            this._dispatchEvent(InputController.ACTION_DEACTIVATED, actionName)
        }
        this.actionStatus[pluginName][actionName] = false 
    }
    _dispatchEvent(name, action){
        if (this.target===null)return 
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