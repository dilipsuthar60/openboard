let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraseWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let penWidth = pencilWidthElem.value;
let eraseWidth = eraseWidthElem.value;
let eraseColor = "white";

let undoRedoTracker = [];
let trank = 0;





let mouseDown = false;

// AP
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;
//mouse down ->start path mouse moves fill (graphic)
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    beginPath({ x: e.clientX, y: e.clientY });
});
canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        drawStroke({
            x: e.clientX, y: e.clientY,
            color: eraserFlag ? eraserFlag : penColor,
            width: eraserFlag ? eraseWidth : penWidth
        });
    }

});
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    trank = undoRedoTracker.length - 1;

});

undo.addEventListener("click",(e) => {
    if (trank > 0) {
        trank--;
    }
    //action 
    let trankobj = {
        trackValue: trank,
        undoRedoTracker
    }
    undoRedocanvas(trankobj);
});


redo.addEventListener("click",(e) => {
    if (trank < undoRedoTracker.length - 1) {
        trank++;
    }
    let trankobj = {
        trackValue: trank,
        undoRedoTracker
    }
    undoRedocanvas(trankobj);
});

function undoRedocanvas(trankobj) {
    trank = trankobj.trackValue;
    undoRedoTracker = trankobj.undoRedoTracker;



    let url=undoRedoTracker[trank];

    let img = new Image();
    img.src = url;
    img.onload=(e)=>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}

function beginPath(strokeobj) {
    tool.beginPath();
    tool.moveTo(strokeobj.x, strokeobj.y);
}
function drawStroke(strokeobj) {
    tool.strokeStyle = strokeobj.color;
    tool.lineWidth = strokeobj.width
    tool.lineTo(strokeobj.x, strokeobj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
});
pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})
eraseWidthElem.addEventListener("change", (e) => {
    eraseWidth = eraseWidthElem.value;
    tool.lineWidth = eraseWidth;
})
eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = eraseColor;
        tool.lineWidth = eraseWidth;
    }
    else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
});

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();


    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
});