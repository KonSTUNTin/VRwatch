import * as THREE from 'three'

class VRwatch{
    constructor(){
        let pivot = new THREE.Object3D();
        let center = new THREE.Mesh(
            new THREE.PlaneGeometry(.1,.1),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color('blue'),
                side: THREE.DoubleSide,
            })
        )
        pivot.add(center)
        for (let i = 0; i < 6; i++) {
            let option = new THREE.Mesh(
                new THREE.PlaneGeometry(.1,.1),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color('blue'),
                    side: THREE.DoubleSide,
                })
            )
            option.position.x = Math.cos(Math.PI / 3*i) * .15
            option.position.y = Math.sin(Math.PI / 3*i) * .15
            pivot.add(option)
        }
        
        return pivot
    }
}

export default VRwatch 
