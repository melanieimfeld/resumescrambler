function scramble(dict, start) {

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
         fpsInterval = 1000 / 30,
         parent = document.getElementById("column2"),
         sampleElement = document.getElementById("column2"),
         ratio = parent.offsetHeight / parent.clientWidth;

     let engine = Engine.create({
             //enableSleeping: true
         }),
         world = engine.world;

     console.log(start);

     //engine.world.gravity.y = 3 //gravity speed
     //console.log("width", parent.clientWidth, "height", parent.offsetHeight, )

     console.log(sampleElement,
         sampleElement.offsetWidth,
         sampleElement.clientWidth,
         sampleElement.clientHeight,
         sampleElement.getBoundingClientRect().width);

     let render = Render.create({
         element: parent,
         engine: engine,
         options: {
             width: parent.clientWidth,
             height: parent.clientHeight,
             wireframes: false,
             background: 'black'
         }
     });


     //Render.setPixelRatio(render, "auto");

     class letter {
         constructor(filepath) {
             this.path = filepath;
             this.timeofcreation = 0;
             this.timedelta = 0;
             this.options = {
                 //inertia : 0.000001,
                 density: 0.005, //default 0.001
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

         createBody() {
             //let body = Bodies.circle(Math.random()*(render.options.width-80), 0, 15, options);
             return Bodies.rectangle(Math.random() * (render.options.width - 80), 0, 12, 12, this.options);
         }

     }


     for (const key in dict) {
         //console.log(key, dict[key]);
         for (var i = 0; i < dict[key].count; i++) {
             let l = new letter(dict[key].img).createBody();
             bodies.push(l);
         }
     }


     let progress = document.getElementById("bar");
     let step = document.getElementById("column1").clientWidth / bodies.length;
     let newlength = 0;
     //let ctx = progress.getContext("2d");
     //ctx.fillStyle = "white";
     //ctx.fillRect(0,0,progress.width*0.01,progress.height * 0.5);


     function drop(now) {
         animation = window.requestAnimationFrame(drop);
         now = Date.now();
         //console.log("timestamp", now);
         elapsed = now - then;


         if (counter < bodies.length & elapsed > fpsInterval) {
             then = now - (elapsed % fpsInterval);
             bodies[counter].timeofcreation = now;
             World.add(world, bodies[counter]);
             newlength = newlength + step;

             //console.log("timestamp", now);
             //console.log(progress.style.width, step, newlength);
             //ctx.fill();

             counter++;

         }
         if (counter === bodies.length) {
             console.log("end it");
             window.cancelAnimationFrame(animation);
         }
     }

     animation = window.requestAnimationFrame(drop);

     //finetuning of options here: https://brm.io/matter-js/docs/classes/Body.html
     console.log("width", render.canvas.width, render.canvas.height);
     let background = Bodies.rectangle(render.canvas.width/2, render.canvas.height/2, render.canvas.width, render.canvas.height, {
        id : "backgroundimg",
        isStatic: true,
        isSensor: true,
         render: {
             // fillStyle: 'red'
             sprite: {
                 texture: render.canvas.toDataURL(),
                 xScale: 1,
                 yScale: 1
             }
         }
     });


     let data = render.canvas.toDataURL();
     let testimage = new Image();
     let testt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
     //console.log("img", data);

     let ground = Bodies.rectangle(render.canvas.width / 2, render.canvas.height + 10, render.canvas.width, 30, {
        id: "ground",
        isStatic: true
     });
     let middle = Bodies.rectangle(render.options.width / 2, render.options.height / 2, 300, 7, {
         isStatic: true
     });
     let wallLeft = Bodies.rectangle(0, render.canvas.height / 2, 1, render.canvas.height, {
        id: "wallleft",
         isStatic: true
     });
     let wallRight = Bodies.rectangle(render.canvas.width, render.canvas.height / 2, 1, render.canvas.height, {
        id: "wallright",
         isStatic: true
     });



     fixedBodies.push(background);
     fixedBodies.push(wallRight);
     fixedBodies.push(wallLeft);
     fixedBodies.push(ground);

     //console.log("progress", progress.width, progress.height);
     //img.src = url;
     //render.canvas.drawImage(data,0,0);

     World.add(world, fixedBodies);
     //World.add(world, mouseConstraint)

     Events.on(engine, 'tick', function(event) {

         let text = document.getElementById("textbox");
         //console.log(event.timestamp);
         text.innerHTML = "Decomposition Progress: <br>" + counter + "/" + bodies.length;
         //console.log("progress", progress);
         let currTime = Date.now() - start;
         //console.log("progress", currTime);
         if (counter % 500 == 0){
            console.log(counter, "update background");
            background.render.sprite.texture = render.canvas.toDataURL('image/jpeg', 1.0);
            //remove older half of items
            //console.log(world.bodies);
            //world.bodies = world.bodies.filter(body => (body.isStatic === false && body.timedelta < 30)|| isNaN(body.id) === true);
            //console.log(world.bodies.length);
        
        }

         Composite.allBodies(world).forEach(body => {
             body.timedelta = (Date.now() - body.timeofcreation) / 1000;
             //console.log(body.id, ["wallright","wallleft", "ground", "backgroundimg"].includes(body.id) == false);
             if (body.timedelta > 5) {
                 body.isStatic = true;
                 //body.render.opacity = 0.5;
             }

             if (body.timedelta > 20){
                World.remove(world, body);
            }

         });

         // world.remove(world,)

        // Composite.remove(body => {
        //     console.log("remove", body);
        //     //return (Date.now() - body.timeofcreation) / 1000 > 20;
        // });

     });

     window.addEventListener('resize', function(event) {
         console.log(sampleElement,
             sampleElement.offsetWidth,
             sampleElement.clientWidth,
             sampleElement.clientHeight,
             sampleElement.getBoundingClientRect().width);
         console.log("resize", parent.clientWidth);
         //console.log("window", document.getElementById("gamecanvas").clientWidth, document.getElementById("gamecanvas").clientHeight, render.canvas.parentNode.getBoundingClientRect());
         render.canvas.width = parent.clientWidth;
         render.canvas.height = parent.clientWidth * ratio;
         //render.canvas.width = document.getElementById("gamecanvas").clientWidth;
         //render.canvas.height = document.getElementById("gamecanvas").clientWidth;

     });

     Engine.run(engine);
     Render.run(render);
     //Runner.run(runner, engine)
 }