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
        upperArm.direction.set(0, 1, 0);
        upperArm.length = 0.5;
        this.add(upperArm);

        const middleArm = new gfx.Bone();
        middleArm.name = "middleArm";
        middleArm.direction.set(0, 1, 0);
        middleArm.length = 0.25;
        upperArm.add(middleArm);

        const lowerArm = new gfx.Bone();
        lowerArm.name = "lowerArm";
        lowerArm.direction.set(0, 1, 0);
        lowerArm.length = 0.25;
        middleArm.add(lowerArm);
    }

    public createGeometry(): void
    {
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
            bone.add(axes);
        }

        // Create the geometry for the bone
        if(bone.name == 'upperArm')
        {
            const armMesh = gfx.Geometry3Factory.createBox(0.1, bone.length, 0.1);
            armMesh.position.set(0, bone.length/2, 0);
            armMesh.material.setColor(new gfx.Color(0, 1, 0));
            bone.add(armMesh);
        }
        else if(bone.name == 'middleArm')
        {
            const armMesh = gfx.Geometry3Factory.createBox(0.1, bone.length, 0.1);
            armMesh.position.set(0, bone.length/2, 0);
            armMesh.material.setColor(new gfx.Color(0, 0, 1));
            bone.add(armMesh);

            bone.rotation.setRotationZ(Math.PI/4);

            const parentBone = bone.parent as gfx.Bone;
            bone.position.copy(parentBone.direction);
            bone.position.multiplyScalar(parentBone.length);
        }
        else if(bone.name == 'lowerArm')
        {
            const armMesh = gfx.Geometry3Factory.createBox(0.1, bone.length, 0.1);
            armMesh.position.set(0, bone.length/2, 0);
            armMesh.material.setColor(new gfx.Color(1, 0, 0));
            bone.add(armMesh);

            bone.rotation.setRotationZ(-Math.PI/2);

            const parentBone = bone.parent as gfx.Bone;
            bone.position.copy(parentBone.direction);
            bone.position.multiplyScalar(parentBone.length);
        }

        bone.children.forEach((child: gfx.Node3) => {
            if(child instanceof gfx.Bone)
            {
                this.createGeometryRecursive(child);
            }
        });
    }
}