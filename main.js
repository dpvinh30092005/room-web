import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111827);

const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
camera.position.set(3,3,5);

const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById("canvas"),
	antialias:true
});
renderer.setSize(innerWidth,innerHeight);

scene.add(new THREE.AmbientLight(0xffffff,1));

const dir = new THREE.DirectionalLight(0xffffff,2);
dir.position.set(5,10,5);
scene.add(dir);

const controls = new OrbitControls(camera,renderer.domElement);

const loader = new GLTFLoader();
let room;

// A simple color palette to assign to meshes
const palette = [0xff6b6b, 0xffb86b, 0x6bcB77, 0x4dabf7, 0xc56cf0, 0xffe066];

loader.load(
 "./models/base.glb",
 (gltf)=>{
	room = gltf.scene;
	const box = new THREE.Box3().setFromObject(room);
	box.getCenter(room.position).multiplyScalar(-1);

	room.scale.set(0.5,0.5,0.5);

	room.traverse(obj=>{
	if(obj.isMesh){
			obj.userData.clickable = true;

			// try to preserve texture if present, otherwise assign a colored standard material
			let newMat;
			try{
				newMat = obj.material && obj.material.clone ? obj.material.clone() : new THREE.MeshStandardMaterial();
			}catch(e){
				newMat = new THREE.MeshStandardMaterial();
			}

			const color = new THREE.Color(palette[Math.floor(Math.random()*palette.length)]);

			if(obj.material && obj.material.map){
				// keep texture but tint with a color
				newMat.map = obj.material.map;
				newMat.color = color;
			}else{
				newMat.color = color;
			}
			newMat.metalness = 0.2;
			newMat.roughness = 0.7;

			obj.material = newMat;
			obj.userData.originalColor = obj.material.color.clone();
	}
	});

	scene.add(room);
 },
 undefined,
 (e)=>console.error(e)
);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let lastHovered = null;

// hover: highlight and change cursor
window.addEventListener('mousemove',(e)=>{
	mouse.x = (e.clientX/innerWidth)*2-1;
	mouse.y = -(e.clientY/innerHeight)*2+1;
	raycaster.setFromCamera(mouse,camera);
	const hits = raycaster.intersectObjects(scene.children,true);

	if(hits.length>0){
	const o = hits[0].object;
	if(o.userData.clickable){
			if(lastHovered !== o){
				if(lastHovered){
					if(lastHovered.material && lastHovered.material.emissive) lastHovered.material.emissive.setHex(0x000000);
				}
				if(o.material && o.material.emissive) o.material.emissive.setHex(0x222222);
				document.body.style.cursor = 'pointer';
				lastHovered = o;
			}
			return;
	}
	}
	if(lastHovered){
	if(lastHovered.material && lastHovered.material.emissive) lastHovered.material.emissive.setHex(0x000000);
	lastHovered = null;
	document.body.style.cursor = 'default';
	}
});

window.addEventListener("click",(e)=>{
	mouse.x = (e.clientX/innerWidth)*2-1;
	mouse.y = -(e.clientY/innerHeight)*2+1;

	raycaster.setFromCamera(mouse,camera);
	const hit = raycaster.intersectObjects(scene.children,true);

	if(hit.length>0){
	const obj = hit[0].object;

	if(obj.userData.clickable){
			// rotate a bit
			obj.rotation.y += Math.PI/4;
			// change to a new random color from palette
			const newColor = new THREE.Color(palette[Math.floor(Math.random()*palette.length)]);
			if(obj.material && obj.material.color){
				obj.material.color.copy(newColor);
			}
	}
	}
});

function animate(){
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
	camera.aspect = innerWidth/innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(innerWidth,innerHeight);
});
