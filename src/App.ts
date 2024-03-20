/* Lecture 17: Hierarchy and Forward Kinematics
 * CSCI 4611, Spring 2024, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { GUI } from 'dat.gui'
import { RobotArm } from './RobotArm'

export class App extends gfx.GfxApp
{
    private cameraControls: gfx.OrbitControls;
    private robotArm: RobotArm;

    // GUI variables
    public upperArmRotate: number;
    public upperArmBend: number;
    public middleArmBend: number;
    public lowerArmBend: number;
    public endEffectorBend: number;

    // --- Create the App class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

        this.cameraControls = new gfx.OrbitControls(this.camera);
        this.robotArm = new RobotArm();

        this.upperArmRotate = 0;
        this.upperArmBend = 0;
        this.middleArmBend = 0;
        this.lowerArmBend = 0;
        this.endEffectorBend = 0;
    }


    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        // Setup camera
        this.camera.setPerspectiveCamera(60, 1920/1080, .1, 20)
        this.cameraControls.setTargetPoint(new gfx.Vector3(0, 0.75, 0));
        this.cameraControls.setDistance(1.6);

        // Set a black background
        this.renderer.background.set(0, 0, 0);
        
        // Create an ambient light
        const ambientLight = new gfx.AmbientLight(new gfx.Vector3(0.3, 0.3, 0.3));
        this.scene.add(ambientLight);

        // Create a directional light
        const directionalLight = new gfx.DirectionalLight(new gfx.Vector3(0.6, 0.6, 0.6));
        directionalLight.position.set(2, 1, 3)
        this.scene.add(directionalLight);

        // Create a grid for the ground plane
        const gridSize = 10;
        const gridVertices: gfx.Vector3[] = [];
        //const gridColors: gfx.Color[] = [];
        for(let i=-gridSize/2; i <= gridSize/2; i++)
        {
            gridVertices.push(new gfx.Vector3(-gridSize/2, 0, i));
            gridVertices.push(new gfx.Vector3(gridSize/2, 0, i));
            gridVertices.push(new gfx.Vector3(i, 0, -gridSize/2));
            gridVertices.push(new gfx.Vector3(i, 0, gridSize/2));
        }

        const gridLines = new gfx.Line3(gfx.LineMode3.LINES);
        gridLines.setVertices(gridVertices);
        this.scene.add(gridLines);

        this.robotArm.createHierarchy();
        this.robotArm.createGeometry();
        this.scene.add(this.robotArm);


        // Create the GUI
        const gui = new GUI();

        const upperArmControls = gui.addFolder('Upper Arm Controls');
        upperArmControls.open();

        const upperYController = upperArmControls.add(this, 'upperArmRotate', -180, 180);
        upperYController.name('rotate');
        upperYController.onChange((value: number) => { 
            const bendRotation = gfx.Quaternion.makeRotationZ(gfx.MathUtils.degreesToRadians(this.upperArmBend));
            const rotation = gfx.Quaternion.makeRotationY(gfx.MathUtils.degreesToRadians(this.upperArmRotate));
            this.robotArm.setJointRotation('upperArm', gfx.Quaternion.multiply(rotation, bendRotation));
        });

        const upperZController = upperArmControls.add(this, 'upperArmBend', -45, 45);
        upperZController.name('bend');
        upperZController.onChange((value: number) => { 
            const bendRotation = gfx.Quaternion.makeRotationZ(gfx.MathUtils.degreesToRadians(this.upperArmBend));
            const rotation = gfx.Quaternion.makeRotationY(gfx.MathUtils.degreesToRadians(this.upperArmRotate));
            this.robotArm.setJointRotation('upperArm', gfx.Quaternion.multiply(rotation, bendRotation));
         });

        const middleArmControls = gui.addFolder('Middle Arm Controls');
        middleArmControls.open();

        const middleZController = middleArmControls.add(this, 'middleArmBend', -135, 135);
        middleZController.name('bend');
        middleZController.onChange((value: number) => { 
            const rotation = gfx.Quaternion.makeRotationZ(gfx.MathUtils.degreesToRadians(this.middleArmBend));
            this.robotArm.setJointRotation('middleArm', rotation);
        });

        const lowerArmControls = gui.addFolder('Lower Arm Controls');
        lowerArmControls.open();

        const lowerZController = lowerArmControls.add(this, 'lowerArmBend', -135, 135);
        lowerZController.name('bend');
        lowerZController.onChange((value: number) => { 
            const rotation = gfx.Quaternion.makeRotationZ(gfx.MathUtils.degreesToRadians(this.lowerArmBend));
            this.robotArm.setJointRotation('lowerArm', rotation);
         });

         const endEffectorControls = gui.addFolder('End Effector Controls');
         endEffectorControls.open();
 
         const endEffectorXController = endEffectorControls.add(this, 'endEffectorBend', -90, 90);
         endEffectorXController.name('bend');
         endEffectorXController.onChange((value: number) => { 
             const rotation = gfx.Quaternion.makeRotationY(gfx.MathUtils.degreesToRadians(this.endEffectorBend));
             this.robotArm.setJointRotation('endEffector', rotation);
          });
    }

    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        this.cameraControls.update(deltaTime);
    }
}