var myGamePiece;
var myObstacles = [];
var myScore;

function startGame() {
    myGamePiece = new component(30, 30, "green", 10, 120, "", 45, 15);
    myGamePiece.gravity = 10;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
    document.onkeydown = keyActionDown;
    document.onkeyup = keyActionUp;
}

function keyActionDown(e) {
    e = e || window.event;
    if(e.keyCode == '38'){                      //up arrow
        accelerate(-.02);
    }
    else if(e.keyCode == '40'){                 //down arrow       
        if(myGamePiece.limitWidth>myGamePiece.width&&myGamePiece.limitHeight<myGamePiece.height){
            myGamePiece.width = myGamePiece.width*1.5;
            myGamePiece.height = myGamePiece.height/2;
        }
    }
}

function keyActionUp(e){
    e = e || window.event;
    if(e.keyCode == '38'){
        accelerate(.05);
    }
    else if(e.keyCode == '40'){
        myGamePiece.height = myGamePiece.height*2;
        myGamePiece.width = myGamePiece.width/1.5;
    }
}

var myGameArea = {
    canvas: document.createElement("canvas"),  //creates html element using js
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);    //20 is in milliseconds
        },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type, limitWidth = 0, limitHeight = 0) {
    this.limitWidth = limitWidth;
    this.limitHeight = limitHeight;
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {                      //new position(changes game piece's location)
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {           //game over, thats why there's return
            return;
        } 
    }
    myGameArea.clear();                                        //clearing the frame before adding new one
    myGameArea.frameNo += 1;                                   //keeping track of frame number
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        //myObstacles.push(new component(10, height, "white", x, 0));                             //either top or bottom obstacle part
        myObstacles.push(new component(10, x - height - gap, "white", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;                              // change variable amount
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}