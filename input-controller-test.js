import{ InputController } from './input-controller.js'
import{KeyborbPlugin } from './keybord-plugin.js'
import { MousePlugin } from './mouse-plugin.js';
const container = document.querySelector('.container')
const keyboardPlugin = new KeyborbPlugin(); 
const mousePlugin = new MousePlugin();
let positionX = 0;
let isClicksBlocked = false;
const buttonAttach = document.querySelector('.attach')
const buttonDetach = document.querySelector('.detach')
const buttonActivation = document.querySelector('.activation')
const buttonDeactivation = document.querySelector('.deactivation')
const buttonNew=document.querySelector('.newAction')


let actionsToBind = {
    "left": { 
		keys: [37,65], 
        button: 'btn-left',
        enabled: false
	},
    "right":{
        keys: [39,68], 
        button: 'btn-right',
        enabled: false
    },
    // "jump":{
    //     keys: [32], 
    //     enabled: false
    // }
}
const containerButon = document.createElement('div')
container.append(containerButon)
function renderButton(){
    for (let button in actionsToBind){
        const buttonElement = document.createElement('button')
        buttonElement.textContent=button
        buttonElement.classList.add(`${button}`)
        buttonElement.id=`btn-${button}`
        containerButon.append(buttonElement)
    }
}
renderButton()

const activationAction = {
    left: (element) => {
        positionX-=10
        element.style.transform = `translateX(${positionX}px)`;
    },
    right: (element) => {
        positionX+=10
        element.style.transform = `translateX(${positionX}px)`;
    }
}
const deactivationAction ={
     left: (element) => {
        positionX+=10
        element.style.transform = `translateX(${positionX}px)`;
    },
    right: (element) => {
        positionX-=10
        element.style.transform = `translateX(${positionX}px)`;
    }
}
const plugins = {
    "keybord": {
        plugin:keyboardPlugin,
        eventActive: ()=> keybordActvate(),
        eventDeactivate:()=> keybordDeactvate()
    },
    "mouse": {
        plugin:mousePlugin,
        eventActive: ()=> mouseActivate(),
        eventDeactivate:()=> mouseDeactivate()
    }

}
const containerListPlagins = document.createElement('div')
containerListPlagins.innerHTML = ''; 

for(let plugin in plugins ){
    const itemDiv = document.createElement('div');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `${plugin}`; 
    checkbox.value = plugin;

    const label = document.createElement('label');
    label.htmlFor = `item-${plugin}`; 
    label.textContent = ` ${plugin}`; 

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(label);
    containerListPlagins.appendChild(itemDiv);
}

containerListPlagins.addEventListener('change', (e)=>{
     if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
        let currentPlugin = plugins[e.target.value]
        if (e.target.checked) {
            controller.addPlagin(currentPlugin.plugin, e.target.value);
            currentPlugin.eventActive();         
        } else {
            controller.removePlagin(currentPlugin.plugin,e.target.value);
            currentPlugin.eventDeactivate();
        }
     }
})


container.append(containerListPlagins)
let square = document.createElement('div');
square.classList.add('square');
square.style.width = '100px';
square.style.height = '100px';
square.style.backgroundColor = 'blue';
square.setAttribute('tabindex','0')
container.appendChild(square);
square.focus()

const controller = new InputController(actionsToBind, null)

let selectedAction = -1
function keybordActvate(){
    document.addEventListener('keydown',keybordEvents)
}
function keybordDeactvate(){
    document.removeEventListener('keydown',keybordEvents)
}
function keybordEvents(event){
    const keyCode = event.keyCode;

    if(keyCode===49) {
        controller.attach(square,true); 
        return}
    if(keyCode===50) {controller.detach(); return}
    if(keyCode===51) {
        console.log(51)
        controller.enabled=true; 
        return}
    if(keyCode===52) {controller.enabled=false; return}

    if(keyCode===38){
        event.preventDefault();
        selectedAction = Math.min(0,selectedAction-1)

        renderCheckboxes()
    }
    if(keyCode===9){
        event.preventDefault();
        selectedAction=0
        renderCheckboxes()
    }
    if(keyCode===40){
        event.preventDefault();
        selectedAction = Math.max(Object.keys(actionsToBind).length-1, selectedAction+1)
        renderCheckboxes()
    }
    if(keyCode===13){
        event.preventDefault();
        if(selectedAction<0)return

        const keyActive = Object.keys(actionsToBind)
        let actionName = keyActive[selectedAction]

        if( actionsToBind[actionName].enabled){
            controller.disableAction(actionName);   
        }
        else{
            controller.enableAction(actionName);
        }
        renderCheckboxes()
    }
}
const handleAttach = () => {
    controller.attach(square, false);
    console.log('attach')
}
const handleDetach = () => controller.detach();
const handleActivate = () => controller.enabled = true;
const handleDeactivate = () => controller.enabled = false;

 function mouseActivate(){
    isClicksBlocked=true

    buttonAttach.addEventListener('click', handleAttach);
    buttonDetach.addEventListener('click', handleDetach);
    buttonActivation.addEventListener('click', handleActivate);
    buttonDeactivation.addEventListener('click', handleDeactivate)
 }
 function mouseDeactivate(){
    isClicksBlocked=false

    buttonAttach.removeEventListener('click', handleAttach);
    buttonDetach.removeEventListener('click', handleDetach);
    buttonActivation.removeEventListener('click', handleActivate);
    buttonDeactivation.removeEventListener('click', handleDeactivate);
 }

document.addEventListener(InputController.ACTION_ACTIVATED, (event) =>{
    const actionName = event.detail.action;
    if(activationAction[actionName]!==undefined){
        activationAction[actionName](event.detail.target)
    }
})
document.addEventListener(InputController.ACTION_DEACTIVATED, (event) =>{
    const actionName = event.detail.action;
    if(deactivationAction[actionName]!==undefined){
        deactivationAction[actionName](event.detail.target)
    }
})


// buttonNew.addEventListener('click', ()=>{
//     const form = document.createElement('form');
//     const inputName = document.createElement('input');
//     const inputKey = document.createElement('input');
//     const inputActivetion = document.createElement('input');
//     const inputDeactivetion = document.createElement('input');
//     const button = document.createElement('button')
//     inputName.type = 'text';
//     inputName.placeholder = 'Введите название действия';
//     inputKey.type = 'text';
//     inputKey.placeholder = 'Введите номера кнопок';
//     inputActivetion.type = 'text';
//     inputActivetion.placeholder = 'Введите код для дейстия';
//     inputDeactivetion.type = 'text';
//     inputDeactivetion.placeholder = 'Введите код для окончания действия';

//     button.type = 'submit';
//     button.textContent = 'Отправить';
//     form.appendChild(inputName);
//     form.appendChild(inputKey);
//     form.appendChild(inputActivetion);
//     form.appendChild(inputDeactivetion);
//     form.appendChild(button);
//     container.appendChild(form);
//     form.addEventListener('submit', function(event) {
//         event.preventDefault(); 
//         const nameValue = inputName.value.trim();
//         const keysValue = inputKey.value.split(',').map(Number);

//         actionsToBind[nameValue] = {
//             keys: keysValue, 
//                 enabled: false,
//         }
//         const userCode = inputActivetion.value; 
//     activationAction[nameValue] = new Function('element', userCode);

//         const userDeactivationCode = inputDeactivetion.value;
//         deactivationAction[nameValue]= new Function('element', userDeactivationCode);
//         form.remove();
//         const newAction = {
//             [nameValue] : {
//                 keys: keysValue, 
//                 enabled: false,
//             }
//         }
//         controller.bindActions(newAction)
//         controller.enableAction(nameValue)
//         renderCheckboxes();

//     });

// })

const containerList = document.createElement('div');
container.append(containerList)
containerList.addEventListener('click',(e)=>{
     if (!isClicksBlocked){
        e.preventDefault();
        e.stopPropagation();
     } 
})
containerList.addEventListener('change', (e) => {
   if (isClicksBlocked){
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            console.log(e.target.value)
            if (actionsToBind[e.target.value].enable) {
                controller.enableAction(e.target.value);
                
            } else {
                controller.disableAction(e.target.value);
                console.log(actionsToBind[e.target.value].enabled)
            }
        }
    }
})

function renderCheckboxes() {

    containerList.innerHTML = ''; 
    let index = 0

    for (let action in actionsToBind) {
        const itemDiv = document.createElement('div');
         if(index===selectedAction){
            itemDiv.style.background='black'
            itemDiv.style.color='white'
        }
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `item-${action}`; 
        checkbox.value = action;

        checkbox.checked = actionsToBind[action].enabled;

        const label = document.createElement('label');
        label.htmlFor = `item-${action}`; 
        label.textContent = ` ${action}`; 

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(label);
        containerList.appendChild(itemDiv);
        index++
    }
}
renderCheckboxes();
