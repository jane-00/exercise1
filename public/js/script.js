let socket;
let peer;
let peerConnection;
let $url = document.querySelector(`.url`);

let night = false;
let img;
let seaimg;

const servers = {
    iceServers: [{
        urls: `stun:stun.l.google.com:19302`
    }]
};

const init = async () => {
    initSocket();

};

const initSocket = () => {
    socket = io.connect(`/`);
    socket.on(`connect`, () => {
        console.log(socket.id);
        const url = `${new URL(`/sender.html?id=${socket.id}`, window.location)}`;
        $url.textContent = url;
        $url.setAttribute('href', url);
        console.log(url)

        //qr code generator
        const typeNumber = 4;
        const errorCorrectionLevel = 'L';
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(url);
        qr.make();
        document.getElementById('qr').innerHTML = qr.createImgTag(4);
    });


    socket.on('signal', async (myId, signal, peerId) => {
        console.log(`Received signal from ${peerId}`);
        console.log(signal);
        if (signal.type === 'offer') {
            answerPeerOffer(myId, signal, peerId);
        }
        peer.signal(signal);
    });
};

const answerPeerOffer = async (myId, offer, peerId) => {
    peer = new SimplePeer();
    peer.on('signal', data => {
        socket.emit('signal', peerId, data);
    });

    peer.on('data', data => {

        let command = data.toString();


        // got a data channel message
        console.log('got a message: ' + command)

      

        switch (command) {
            case 'bubble':
                console.log("case bubble");
                for (let i = 0; i < 50; i++) {
                    let bubble = new Bubble(random(width), height)
                    bubbles.push(bubble);
                    key = "a";
                };
                break;
            case 'day':
                setDay();
                break;
            case `night`:
                setNight();
                break;

            case 'newFishLeft':
                let fishRight = new Fish(0, height / 2)
                fishes.push(fishRight);
                break;
            case 'newFishRight':
                let fishLeft = new Fish(width, height / 2)
                fishes.push(fishLeft);

        }
    })
};


// function receiveCommand() {
//     socket.on(`update`, command => {
//         switch (command) {

//             case 'day':
//                 setDay();
//                 break;
//             case `night`:
//                 setNight();
//                 break;
//             case 'bubble':
//                 for (let i = 0; i < 50; i++) {
//                     let bubble = new Bubble(random(width), height)
//                     bubbles.push(bubble);
//                     key = "a";
//                 };
//                 break;
//             case 'newFishLeft':
//                 let fishRight = new Fish(0, height / 2)
//                 fishes.push(fishRight);
//                 break;
//             case 'newFishRight':
//                 let fishLeft = new Fish(width, height / 2)
//                 fishes.push(fishLeft);

//         }
//     });
// }

function preload() {
    img = loadImage("plant.jpg");
    seaimg = loadImage("sea.jpg")
}

class Fish {
    constructor(x, y) {
        this.location = createVector(x, y);
        this.velocity = createVector(random(2, 4), random(0, 3));
        this.bodycolor = random(["#e9c46a", "#f4a261", "#e76f51"]);
        this.fincolor = random(["#9d0208", "#511C29", "#bb3e03"])
        this.size = random(50, 100);
    };

    update() {
        if (night === false) {
            this.location.x += this.velocity.x;
            this.location.y += this.velocity.y;
        }
        else {
            this.location.x;
            this.location.y;
        }
    };

    display() {
        if (this.location.x > width || this.location.x < 0) {
            this.velocity.x *= -1;
        }
        if (this.location.y > height || this.location.y < 0) {
            this.velocity.y *= -1;
        }

        if (this.location.x > (width - width / 7) && this.location.y > (height - height / 5)) {
            this.location.x = 1000000;
        }
        let angle = this.velocity.heading()

        noStroke();
        fill(this.fincolor);
        push();
        translate(this.location.x, this.location.y);
        rotate(angle);
        ellipse(0, 0, this.size / 1.3, this.size * 1.1);
        triangle(0 - this.size, this.size / 2, - this.size, - this.size / 2, 0, 0);
        fill(this.bodycolor);
        ellipse(0, 0, this.size, this.size * 0.7);
        pop();
    }

    run() {
        this.display();
        this.update();
    };
}

class BabyFish extends Fish {
    constructor(x, y) {
        super(x, y);

        this.velocity = createVector(random(5, 7), random(3, 5));
        this.bodycolor = random(["#fd788b", "#feb1b7", "#fedcdb"]);
        this.fincolor = random(["#febecc", "#fe6694", "#f4acb7"])
        this.size = random(20, 45);
    }

}

class Food {
    constructor(x, y) {
        this.location = createVector(x, y);
        this.velocity = createVector(random(-4, 4), random(5, 15));
        this.size = random(3, 10);
        this.color = "#9b673c";
    }
    update() {
        this.location.x += this.velocity.x;
        this.location.y += this.velocity.y;
    }
    display() {
        noStroke();
        fill(this.color);
        ellipse(this.location.x, this.location.y, this.size);
    }

    run() {
        this.update();
        this.display();
    }
}

let i = 0;
class Bubble {
    constructor(x, y) {
        this.location = createVector(x, y);
        this.velocity = createVector(0, random(2, 10));
        this.size = random(10, 50);
        this.color = random(["#add8e6", "#badbff"])
    }

    update() {
        this.location.x -= this.velocity.x;
        this.location.y -= this.velocity.y;
    }

    display() {
        noStroke();
        fill(this.color);
        ellipse(this.location.x - (sin(i / 50) * 5), this.location.y, this.size);
        fill("white");
        ellipse(this.location.x - (sin(i / 50) * 5) - this.size / 5, this.location.y, this.size / 5)
        i++;
        if (i > height) {
            i = 0
        }
    }

    runbubble() {
        this.update();
        this.display();
    }
}


const fishes = [];
const fishNum = 5;

const babyFishes = []

let foods = []
let food

function setup() {
    myCanvas = createCanvas(2000, 1500);
    myCanvas.parent("p5js");

    for (let i = 0; i < fishNum; i++) {

        let fish = new Fish(random(width), random(height))
        fishes.push(fish);
    }
}


let currentFish
let currentbabyFish
let bubbles = []

function draw() {

    background(seaimg);
    image(img, width - width / 7, height - height / 5)
    keyTyped();

    for (let i = 0; i < fishes.length; i++) {
        currentFish = fishes[i];
        currentFish.run()
    }

    for (let i = 0; i < babyFishes.length; i++) {
        currentbabyFish = babyFishes[i];
        currentbabyFish.run()
    }

    bubbles.forEach(bubble => bubble.runbubble())
    foods.forEach(food => food.run())
}

function setDay() {
    tint(251, 255, 255, 126);
    night = false;
}

function setNight() {
    tint(0, 0, 139, 126);
    night = true;
    let randnum = random(0, 100)
    if (randnum > 45) {
        let babyfish = new BabyFish(random(width), random(height))
        babyFishes.push(babyfish);
    };
};

function keyTyped() {
    if (key === "b") {

        for (let i = 0; i < 50; i++) {
            let bubble = new Bubble(random(width), height)
            bubbles.push(bubble);
            key = "a";
        }
    }

    if (key === "f") {
        for (let i = 0; i < 40; i++) {
            food = new Food(mouseX, mouseY);
            foods.push(food);
        }

        let rand = random(0, 100)
        if (rand > 85) {

            let babyfish = new BabyFish(random(width), random(height))
            babyFishes.push(babyfish);
        }

        key = "c"
    }

    if (key === "n") {
        setNight();
    }

    if (key === "d") {
        setDay();
    }

}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        let fish = new Fish(width, height / 2)
        fishes.push(fish);
    } else if (keyCode === RIGHT_ARROW) {
        let fish = new Fish(0, height / 2)
        fishes.push(fish);
    }
}


init();