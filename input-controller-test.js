import{ InputController } from './input-controller.js'
const container = document.querySelector('.container')

let square = document.createElement('div');
square.classList.add('square');
square.style.width = '100px';
square.style.height = '100px';
square.style.backgroundColor = 'blue';
square.setAttribute('tabindex','0')
container.appendChild(square);
square.focus()
let positionX = 0;

let actionsToBind = {
    "left": { 
		keys: [37,65], 
        enabled: false
	},
    "right":{
        keys: [39,68], 
        enabled: false
    },
    // "jump":{
    //     keys: [32], 
    //     enabled: false
    // }
}
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
    right: (element) => {
        positionX-=10
        element.style.transform = `translateX(${positionX}px)`;
    }
}

const controller = new InputController(actionsToBind, container)

const buttonAttach = document.querySelector('.attach')
const buttonDetach = document.querySelector('.detach')
const buttonActivation = document.querySelector('.activation')
const buttonDeactivation = document.querySelector('.deactivation')
const buttonNew=document.querySelector('.newAction')

buttonAttach.addEventListener('click', ()=>{
    controller.attach(square,false)
})
buttonDetach.addEventListener('click', ()=>{
    controller.detach()
}) 
buttonActivation.addEventListener('click', ()=>{
    controller.enabled=true

})
buttonDeactivation.addEventListener('click', ()=>{
    controller.enabled=false
})

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


buttonNew.addEventListener('click', ()=>{
    const form = document.createElement('form');
    const inputName = document.createElement('input');
    const inputKey = document.createElement('input');
    const inputActivetion = document.createElement('input');
    const inputDeactivetion = document.createElement('input');
    const button = document.createElement('button')
    inputName.type = 'text';
    inputName.placeholder = 'Введите название действия';
    inputKey.type = 'text';
    inputKey.placeholder = 'Введите номера кнопок';
    inputActivetion.type = 'text';
    inputActivetion.placeholder = 'Введите код для дейстия';
    inputDeactivetion.type = 'text';
    inputDeactivetion.placeholder = 'Введите код для окончания действия';

    button.type = 'submit';
    button.textContent = 'Отправить';
    form.appendChild(inputName);
    form.appendChild(inputKey);
    form.appendChild(inputActivetion);
    form.appendChild(inputDeactivetion);
    form.appendChild(button);
    container.appendChild(form);
    form.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const nameValue = inputName.value.trim();
    const keysValue = inputKey.value.split(',').map(Number);

    actionsToBind[nameValue] = {
        keys: keysValue, 
            enabled: false,
    }
    const userCode = inputActivetion.value; 
   activationAction[nameValue] = new Function('element', userCode);

    const userDeactivationCode = inputDeactivetion.value;
    deactivationAction[nameValue]= new Function('element', userDeactivationCode);
    form.remove();
    const newAction = {
        [nameValue] : {
            keys: keysValue, 
            enabled: false,
        }
    }
    controller.bindActions(newAction)
    controller.enableAction(nameValue)
    renderCheckboxes();

});

})

const containerList = document.createElement('div');
container.append(containerList)

containerList.addEventListener('change', (e) => {
  
    if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
        console.log(e.target.value)
        if (e.target.checked) {
            controller.enableAction(e.target.value);
            
        } else {
            controller.disableAction(e.target.value);
            console.log(actionsToBind[e.target.value].enabled)
        }
    }
})

function renderCheckboxes() {

    containerList.innerHTML = ''; 

    for (let action in actionsToBind) {
        const itemDiv = document.createElement('div');
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
    }
}
renderCheckboxes();