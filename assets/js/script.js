const q = el => document.querySelector(el)
const qAll = el => document.querySelectorAll(el)

let aside = q('#aside-main')
let windowArea = q('.windowArea')
let bodyArea = q('#body-content')

let stage = 0
let errorPoints = 0
let scoreError = 0
let scoreValue = 0

let hitPoints = 0
let hitPoints_stars = q('.rating progress').max

let order = {}
let orderCorrect;

let numberRandom = []
let divItem_order = {}

let animateCanva = false

function isTouchDevice(){
    return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0))
}

const isTouch = isTouchDevice();

async function loadLevels(){

    let req = await fetch('assets/js/levels.json')
    levelGame = await req.json()

    orderCorrect = levelGame[stage].orderCorrect

    for(let i in orderCorrect){
    
        numberRandom.push( Math.floor(Math.random() * 100) )

        divItem_order[numberRandom[i]] = orderCorrect[i]
        
        let 
        divArea = document.createElement('div');
        divArea.setAttribute('class', 'area');
        divArea.classList.add(orderCorrect[i]);
        divArea.setAttribute('data-name', orderCorrect[i]);
    
        order[orderCorrect[i]] = null;
        
        q('.dropArea').appendChild(divArea);
    }

    if(!isTouch){
        qAll('.area').forEach((el)=>{
            el.addEventListener('dragover', dragOver)
            el.addEventListener('dragleave', dragLeave)
            el.addEventListener('drop', drop)
        })
    } else {
        qAll('.area').forEach((el)=> {
            el.addEventListener('click', mobile_drop)
        })
    }
    

    windowArea.querySelector('button.repeat').addEventListener('click', restartGame)
    windowArea.querySelector('button.next').addEventListener('click', nextGame)
}

loadLevels()


function divItem_random(){
    aside.querySelector('.dragArea').innerHTML = ''
    
    for(let i in divItem_order){
        
        let 
        divItem = document.createElement('div');

        divItem.setAttribute('class', 'item');
        divItem.setAttribute('data-name', divItem_order[i]);

        let
        svgShape = q(`.format-Shape .${divItem_order[i]}--shape`);
        svgShape = svgShape.cloneNode(true);

        divItem.appendChild(svgShape);

        aside.querySelector('.dragArea').appendChild(divItem);
    }

    if(!isTouch){
        qAll('.item').forEach((el)=>{
            el.setAttribute('draggable', 'true')
            el.addEventListener('dragstart', dragStart)
            el.addEventListener('dragend', dragEnd)
        })
    } else {
        qAll('.item').forEach((el)=>{
            el.addEventListener('click', mobile_start)
        })
    }

    verifyColumn()

    let paddingArea = 20
    
    aside.style.width = `calc(${q('.dragArea').offsetWidth}px + ${paddingArea}px)`
    
    //DEBUGGING LOADING IN ITEM
    if(Object.keys(divItem_order).length < orderCorrect.length){

        restartGame()
        //window.location.reload(true)
    }
}


setTimeout(divItem_random, 300)


let itemEl;

function mobile_start(e){
    itemEl = e.currentTarget;

    qAll('.dragArea .item').forEach(el=> {
        if(el.classList.contains('selected')) el.classList.remove('selected');
    });
    
    itemEl.classList.add('selected');
}
function mobile_drop(){
    console.log('soltou');
}


if(window.innerWidth <= 640){

    q('body').appendChild(q('footer#footer'))
}

function dragStart(e){

    e.currentTarget.style.opacity = '.5'
    itemEl = e.currentTarget
    itemEl_att = itemEl.getAttribute('data-name')
}

function dragEnd(e){
    e.currentTarget.style.opacity = '1'
    itemEl = ''
}

function dragOver(e){

    if(e.currentTarget.querySelector('.item') == null){
        e.preventDefault()
    }

    e.currentTarget.classList.add('over')
}

function dragLeave(e){
    e.currentTarget.classList.remove('over')
}

function drop(e){
    e.currentTarget.classList.remove('over')

    let 
    itemEl_att = itemEl.getAttribute('data-name'),
    areaEl_att = e.currentTarget.getAttribute('data-name')

    if(e.currentTarget.querySelector('.item') == null && itemEl_att == areaEl_att)
    {
        e.currentTarget.appendChild(itemEl)

        order[areaEl_att] = itemEl_att

        new Audio('dropSound.mp3').play()

        hitPoints = hitPoints + 5
        
    } else {
        new Audio('errorSound.mp3').play()

        errorPoints++
        scoreError += 5
    }

    verify_hitPoints()
    verify_errorPoints()

    scoreValue = (hitPoints - scoreError)

    let scoreColor;

    (scoreValue < 0) ? scoreColor = 'red' : scoreColor = ''

    bodyArea.querySelector('.scoreView').style.color = scoreColor
    bodyArea.querySelector('.scoreView').innerHTML = scoreValue

    if(windowArea.classList.contains('open')){
        aside.style.width = '0px'

        let starPoints;

        (scoreValue < 0) ? scoreValue = 0 : scoreValue;

        switch(scoreValue){
            case 00: starPoints = 0; break;
            case 05: starPoints = 1.5; break;
            case 10: starPoints = 2.6; break;
            case 15: starPoints = 4.4; break;
            case 20: starPoints = 5; break;
        }
        if(orderCorrect.length > 4){
            switch(scoreValue){
                case 00: starPoints = 0; break;
                case 05: starPoints = 0.5; break;
                case 10: starPoints = 1; break;
                case 15: starPoints = 1.5; break;
                case 20: starPoints = 2; break;
                case 25: starPoints = 3; break;
                case 30: starPoints = 3.5; break;
                case 35: starPoints = 4; break;
                case 40: starPoints = 5; break;
            }
        }

        
        console.log(scoreValue)
        windowArea.querySelector('progress').value = starPoints
        windowArea.querySelector('.score .box').innerHTML = scoreValue
    }
}

function verify_hitPoints(){
    let checking = orderCorrect.every(el => {
       return (el === order[el]) ? true : false
    })

    if(checking){
        new Audio('winSound.mp3').play()


        bodyArea.classList.add('blur')

        animateCanva = true

        windowArea.querySelector('.title--windowArea').innerHTML = 'Congratulations'

        setTimeout(()=> {
            q('#confetti-js').classList.add('show')
        }, 1)

        windowArea.classList.add('open')

        setTimeout(()=> q('.cuteGeometry.happy').classList.add('show'), 100)
    }

    if(animateCanva){
        var confettiSettings = { target: 'confetti-js' };
        var confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
    }
}

function restartGame(){
    for(let i in order){ order[i] = null }

    bodyArea.classList.remove('blur')

    numberRandom = []
    divItem_order = {}

    for(let i in orderCorrect){
        numberRandom.push( Math.floor(Math.random() * 100) )

        divItem_order[numberRandom[i]] = orderCorrect[i]
    }
    
    divItem_random()

    qAll('.area').forEach(el => el.innerHTML = '')

    if(windowArea.classList.contains('open')){
        q('.cuteGeometry.happy').classList.remove('show')
        q('.cuteGeometry.sad').classList.remove('show')

        windowArea.classList.remove('open')
    }
    if(q('#confetti-js').classList.contains('show')){
        q('#confetti-js.show').classList.remove('show')
    }

    hitPoints = 0
    scoreValue = 0 
    errorPoints = 0
    scoreError = 0
    bodyArea.querySelector('.scoreView').innerHTML = 0
    
}

function nextGame(){
    stage++

    if(levelGame[stage] !== undefined){
        
        aside.querySelector('.dragArea').innerHTML = ''
        bodyArea.querySelector('.dropArea').innerHTML = ''

        loadLevels()
        setTimeout(()=> restartGame(), 100)
    } 
}

function verifyColumn(){
    if(orderCorrect.length > 4){
        q('.dragArea').classList.add('towColumn')
    } else {
        q('.dragArea').classList.remove('towColumn')
    }
}

function verify_errorPoints(){
    if(errorPoints > 4){

        bodyArea.classList.add('blur')

        windowArea.querySelector('.title--windowArea').innerHTML = 'Gameover'

        windowArea.classList.add('open')

        setTimeout(()=> {
            q('.cuteGeometry.sad').classList.add('show')
        }, 100)
    }
}