const head = document.getElementsByTagName('HEAD')[0]; 
const link = document.createElement('link');
link.rel = 'stylesheet'; 
link.type = 'text/css';
link.href = 'styles.css'; 
head.appendChild(link); 

const body = document.getElementsByTagName('BODY')[0]; 

const popoverActionsElement = document.createElement('div');
const popoverActionsListElement = document.createElement('div');
popoverActionsListElement.classList.add('actions-list');

const makeBoldActionElement = document.createElement('div');
makeBoldActionElement.innerHTML = 'B';
makeBoldActionElement.classList.add('action right');

const reverseActionElement = document.createElement('div');
reverseActionElement.innerHTML = 'R';
reverseActionElement.classList.add('action left');

popoverActionsListElement.appendChild(makeBoldActionElement);
popoverActionsListElement.appendChild(reverseActionElement);
popoverActionsElement.appendChild(popoverActionsListElement);
body.appendChild(popoverActionsElement);

const selectableTextArea = document.querySelectorAll('[contenteditable=true]');
const popoverActions = document.querySelector("#popover-actions");
const reverseBtn = document.querySelector("#popover-actions-reverse");
const boldBtn = document.querySelector("#popover-actions-bold");

let shiftLeft = 0;
let shiftRight = 0;

selectableTextArea.forEach(elem => {
  elem.addEventListener("mouseup", selectableTextAreaMouseUp);
  elem.addEventListener("keydown", selectableTextAreaKeyDown);
});

document.addEventListener("mousedown", documentMouseDown);

function clearSelection() {
  popoverActions.style.display = "none";
  popoverActions.classList.remove("btnEntrance");
  window.getSelection().empty();
}

function selectableTextAreaMouseUp(event) {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim();
  
  if (selectedText.length) { 
    const x = event.pageX;
    const y = event.pageY;
    const popoverActionsStyle = getComputedStyle(popoverActions)
    const popoverActionsWidth = Number(popoverActionsStyle.width.slice(0,-2));
    const popoverActionsHeight = Number(popoverActionsStyle.height.slice(0,-2));
    
    if (document.activeElement !== popoverActions) {
      popoverActions.style.left = `${x - popoverActionsWidth * 0.5}px`;
      popoverActions.style.top = `${y - popoverActionsHeight * 1.25}px`;
      popoverActions.style.display = "block";
      popoverActions.classList.add("btnEntrance");
    }
    else {
      popoverActions.style.left = `${x - popoverActionsWidth * 0.5}px`;
      popoverActions.style.top = `${y - popoverActionsHeight * 0.5}px`;
    }
  }
}

function documentMouseDown(event) {
  if (event.target.id === "popover-actions-bold") {
    makeSelectionBold()
    return clearSelection();
  }
  
  if (event.target.id === "popover-actions-reverse") {
    reverseSelection()
    return clearSelection();
  }

  if(event.target.id !== "popover-actions") {
    clearSelection()
  }
}

function selectableTextAreaKeyDown(event) {
  const key = event.key + event.location;

  if (key === "Shift1") {
    shiftLeft = 1;
    shiftRight = 0;
  } else if (key === "Shift2") {
    shiftRight = 1;
    shiftLeft = 0;
  }

  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    selectableTextAreaMouseUp(event)
  }
}

function makeSelectionBold() {
  const range = window.getSelection().getRangeAt(0);
  const html = `<span style="font-weight:bold;"> ${range.toString()}</span>`
  insertNewFragment(range, html);
}

function reverseSelection() {
  const range = window.getSelection().getRangeAt(0);
  const html = `<span> ${range.toString().split("").reverse().join("")}</span>`
  insertNewFragment(range, html);
}

function insertNewFragment(range, html) {
  range.deleteContents();
  
  const el = document.createElement("div");
  el.innerHTML = html;
  
  const fragment = document.createDocumentFragment();
  const node = el.firstChild;
  const lastNode = fragment.appendChild(node);
  range.insertNode(fragment);
}


// (function () {
//   var script = document.createElement('script');
//   script.src = 'http://shiffman.net/a2z/js/bookmarklet.js';
//   document.body.appendChild(script);
// })();