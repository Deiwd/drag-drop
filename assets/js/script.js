const q = el => document.querySelector(el);
const qAll = el => document.querySelectorAll(el);

let aside = q('#aside-main');
let windowArea = q('.windowArea');
let bodyArea = q('#body-content');

let stage = 0;
let scoreValue = 0;
let scoreError = 0;
let errorPoints = 0;


let hitPoints = 0;
let hitPoints_stars = q('.rating progress').max;

let order = {};
let orderCorrect;

let numberRandom = [];
let divItem_order = {};

let animateCanva = false;

let winSound = new Audio('assets/sound/winSound.ogg');
let dropSound = new Audio('assets/sound/dropSound.ogg');
let errorSound = new Audio('assets/sound/errorSound.ogg');

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
    } /* else {
        if(itemEl !== undefined){
            qAll('.area').forEach((el)=> {
                el.addEventListener('click', drop)
            })
        }
    } */
    

    windowArea.querySelector('button.repeat').addEventListener('click', restartGame)
    windowArea.querySelector('button.next').addEventListener('click', nextGame)
}

loadLevels()


async function divItem_random(){
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
            el.addEventListener('touchstart', mobile_start)
        })
    }

    verifyColumn()
    
    aside.style.width = `${(q('.dragArea').offsetWidth + 20)}px`;
    
    //DEBUGGING LOADING IN ITEM
    if(Object.keys(divItem_order).length < orderCorrect.length || 
    aside.querySelector('.dragArea').childElementCount < orderCorrect.length){
        restartGame()
    }
}


setTimeout(divItem_random, 300)


if(isTouch){

    q('.fullscreen').classList.add('show');
    windowArea.appendChild(q('footer#footer'));

    windowArea.querySelector('.content-windowArea').classList.add('stop-colorChange');
    windowArea.querySelector('.title--windowArea').classList.add('stop-colorChange');
}

q('.fullscreen > button').addEventListener('touchstart', toggleFullScreen)

window.addEventListener('webkitfullscreenchange', fullScreen_TouchDevice)

function toggleFullScreen() {
    let doc = document.documentElement;

    if((document.fullScreenElement && document.fullScreenElement !== null) || 
       (!document.mozFullScreen && !document.webkitIsFullScreen)){
            

            if(doc.requestFullScreen){
                doc.requestFullScreen();
            } else if(doc.mozRequestFullScreen){
                doc.mozRequestFullScreen();
            } else if(doc.webkitRequestFullScreen){
                doc.webkitRequestFullScreen();
            }
        }
}

function fullScreen_TouchDevice(){
    if(q('.fullscreen').classList.contains('show')){
        q('.fullscreen.show').classList.remove('show')
    } else {
        q('.fullscreen').classList.add('show')
    }
}


let itemEl;

function mobile_start(e){

    if(e.currentTarget.closest('.dragArea')){
        itemEl = e.currentTarget;

        qAll('.dragArea .item').forEach(el=> {
            if(el.classList.contains('selected')) el.classList.remove('selected');
        });
        
        itemEl.classList.add('selected');

        if(itemEl !== undefined){
            qAll('.area').forEach((el)=> {
                el.addEventListener('click', drop)
            })
        }
    }

}

function dragStart(e){

    e.currentTarget.style.opacity = '.5'
    itemEl = e.currentTarget
    /* itemEl_att = itemEl.getAttribute('data-name') */
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

    let itemEl_att, areaEl_att

    itemEl_att = itemEl.getAttribute('data-name');
    areaEl_att = e.currentTarget.getAttribute('data-name');
    

    if(e.currentTarget.querySelector('.item') == null && itemEl_att == areaEl_att)
    {
        e.currentTarget.appendChild(itemEl)

        order[areaEl_att] = itemEl_att

        dropSound.play()

        hitPoints = hitPoints + 5

        if(isTouch){
            itemEl.classList.remove('selected')
            itemEl = '';
        }
        
    } else {
        if(e.currentTarget.querySelector('.item') == null){

            errorSound.play()

            errorPoints++
            scoreError += 5

        }
        
    }

    verify_hitPoints()
    verify_errorPoints()

    scoreValue = (hitPoints - scoreError)

    let scoreColor;

    (scoreValue < 0) ? scoreColor = 'red' : scoreColor = ''

    bodyArea.querySelector('.scoreView').style.color = scoreColor
    bodyArea.querySelector('.scoreView').innerHTML = scoreValue

    if(windowArea.classList.contains('open')){
        aside.style.width = '0px';

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

        
        windowArea.querySelector('progress').value = starPoints
        windowArea.querySelector('.score .box').innerHTML = scoreValue
    }
}

function verify_hitPoints(){
    let checking = orderCorrect.every(el => {
       return (el === order[el]) ? true : false
    })

    if(checking){
        winSound.play()

        qAll('#body-content, #aside-main').forEach(el => el.classList.add('blur'))

        windowArea.querySelector('.content-windowArea').classList.add('window-win');
        windowArea.querySelector('.title--windowArea').classList.add('window-win');
        windowArea.querySelector('.title--windowArea').innerHTML = 'Congratulations';

        if(!isTouch){
            animateCanva = true

            setTimeout(()=> {
                q('#confetti-js').classList.add('show')
            }, 1)
        }

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

    numberRandom = [];
    divItem_order = {};

    qAll('#body-content, #aside-main').forEach(el => el.classList.remove('blur'))


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
    if(windowArea.querySelector('.content-windowArea').classList.contains('window-win')){
        windowArea.querySelector('.content-windowArea').classList.remove('window-win');
        windowArea.querySelector('.title--windowArea').classList.remove('window-win');
    } else if(windowArea.querySelector('.content-windowArea').classList.contains('window-los')){
        windowArea.querySelector('.content-windowArea').classList.remove('window-los');
        windowArea.querySelector('.title--windowArea').classList.remove('window-los');
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
        setTimeout(()=> restartGame(), 500)
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

        qAll('#body-content, #aside-main').forEach(el => el.classList.add('blur'))

        windowArea.querySelector('.content-windowArea').classList.add('window-los');
        windowArea.querySelector('.title--windowArea').classList.add('window-los');
        windowArea.querySelector('.title--windowArea').innerHTML = 'Gameover'

        windowArea.classList.add('open')

        setTimeout(()=> {
            q('.cuteGeometry.sad').classList.add('show')
        }, 100)
    }
}