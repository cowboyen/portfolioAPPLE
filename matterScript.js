document.addEventListener('DOMContentLoaded', () => {
    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        Events = Matter.Events,
        Body = Matter.Body;

    // Create engine
    const engine = Engine.create();
    engine.gravity.y = 0.5;

    // Get elements
    const container = document.querySelector('#matter-container');
    const pills = document.querySelectorAll('.physics-pill');
    const goBackButton = document.querySelector('#go-back-button');

    // Create renderer
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: container.clientWidth,
            height: container.clientHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    // Track bodies and elements
    const bodyMap = new Map();

    // Estimate pill dimensions (or use a consistent size)
    const pillWidth = 150;
    const pillHeight = 40;

    // Create pills with full screen spreading
    pills.forEach((pill, index) => {
        // Ensure absolute positioning
        pill.style.position = 'absolute';
        pill.style.width = `${pillWidth}px`;
        pill.style.height = `${pillHeight}px`;

        // Start from above the top of the container, spread across full width
        const startX = Math.random() * (container.clientWidth - pillWidth);
        const startY = -200 - (index * 50);

        const body = Bodies.rectangle(
            startX + pillWidth / 2,
            startY,
            pillWidth,
            pillHeight,
            {
                chamfer: { radius: pillHeight / 2 },
                density: 0.001,
                friction: 0.1,
                restitution: 0.6,
                render: { visible: false },
                angle: Math.random() * Math.PI,
                angularVelocity: (Math.random() - 0.5) * 0.2,
                frictionAir: 0.01,
                slop: 0.5
            }
        );

        // Apply initial lateral velocity to spread out
        Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 6,
            y: 0
        });

        // Store reference to both body and element
        bodyMap.set(body, pill);
        Composite.add(engine.world, body);
    });

    // Create bottom wall to cover entire width
    const bottomWall = Bodies.rectangle(
        container.clientWidth / 2, 
        container.clientHeight, 
        container.clientWidth, 
        100, 
        {
            isStatic: true,
            render: { visible: false }
        }
    );
    Composite.add(engine.world, bottomWall);

    // Add side walls
    const walls = [
        Bodies.rectangle(0, container.clientHeight / 2, 60, container.clientHeight, {
            isStatic: true,
            render: { visible: false }
        }),
        Bodies.rectangle(container.clientWidth, container.clientHeight / 2, 60, container.clientHeight, {
            isStatic: true,
            render: { visible: false }
        })
    ];
    Composite.add(engine.world, walls);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });

    // Track dragged elements
    mouseConstraint.mousedown = function() {
        if (mouseConstraint.body) {
            const pill = bodyMap.get(mouseConstraint.body);
            if (pill) {
                pill.style.cursor = 'grabbing';
            }
        }
    };

    mouseConstraint.mouseup = function() {
        pills.forEach(pill => {
            pill.style.cursor = 'grab';
        });
    };

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Update positions of all pills
    Events.on(engine, 'afterUpdate', () => {
        bodyMap.forEach((pill, body) => {
            pill.style.transform = `translate(${body.position.x - pillWidth/2}px,
                                             ${body.position.y - pillHeight/2}px)
                                    rotate(${body.angle}rad)`;
        });
    });

    // Go back button click event
    goBackButton.addEventListener('click', () => {
        console.log('Go Back clicked!');
        // Add your go back logic here
    });

    // Run the engine
    Runner.run(Runner.create(), engine);
    Render.run(render);

    // Handle resize
    window.addEventListener('resize', () => {
        // Update render canvas size
        render.canvas.width = container.clientWidth;
        render.canvas.height = container.clientHeight;
        
        // Reposition bottom wall
        Body.setPosition(bottomWall, 
            Matter.Vector.create(container.clientWidth / 2, container.clientHeight));
        
        // Reposition side walls
        Body.setPosition(walls[0],
            Matter.Vector.create(0, container.clientHeight / 2));
        Body.setPosition(walls[1],
            Matter.Vector.create(container.clientWidth, container.clientHeight / 2));
    });
});