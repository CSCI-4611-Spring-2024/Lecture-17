/* Lecture 17: Hierarchy, Animation, and Kinematics
 * CSCI 4611, Spring 2024, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'

export class RobotArm extends gfx.Skeleton
{
    public showAxes: boolean;

    constructor()
    {
        super();

        this.showAxes = false;
    }

    public createHierarchy(): void
    {
        const upperArm = new gfx.Bone();
        upperArm.name = "upperArm";
        upperArm.direction.set(0.5, 0.5, 0);
        upperArm.direction.normalize();
        upperArm.length = 0.5;
        this.add(upperArm);

        const middleArm = new gfx.Bone();
        middleArm.name = "middleArm";
        middleArm.direction.set(1, 0.25, 0);
        middleArm.direction.normalize();
        middleArm.length = 0.4;

        middleArm.position.copy(upperArm.direction);
        middleArm.position.multiplyScalar(upperArm.length);
        upperArm.add(middleArm);

        const lowerArm = new gfx.Bone();
        lowerArm.name = "lowerArm";
        lowerArm.direction.set(1, 0, 0);
        lowerArm.direction.normalize();
        lowerArm.length = 0.4;

        lowerArm.position.copy(middleArm.direction);
        lowerArm.position.multiplyScalar(middleArm.length);
        middleArm.add(lowerArm);

        const endEffector = new gfx.Bone();
        endEffector.name = "endEffector";
        endEffector.direction.set(1, 0, 0);
        endEffector.direction.normalize();
        endEffector.length = 0.075;

        endEffector.position.copy(lowerArm.direction);
        endEffector.position.multiplyScalar(lowerArm.length);
        lowerArm.add(endEffector);
    }

    public createGeometry(): void
    {
        const base = gfx.Geometry3Factory.createBox(0.5, 0.05, 0.5);
        base.position.set(0, 0.025, 0);
        this.add(base);

        const sphere = gfx.Geometry3Factory.createSphere(0.1, 2);
        sphere.scale.set(1, 0.5, 1);
        sphere.position.set(0, 0.05, 0);
        this.add(sphere);

        this.children.forEach((child: gfx.Node3) => {
            if(child instanceof gfx.Bone)
            {
                this.createGeometryRecursive(child);
            }
        });
    }

    public createGeometryRecursive(bone: gfx.Bone): void
    {
        if(this.showAxes)
        {
            const axes = gfx.Geometry3Factory.createAxes(0.25);
            axes.lookAt(bone.direction);
            bone.add(axes);
        }
        else if(bone.name == 'upperArm')
        {
            const armMesh = gfx.Geometry3Factory.createBox();
            const S = gfx.Matrix4.makeScale(new gfx.Vector3(0.05, bone.length, 0.05));
            const R = gfx.Matrix4.makeAlign(new gfx.Vector3(0, 1, 0), bone.direction);
            const T = gfx.Matrix4.makeTranslation(new gfx.Vector3(0, bone.length/2, 0));
            const M = gfx.Matrix4.multiplyAll(R, T, S);
            armMesh.setLocalToParentMatrix(M, false);
            bone.add(armMesh);
        }
        else if(bone.name == 'middleArm')
        {
            const armMesh = gfx.Geometry3Factory.createBox();
            const S = gfx.Matrix4.makeScale(new gfx.Vector3(0.05, bone.length, 0.05));
            const R = gfx.Matrix4.makeAlign(new gfx.Vector3(0, 1, 0), bone.direction);
            const T = gfx.Matrix4.makeTranslation(new gfx.Vector3(0, bone.length/2, 0));
            const M = gfx.Matrix4.multiplyAll(R, T, S);
            armMesh.setLocalToParentMatrix(M, false);
            bone.add(armMesh);

            const sphere = gfx.Geometry3Factory.createSphere(0.05, 1);
            bone.add(sphere);
        }
        else if(bone.name == 'lowerArm')
        {
            const armMesh = gfx.Geometry3Factory.createBox();
            const S = gfx.Matrix4.makeScale(new gfx.Vector3(0.05, bone.length, 0.05));
            const R = gfx.Matrix4.makeAlign(new gfx.Vector3(0, 1, 0), bone.direction);
            const T = gfx.Matrix4.makeTranslation(new gfx.Vector3(0, bone.length/2, 0));
            const M = gfx.Matrix4.multiplyAll(R, T, S);
            armMesh.setLocalToParentMatrix(M, false);
            bone.add(armMesh);

            const sphere = gfx.Geometry3Factory.createSphere(0.05, 1);
            bone.add(sphere);
        }
        else if(bone.name == 'endEffector')
        {
            const sphere = gfx.Geometry3Factory.createSphere(0.05, 1);
            bone.add(sphere);

            const pincherRoot = new gfx.Node3();
            const S = gfx.Matrix4.makeScale(new gfx.Vector3(1, 1, 1));
            const R = gfx.Matrix4.makeAlign(new gfx.Vector3(0, 0, -1), bone.direction);
            const T = gfx.Matrix4.makeTranslation(new gfx.Vector3(0, 0, -bone.length/2));
            const M = gfx.Matrix4.multiplyAll(R, T, S);
            pincherRoot.setLocalToParentMatrix(M, false);
            bone.add(pincherRoot);

            const pincher = gfx.Geometry3Factory.createBox(0.025, 0.025, 0.1);

            const leftPincher1 = pincher.createInstance();
            const leftPincher2 = pincher.createInstance();
            const rightPincher1 = pincher.createInstance();
            const rightPincher2 = pincher.createInstance();

            leftPincher1.rotation.setRotationY(gfx.MathUtils.degreesToRadians(45));
            leftPincher1.position.set(-0.05, 0, 0);
            pincherRoot.add(leftPincher1);

            const LT = gfx.Matrix4.makeTranslation(new gfx.Vector3(0, 0, -0.04));
            const LR = gfx.Matrix4.makeRotationY(gfx.MathUtils.degreesToRadians(-75));
            const LM = gfx.Matrix4.multiplyAll(LT, LR, LT);
            leftPincher2.setLocalToParentMatrix(LM, false);
            leftPincher1.add(leftPincher2);

            rightPincher1.rotation.setRotationY(gfx.MathUtils.degreesToRadians(-45));
            rightPincher1.position.set(0.05, 0, 0);
            pincherRoot.add(rightPincher1);

            const RT = gfx.Matrix4.makeTranslation(new gfx.Vector3(0, 0, -0.04));
            const RR = gfx.Matrix4.makeRotationY(gfx.MathUtils.degreesToRadians(75));
            const RM = gfx.Matrix4.multiplyAll(RT, RR, RT);
            rightPincher2.setLocalToParentMatrix(RM, false);
            rightPincher1.add(rightPincher2);
        }

        bone.children.forEach((child: gfx.Node3) => {
            if(child instanceof gfx.Bone)
            {
                this.createGeometryRecursive(child);
            }
        });
    }

    public setJointRotation(name: string, rotation: gfx.Quaternion): void
    {
        this.children.forEach((child: gfx.Node3) => {
            if(child instanceof gfx.Bone)
            {
                this.setJointRotationRecursive(child, name, rotation);
            }
        });
    }

    public setJointRotationRecursive(bone: gfx.Bone, name: string, rotation: gfx.Quaternion): void
    {
        if(bone.name == name)
        {
            bone.rotation.copy(rotation);
        }
        else
        {
            bone.children.forEach((child: gfx.Node3) => {
                if(child instanceof gfx.Bone)
                {
                    this.setJointRotationRecursive(child, name, rotation);
                }
            });
        }
    }
}