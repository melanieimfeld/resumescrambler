        
    function scramble(dict){

        let Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Runner = Matter.Runner,
            Events = Matter.Events,
            Common = Matter.Common,
            Composites = Matter.Composites,
            MouseConstraint = Matter.MouseConstraint,
            Sleeping = Matter.Sleeping,
            Mouse = Matter.Mouse;

        let bodies = [],
            fixedBodies = [],
            counter = 0;

        let engine = Engine.create({
            enableSleeping: true
        }),
        world = engine.world;

        //engine.world.gravity.y = 3 //gravity speed

        let render = Render.create({
                        element: document.body,
                        engine: engine,
                        options: {
                            width: window.innerWidth,
                            height: window.innerHeight,
                            wireframes: false,
                            background: 'black'
                        }
                    });


        function createBody(file){
            let options = {
                //inertia : 0.000001,
                density : 0.005, //default 0.001
                restitution: 0.4,
                sleepThreshold: 10,
                render: {
                    sprite: {
                      texture: file,
                       xScale: 0.35,
                       yScale: 0.35
                    }
                  }
            };
            //let body = Bodies.circle(Math.random()*(render.options.width-80), 0, 15, options);
            let body = Bodies.rectangle(Math.random()*(render.options.width-80), 0, 15, 15, options);
            return body;
        }

    
        for (const key in dict){
            //console.log(key, dict[key]);
            for (var i = 0; i < dict[key]["count"]; i++){
                bodies.push(createBody(dict[key]["img"]));
            }
        }
    
        //console.log(bodies.length);

        //console.log(bodies);

        const interval = setInterval(() => {
            if(counter < bodies.length){
                //console.log(bodies[counter].isSleeping);
                World.add(world, bodies[counter]);
                //Sleeping.set(bodies[counter], true);
                counter ++;
            } else{
            clearInterval(interval);
            }
        }, 50)

        //World.add(engine.world, bodies);

    //finetuning of options here: https://brm.io/matter-js/docs/classes/Body.html

        let ground = Bodies.rectangle(render.options.width/2, render.options.height, render.options.width, 30, { isStatic: true });
        let middle = Bodies.rectangle(render.options.width/2, render.options.height/2, 300, 10, { isStatic: true });
        let wallLeft = Bodies.rectangle(0, render.options.height/2, 10, render.options.height, { isStatic: true });
        let wallRight = Bodies.rectangle(render.options.width, render.options.height/2, 10, render.options.height, { isStatic: true });

        
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
        World.add(world, mouseConstraint)

        
        
        // for (var i = 0; i < bodies.length; i++) {
        //     Events.on(bodies[i], 'sleepStart sleepEnd', function(event) {
        //         var body = this;
        //         console.log('body id', body.id, 'sleeping:', body.isSleeping);
        //     });
        // }
         Events.on(engine, 'afterUpdate', function(event) {
                var body = this;
                let static  = bodies.filter((body) => body.speed > 17.01);

                static.forEach(body => {
                    body.isStatic = true;
                });


                console.log("monitor body", bodies[1]);
                //body.isStatic = true;
            });

        // for (var i = 0; i < bodies.length; i++) {
        //     Events.on(bodies[i], 'collisionStart', function(event) {
        //         var body = this;
        //         console.log("collision", body);
        //         //body.isStatic = true;
        //     });
        // }

        //console.log(render);
        // let sleeping  = bodies.filter((body) => body.isSleeping == true);
        // console.log("sleeping", sleeping);


        Engine.run(engine);
        Render.run(render);
        //Runner.run(runner, engine)
    }

