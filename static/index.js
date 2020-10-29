        
    function scramble(dict){

        //permission must be granted: https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer
        // var acc = new Accelerometer({frequency:1});

        // acc.addEventListener('reading', () => {
        //   console.log("Acceleration along the X-axis " + acl.x);
        //   console.log("Acceleration along the Y-axis " + acl.y);
        //   console.log("Acceleration along the Z-axis " + acl.z);
        // });

        //  acc.start();


        let Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Runner = Matter.Runner,
            Events = Matter.Events,
            Common = Matter.Common,
            Composite = Matter.Composite,
            MouseConstraint = Matter.MouseConstraint,
            Sleeping = Matter.Sleeping,
            Mouse = Matter.Mouse;

        let bodies = [],
            fixedBodies = [],
            counter = 0,
            animation,
            now,
            then = Date.now(),
            elapsed,
            fpsInterval = 1000 / 30;

        let engine = Engine.create({
            //enableSleeping: true
        }),

        world = engine.world;

        //engine.world.gravity.y = 3 //gravity speed

        let render = Render.create({
                        element: document.getElementById("gamecanvas"),
                        engine: engine,
                        options: {
                            width: document.getElementById("gamecanvas").clientWidth,
                            height: document.getElementById("gamecanvas").clientHeight,
                            wireframes: false,
                            background: 'black'
                        }
                    });


        class letter {
            constructor(filepath){
                this.path = filepath;
                this.timeofcreation = 0;
                this.timedelta = 0;
                this.options = {
                //inertia : 0.000001,
                density : 0.005, //default 0.001
                restitution: 0.4,
                sleepThreshold: 10,
                render: {
                    sprite: {
                      texture: filepath,
                       xScale: 0.35,
                       yScale: 0.35
                    }
                  }
            };
            }

            createBody(){
                //let body = Bodies.circle(Math.random()*(render.options.width-80), 0, 15, options);
                return Bodies.rectangle(Math.random()*(render.options.width-80), 0, 12, 12, this.options);
            }
     
        }

    
        for (const key in dict){
            //console.log(key, dict[key]);
            for (var i = 0; i < dict[key]["count"]; i++){
                let l = new letter(dict[key]["img"]).createBody();
                bodies.push(l);
            }
        }
    

        function drop(now){
            animation = window.requestAnimationFrame(drop);
            now = Date.now();
            //console.log("timestamp", now);
            elapsed = now - then;


            if(counter < bodies.length & elapsed > fpsInterval){
                then = now - (elapsed % fpsInterval);
                bodies[counter].timeofcreation = now;
                World.add(world, bodies[counter]);

                counter ++;
                
            }
            if(counter === bodies.length){
            console.log("end it");
            window.cancelAnimationFrame(animation);
            }
        }

        animation = window.requestAnimationFrame(drop);

    //finetuning of options here: https://brm.io/matter-js/docs/classes/Body.html

        let ground = Bodies.rectangle(render.options.width/2, render.options.height - 5, render.options.width, 30, { isStatic: true });
        let middle = Bodies.rectangle(render.options.width/2, render.options.height/2, 300, 7, { isStatic: true });
        let wallLeft = Bodies.rectangle(0, render.options.height/2, 1, render.options.height, { isStatic: true });
        let wallRight = Bodies.rectangle(render.options.width, render.options.height/2, 1, render.options.height, { isStatic: true });

        
        fixedBodies.push(middle);
        fixedBodies.push(wallRight);
        fixedBodies.push(wallLeft);
        fixedBodies.push(ground);

        // add mouse control
        var mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
        });


        World.add(world,fixedBodies);
        //World.add(world, mouseConstraint)

        Events.on(engine, 'tick', function(event) {

                let text = document.getElementById("textbox");
                //console.log(event.timestamp);
                text.innerHTML = "Progress: " + (Composite.allBodies(world).length - fixedBodies.length) + "/" + bodies.length;

                Composite.allBodies(world).forEach(body => {
                    body.timedelta = (Date.now() - body.timeofcreation) / 1000;
                    //console.log(body);
                    if(body.timedelta > 8){
                        body.isStatic = true;
                        body.render.opacity = 0.5;
                    }
                });
        });

        Engine.run(engine);
        Render.run(render);
        //Runner.run(runner, engine)
    }

