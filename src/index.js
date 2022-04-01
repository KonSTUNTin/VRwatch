import * as THREE from 'three'
import { MeshBasicMaterial } from 'three';

import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

let robot = [];
let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let cube;
let room;
let selected;
let raycaster;
let blue;
const tempMatrix = new THREE.Matrix4();
let axesHelper
let count = 0;
const radius = 0.08;
let normal = new THREE.Vector3();
const relativeVelocity = new THREE.Vector3();

const clock = new THREE.Clock();




init();


function init() {

    blue = new THREE.Color("blue");

    scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0x505050 );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
    //camera.position.set( 0, 1.6, 3 );

    // room = new THREE.LineSegments(
    //     new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
    //     new THREE.LineBasicMaterial( { color: 0x808080 } )
    // );
    // room.geometry.translate( 0, 3, 0 );
    //scene.add( room );

    //scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );

   
    

    const loader = new GLTFLoader().setPath( './' );
        loader.load( 'trading.glb', function ( gltf ) {

            gltf.scene.traverse(function(child)
            {
                if(child.isMesh){
                    
                    console.log(child)
                    if(child.name.indexOf('robot')>-1){
                        robot.push(child)
                    }
                    let material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: child.material.map
                    })
                    
                    child.material = material
                }
            }
            )

            scene.add( gltf.scene );

            //console.log(gltf)

    } );
    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.xr.enabled = true;
    document.body.appendChild( renderer.domElement );

    //

    document.body.appendChild( VRButton.createButton( renderer ) );

    raycaster = new THREE.Raycaster();
    // controllers

    controller1 = renderer.xr.getController( 0 );
    controller1.addEventListener( 'selectstart', onSelectStart );
    controller1.addEventListener( 'selectend', onSelectEnd );
    controller1.addEventListener( 'connected', function ( event ) {

        this.add( buildController( event.data ) );
       
        // controller1.attach(VRW1);

        // VRW1.rotation.x += Math.PI/2
        // VRW1.rotation.y += Math.PI/2
    } );
    controller1.addEventListener( 'disconnected', function () {

        this.remove( this.children[ 0 ] );

    } );
    scene.add( controller1 );

    controller2 = renderer.xr.getController( 1 );
    controller2.addEventListener( 'selectstart', onSelectStart );
    controller2.addEventListener( 'selectend', onSelectEnd );
    controller2.addEventListener( 'connected', function ( event ) {
    
        this.add( buildController( event.data ) );
       
    } );
    controller2.addEventListener( 'disconnected', function () {

        this.remove( this.children[ 0 ] );

    } );
    scene.add( controller2 );

    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip( 0 );
    controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
    scene.add( controllerGrip1 );

    controllerGrip2 = renderer.xr.getControllerGrip( 1 );
    controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
    scene.add( controllerGrip2 );

    //
    window.addEventListener( 'resize', onWindowResize );
    animate();
}

function buildController( data ) {

    let geometry, material;

    switch ( data.targetRayMode ) {

        case 'tracked-pointer':

            geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
            geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

            material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

            return new THREE.Line( geometry, material );

        case 'gaze':

            geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
            material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
            return new THREE.Mesh( geometry, material );

    }

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function handleController( controller ) {
    
    //if ( controller.userData.isSelecting ) {
        // if(selected)selected.material.color = blue
        // tempMatrix.identity().extractRotation( controller.matrixWorld );
        // raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
        // raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );
       
        // let intersections = raycaster.intersectObjects( VRW1.pivot.children, false );
        //console.log(intersections)
        // if (intersections.length > 0) {

        //     selected = intersections[ 0 ].object;
        //     selected.material.color = new THREE.Color('red');
        // }
        

    //}

}

//

function animate() {
    renderer.setAnimationLoop( render );
}

function render() {
   
   if(robot.length>0){
       for(let i =0; i < robot.length; i++){
        robot[i].rotation.y +=.01
       }
      
   }
   // handleController(controller2)
    // VRW1.rotation.copy(controller1.rotation);
    renderer.render( scene, camera );

}

function onSelectStart() {
    this.userData.isSelecting = true;
}

function onSelectEnd() {
    this.userData.isSelecting = false;
}


