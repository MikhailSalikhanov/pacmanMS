sample2 = async () => {
    const dotRadius = 5;
    let dots = [];

    let scoresCounter = 0;
    let lives = 3;
    let speed = 100

    let gameStartSlow = () => {
        speed = 300
        gameStart()
    }
   let gameStartFast = ()=> {
       speed = 30 
       gameStart()
    }

    const vector = new Vector(0, 0);
    const ghostVector = new Vector(0, 0);
    const startContainer = new PIXI.Container();
    const mainContainer = new PIXI.Container();
    const finishContainer = new PIXI.Container();
    const emptySprite = new PIXI.Sprite();
    const loader = PIXI.Loader.shared;
    const createDot = (position) => {
        const dot = new PIXI.Graphics().beginFill(0xffff00).drawCircle(
            0,
            0,
            dotRadius
        );
        dot.position.set(position.x, position.y);
        return dot;
    };
    createPixiApplication();
    //loader stuff:
    loader.add('BG', 'images/game_bg.png');
    loader.add('PAC1', 'images/pack1.png');
    loader.add('PAC2', 'images/pack2.png');
    loader.add('FINISH', 'images/congrat.png')
    loader.add('GHOST', 'images/580b57fcd9996e24bc43c316.png')
    const loaderPromise = new Promise(resolve => {
        loader.onComplete.add((e) => {
            resolve();
        });
    });
    loader.load();
    await loaderPromise;
    //scene construct stuff:
    let style = {
        fill: [
            "#53b512",
            "#c70000"
        ],
        fillGradientStops: [
            0.2
        ],
        stroke: "white",
        strokeThickness: 1
    };
    const title = new PIXI.Text("MS PACMAN", style);
    const start = new PIXI.Text("START", style);
    const startSlow = new PIXI.Text("START (easy)", style);
    const startFast = new PIXI.Text("START (hard)", style);

    const restart = new PIXI.Text("RESTART", style);
    const gameover = new PIXI.Text("GAME OVER", style);
    const scores = new PIXI.Text(`Scores: ${scoresCounter}`, style);
    const live = new PIXI.Text(`Lives: ${lives}`, style);

    const frame = new PIXI.Graphics().lineStyle(2, 0x00FF00, 0.4).drawRect(2, 2, 800 - 4, 600 - 4);
    const bgTexture = loader.resources.BG.texture;
    const pacmanTexture1 = loader.resources.PAC1.texture;
    const pacmanTexture2 = loader.resources.PAC2.texture;
    const finishTexture = loader.resources.FINISH.texture;
    const ghostTexture = loader.resources.GHOST.texture;

    const spriteBG = new PIXI.Sprite(bgTexture);
    const pacman = new PIXI.Sprite(pacmanTexture1);
    const ghost = new PIXI.Sprite(ghostTexture);

    const finish = new PIXI.Sprite(finishTexture);
    finish.scale.set(0.45)
    finish.anchor.x = 0.5;
    finish.anchor.y = 0.5;
    finish.position.set(800 / 2, 600 / 2);
    
    start.anchor.x = 0.5;
    start.anchor.y = 0.5;
    start.position.set(800 / 2, 600 / 3);
    start.scale.set(2)

    startSlow.anchor.x = 0.5;
    startSlow.anchor.y = 0.5;
    startSlow.position.set(200, 600 / 2);
    startSlow.scale.set(1)

    startFast.anchor.x = 0.5;
    startFast.anchor.y = 0.5;
    startFast.position.set(600, 600 / 2);
    startFast.scale.set(1)

    gameover.anchor.x = 0.5;
    gameover.anchor.y = 0.5;
    gameover.position.set(800 / 2, 600 / 2);
    gameover.scale.set(4)
    
    restart.anchor.x = 0.5;
    restart.anchor.y = 0.5;
    restart.position.set(800 / 2, 900 / 2);
    restart.scale.set(2)

    pacman.anchor.x = 0.5;
    pacman.anchor.y = 0.5;
    pacman.scale.set(0.125);
    pacman.position.set(800 / 2, 600 / 2);

    ghost.anchor.x = 0.5;
    ghost.anchor.y = 0.5;
    ghost.scale.set(0.125);
    ghost.position.set(0, 0);

    title.anchor.x = 0.5;
    title.anchor.y = 0.5;
    title.position.set(
        800 / 2,
        title.height
    );

    scores.anchor.x = 0.5;
    scores.anchor.y = 0.5;
    scores.position.set(
        800 - scores.width - 10,
        scores.height
    );

    live.anchor.x = 0.5;
    live.anchor.y = 0.5;
    live.position.set(
        live.width,
        live.height
    );


      
    
    let gameStart = function () {
        scoresCounter = 0;
        lives = 3;
        live.text = `Lives: ${lives}`;
        dots = [];
        pacman.position.set(800 / 2, 600 / 2);
        vector.x = 0
        vector.y = 0

        ticker.start()

        ghost.position.set(0, 0);

        
        app.stage.addChild(mainContainer);
        mainContainer.addChild(spriteBG, title, scores, live, frame, pacman, ghost); 
        app.stage.removeChild(startContainer, finishContainer);
        finishContainer.removeChild(finish, restart, gameover)
        startContainer.removeChild(spriteBG, start, startSlow, startFast);
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let offsets = 100;
                let dot = createDot({ x: i * offsets, y: j * offsets });
                mainContainer.addChild(dot);
                dots.push(dot);
            }
        }
    }

    //pacman animation setup:
    setInterval(() => {
        pacman.texture = pacman.texture === pacmanTexture2 ? pacmanTexture1 : pacmanTexture2;
    }, 300);

    //game play setup:
    start.interactive = true;
    start.on('mousedown', gameStart)
    startSlow.interactive = true;
    startSlow.on('mousedown', gameStartSlow)
    startFast.interactive = true;
    startFast.on('mousedown', gameStartFast)
    window.document.onkeydown = (e) => {
        // console.log(spriteBG.position);
        
        // console.log(e.type, e.key);
        let offset = 0.5;
        switch (e.key) {
            case "ArrowLeft":
                vector.x -= offset;
                break;
            case "ArrowRight":
                vector.x += offset;
                break;
            case "ArrowUp":
                vector.y -= offset;
                break;
            case "ArrowDown":
                vector.y += offset;
                break;
            default:
                return;
        }
        vector.normalize();
    };


    moveDotToScore = (dot) => {
        
        let deltaX = (scores.position.x - dot.position.x) / 50;
        let deltaY = (dot.position.y - scores.position.y) / 50;
        
        let interval = setInterval(() => {
            dot.position.x += deltaX
            dot.position.y -= deltaY;

            const dist3 = distance(dot.position, scores.position);
            if (dist3 < (dot.width + scores.width) / 2) { 
                clearInterval(interval)

                mainContainer.removeChild(dot);
                scoresCounter++;
                scores.text = `Scores: ${scoresCounter}`;
               
                
               earthquake()   
                
                if (scoresCounter > 4) {
                    mainContainer.removeChild(spriteBG, title, scores, live, frame, pacman, ghost);
                    app.stage.removeChild(mainContainer);
                    finishContainer.removeChild(gameover);
                    finishContainer.addChild(finish, restart);
                    app.stage.addChild(finishContainer);
                    ticker.stop()
                }
            }
        },10)
    }

    const checkMath = () => {
        // pacman.x;
        // pacman.y;
        dots.slice().forEach(dot => {
            const dist = distance(pacman.position, dot.position);
            if (dist < pacman.width * .5 + dotRadius) {
                moveDotToScore(dot)
                dots.splice(dots.indexOf(dot), 1);
            }
            const dist2 = distance(pacman.position, ghost.position);
            if (dist2 < (pacman.width + ghost.width) / 2) {
                if (lives > 1) {
                    lives--
                    ghost.position.x = 0
                    ghost.position.y = 0
                    live.text = `Lives: ${lives}`;

                } else {
                    mainContainer.removeChild(spriteBG, title, scores, live, frame, pacman, ghost);
                    app.stage.removeChild(mainContainer);
                    finishContainer.removeChild(finish);
                    finishContainer.addChild(gameover, restart);
                    app.stage.addChild(finishContainer);
                    ticker.stop()
                }
            }

            }
        );
    }

    let beforeGameStart = function () {
        finishContainer.removeChild(gameover, restart);
        app.stage.removeChild(finishContainer);
        startContainer.addChild(spriteBG, start, startSlow, startFast)
        app.stage.addChild(startContainer);
    }
    beforeGameStart()

    
    restart.interactive = true;
    restart.on('mousedown', beforeGameStart)

    let earthquake = function () {
        scores.scale.set(2)
        setTimeout(() => scores.scale.set(1), 200)
        spriteBG.position.x = spriteBG.position.x + 20
        setTimeout(() => spriteBG.position.x = spriteBG.position.x - 20, 80)
        spriteBG.position.y = spriteBG.position.y + 20
        setTimeout(() => spriteBG.position.y = spriteBG.position.y - 20, 160)
    }

    let pacmanIsRotate = false

    
    const updatePositions = () => {
        pacman.position.x += vector.x * 3;
        pacman.position.y += vector.y * 3;
        vector.mult(0.98);
        pacman.position.x = (800 + pacman.position.x) % 800;
        pacman.position.y = (600 + pacman.position.y) % 600;

        ghost.position.x += (pacman.position.x - ghost.position.x)/speed;
        ghost.position.y += (pacman.position.y - ghost.position.y)/speed;
        ghost.position.x = (800 + ghost.position.x) % 800;
        ghost.position.y = (600 + ghost.position.y) % 600;

        
        if ((vector.angle() < -1.56 || vector.angle() > 1.56) && !pacmanIsRotate) {
            pacman.scale.set(.125, -.125)
            pacmanIsRotate = true
        }
        if ((vector.angle() > -1.56 && vector.angle() < 1.56) && pacmanIsRotate) {
            pacman.scale.set(.125, .125)
            pacmanIsRotate = false
        }
        pacman.rotation = vector.angle();
    }

    const ticker = new PIXI.Ticker();
    ticker.add(() => {
        updatePositions();
    });
    ticker.add(() => {
        checkMath();
    });
    ticker.start();
}

createPixiApplication = () => {
    const app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0x000000,
        transparent: false,
    });
    document.body.appendChild(app.view);
    window.app = app;
}