const DnD = {
  dragEl: null,
  
  onDragStart: function(e) {
    this.classList.add("drag--moving");
    DnD.dragEl = this;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
  },

  onDragOver: function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = "move";
    return false;
  },

  onDragEnter: function(e) {
    this.classList.add("drag--hover");
  },

  onDragLeave: function(e) {
    this.classList.remove("drag--hover");
  },

  onDrop: function(e) {
    if (e.stopPropagation) e.stopPropagation();
    DnD.dragEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");
    return false;
  },

  onDragEnd: function(e) {
    this.classList.remove("drag--moving");
    [].forEach.call(boxes, function(box) {
      box.classList.remove("drag--hover");
    });
  }
};


const randomNums = () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let i = array.length,
    j = 0,
    temp;
  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};


const randomNumsArray = randomNums();

const boxes = document.querySelectorAll(".grid-item[draggable]");


[].forEach.call(boxes, function(box, index) {
  box.textContent = randomNumsArray[index];

  box.addEventListener("dragstart", DnD.onDragStart, false);
  box.addEventListener("dragenter", DnD.onDragEnter, false);
  box.addEventListener("dragover", DnD.onDragOver, false);
  box.addEventListener("dragleave", DnD.onDragLeave, false);
  box.addEventListener("drop", DnD.onDrop, false);
  box.addEventListener("dragend", DnD.onDragEnd, false);
});
