var PTM_RATIO = 32;
var winSize;

var car;
var rt = 0;
var GameLayer = cc.Layer.extend({
    world:null,


    ctor:function () {
        this._super();
        winSize = cc.director.getWinSize();
        this.createWorld();
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        rt = new b2Vec2(0, 0);
        if ('keyboard' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    cc.log(key);
                    var alpha = car.GetAngle() + Math.PI / 2 ;
                    var b2Vec2 = Box2D.Common.Math.b2Vec2;
                    if (key == 37 || key == 65){ // A
                        //var myActor = b.GetUserData();
                        //car.GetUserData().setRotation(alpha + Math.PI/60);
                        //car.m_torque = 1;
                        //car.m_angularVelocity += 1;
                        //rt = new b2Vec2(1, 0);
                        //car.ApplyForce(new b2Vec2(-0.005, 0.005), car.GetWorldPoint(new b2Vec2(1, 1)));

                        //car.Set(rt);
                        //car.ApplyForce(new b2Vec2(Math.cos(alpha+0.5), Math.sin(alpha+0.5)), car.GetWorldCenter());
                        car.SetAngle(car.GetAngle() + Math.PI/180);
                    }
                    else if (key == 38 || key == 87){ // W
                        car.ApplyForce(new b2Vec2(Math.cos(alpha), Math.sin(alpha)), car.GetWorldCenter());
                    }
                    else if (key == 39 || key == 68){ // D
                        //car.ApplyForce(new b2Vec2(Math.cos(alpha-0.5), Math.sin(alpha-0.5)), car.GetWorldCenter());
                        car.SetAngle(car.GetAngle() - Math.PI/180);
                        //car.GetUserData().setRotation(alpha - Math.PI/60);
                        //car.m_torque = -1;
                        //car.m_angularVelocity -= 1;
                        //car.ApplyForce(new b2Vec2(0.005, 0.005), car.GetWorldPoint(new b2Vec2(-1, 1)));
                    }
                    else if (key == 40 || key == 83){ // S
                        car.ApplyForce(new b2Vec2(-Math.cos(alpha), -Math.sin(alpha)), car.GetWorldCenter());
                    }
                },
                onKeyReleased: function (key, event) {
                    cc.log(key);
                    var alpha = car.GetAngle() + Math.PI / 2;
                    var b2Vec2 = Box2D.Common.Math.b2Vec2;
                    if (key == 37 || key == 65){ // A
                        //car.m_angularVelocity = 0;
                        //rt = new b2Vec2(0, 0);
                    }
                    else if (key == 38 || key == 87){ // W
                        //car.ApplyForce(new b2Vec2(-Math.cos(alpha), -Math.sin(alpha)), car.GetWorldCenter());
                    }
                    else if (key == 39 || key == 68){ // D
                        //car.m_angularVelocity = 0;
                        //rt = new b2Vec2(0, 0);
                    }
                    else if (key == 40 || key == 83){ // S
                        //car.ApplyForce(new b2Vec2(Math.cos(alpha), Math.sin(alpha)), car.GetWorldCenter());
                    }
                }
            }, this);
        } else {
            cc.log("KEYBOARD Not supported");
        }


        /*this.schedule(function(){
            this.addBox(cc.p(winSize.width * Math.random(), winSize.height / 2));
        }, 1, null, 0);*/

        car = this.addBox(cc.p(winSize.width * Math.random(), winSize.height / 2));

        this.scheduleUpdate();
    },

    createWorld : function(){
        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        //UXLog(L"Screen width %0.2f screen height %0.2f",winSize.width,winSize.height);

        // Construct a world object, which will hold and simulate the rigid bodies.
        this.world = new b2World(new b2Vec2(0, 0), true);
        this.world.SetContinuousPhysics(true);

        // Define the ground body.
        //var groundBodyDef = new b2BodyDef(); // TODO
        //groundBodyDef.position.Set(winSize.width / 2 / PTM_RATIO, winSize.height / 2 / PTM_RATIO); // bottom-left corner

        // Call the body factory which allocates memory for the ground body
        // from a pool and creates the ground box shape (also from a pool).
        // The body is also added to the world.
        //var groundBody = this.world.CreateBody(groundBodyDef);

        var fixDef = new b2FixtureDef;
        fixDef.density = 10.0;
        fixDef.friction = 0.99;
        fixDef.restitution = 0.5;

        var bodyDef = new b2BodyDef;

        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(20, 2);
        // upper
        bodyDef.position.Set(10, winSize.height / PTM_RATIO + 1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // bottom
        bodyDef.position.Set(10, -1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        fixDef.shape.SetAsBox(2, 14);
        // left
        bodyDef.position.Set(-1.8, 13);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // right
        bodyDef.position.Set(26.8, 13);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    },

    addBox:function (p) {
        //UXLog(L"Add sprite %0.2f x %02.f",p.x,p.y);

        //We have a 64x64 sprite sheet with 4 different 32x32 images.  The following code is
        //just randomly picking one of the images
        var idx = (Math.random() > .5 ? 0 : 1);
        var idy = (Math.random() > .5 ? 0 : 1);
        var sprite = new cc.Sprite(res.blocks_png, cc.rect(32*idx, 32*idy, 32, 32));
        sprite.setPosition(p.x, p.y);
        this.addChild(sprite);

        // Define the dynamic body.
        //Set up a 1m squared box in the physics world
        var b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(p.x / PTM_RATIO, p.y / PTM_RATIO);
        bodyDef.userData = sprite;
        var body = this.world.CreateBody(bodyDef);
        // Define another box shape for our dynamic body.
        var dynamicBox = new b2PolygonShape();
        dynamicBox.SetAsBox(0.5, 0.5);//These are mid points for our 1m box

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.99;
        body.CreateFixture(fixtureDef);

        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        //
        //dynamicBox.applyImpulse(b2Vec2(100, 100), b2Vec2(0, 0));
        //dynamicBox.applyForce(b2Vec2(100, 100), b2Vec2(0, 0));
        //body.ApplyImpulse(new b2Vec2(50, 50), body.GetWorldCenter());
        return body;
    },
    update:function (dt) {
        //It is recommended that a fixed time step is used with Box2D for stability
        //of the simulation, however, we are using a variable time step here.
        //You need to make an informed choice, the following URL is useful
        //http://gafferongames.com/game-physics/fix-your-timestep/
        var velocityIterations = 8;
        var positionIterations = 1;
        this.world.Step(dt, velocityIterations, positionIterations);

        //Iterate over the bodies in the physics world
        for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = b.GetUserData();
                myActor.setPosition(b.GetPosition().x * PTM_RATIO, b.GetPosition().y * PTM_RATIO);
                myActor.setRotation(-1 * (b.GetAngle() * 180./ 3.1415926));
                //myActor.setRotation(-1 * b.GetAngle());
            }
        }
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});