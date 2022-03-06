import * as THREE from 'three'

class VRwatch{
    constructor(){

        this.state = {
            main: {
                center: {
                    pic: center,
                    link: false
                },
                option: [
                    {
                        pic: center,
                        link: false
                    }, 
                ]
            }
        }



        this.points = 12;
        this.pivot = new THREE.Object3D();
        this.a = 0;
        let center = new THREE.Mesh(
            new THREE.PlaneGeometry(.13,.13),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color('blue'),
                side: THREE.DoubleSide,
            })
        )
        this.option = []
        this.pivot.add(center)
        center.position.z += .1;
        for (let i = 0; i < this.points; i++) {
            this.option[i] = new THREE.Mesh(
                new THREE.PlaneGeometry(.1,.1),
                new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    map: new THREE.CanvasTexture(new Canvas(i))
                })
            )
            this.option[i].position.x = Math.cos(Math.PI / (this.points / 2) * i) * .15
            this.option[i].position.y = Math.sin(Math.PI / (this.points / 2) * i) * .15
            this.pivot.add(this.option[i])
        }
        
        return this
    }
    rotateOptions(data){
        let d = Math.abs(Math.sin(data)) * .15
        for (let i = 0; i < this.points; i++) {
            this.option[i].position.x = Math.cos(Math.PI / (this.points / 2) * i + data) * d
            this.option[i].position.y = Math.sin(Math.PI / (this.points / 2) * i + data) * d
        }
    }
}


class Canvas{
    constructor(txt){
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = 1024;
        canvas.height = 1024;
        ctx.font =  'bold 256px arial'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillStyle = 'white'
        ctx.fillText(
            txt,
            512, 512
        )
        return canvas
    }
}

export default VRwatch 
