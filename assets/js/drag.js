
let foo = document.querySelector('#foo')

var 
pos1 = 0, 
pos2 = 0, 
pos3 = 0, 
pos4 = 0

foo.addEventListener('dragstart', dragStart_t)
document.querySelector('.areaFoo').addEventListener('dragover', dragOver_t)
document.querySelector('.areaFoo').addEventListener('drop', drop_t)

foo.addEventListener('mousedown', dragMouseDown)

let itemFoo
  
function dragStart_t(e){
  itemFoo = e.target
}
function dragOver_t(e){
  e.preventDefault()
}
function drop_t(e){
  e.currentTarget.appendChild(itemFoo)
}

function dragMouseDown(e) {
  pos3 = e.clientX
  pos4 = e.clientY

  document.onmousemove = elementDrag;
  document.onmouseup = closeDragElement;
}

function elementDrag(e) {
  e.preventDefault();

  pos1 = (pos3 - e.clientX)
  pos2 = (pos4 - e.clientY)

  pos3 = (e.clientX)
  pos4 = (e.clientY)

  foo.style.top = (foo.offsetTop - pos2) + "px";
  foo.style.left = (foo.offsetLeft - pos1) + "px";
}

function closeDragElement() {
  document.onmouseup = null;
  document.onmousemove = null;
}