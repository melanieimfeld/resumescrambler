        
    function scramble(dict){

        let Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Runner = Matter.Runner,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse;

        let bodies = [],
            fixedBodies = [],
            counter = 0;

        let engine = Engine.create();

        engine.world.gravity.y = 3 //gravity speed

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
            let body = Bodies.circle(Math.random()*(render.options.width-80), 0, 15, {
                //inertia : 0.000001,
                //density : 0.00001,
                restitution: 0.4,
                  render: {
                    sprite: {
                      texture: "static/images/" + file,
                       xScale: 0.35,
                       yScale: 0.35
                    }
                  }
                });
                return body;
        }

    
        for (const key in dict){
            console.log(key, dict[key]);
            for (var i = 0; i < dict[key]["count"]; i++){
                bodies.push(createBody(dict[key]["img"]));
            }
        }
    
        console.log(bodies.length);

        console.log(bodies);

        const interval = setInterval(() => {
            if(counter < bodies.length){
                console.log(bodies[counter]);
                World.add(engine.world, bodies[counter]);
                counter ++;
            } else{
            clearInterval(interval);
            }
        }, 100)

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


        World.add(engine.world, fixedBodies);
        World.add(engine.world, mouseConstraint)

        Engine.run(engine);
        Render.run(render);
        //Runner.run(runner, engine)
    }

