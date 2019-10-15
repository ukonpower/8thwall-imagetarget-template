import * as THREE from 'three';

declare var XR;
declare var XRExtras;

export class CustomPipelineModule{

	public xrModule: any;

	private scene: THREE.Scene;
	private camera: THREE.Camera;

	private obj: THREE.Object3D;

	constructor(){

		this.xrModule = {
			name: 'custom module',
			onStart: this.onStart.bind( this ),
			onUpdate: this.update.bind( this ),
			listeners: [
				{ event: 'reality.imagefound', process: this.showTarget.bind( this ) },
				{ event: 'reality.imageupdated', process: this.udpateTarget.bind( this ) },
				{ event: 'reality.imagelost', process: this.hideTarget.bind( this ) },
			],
		}

	}

	private onStart(){

		//XRからThree.jsのシーンやカメラを取得
		let {scene, camera} = XR.Threejs.xrScene();
				
		this.scene = scene;
		this.camera = camera;
		
		this.initScene();
		
		//カメラの位置と回転を8th wallに渡す
		XR.XrController.updateCameraProjectionMatrix({
			origin: this.camera.position,
			facing: this.camera.quaternion,
		})

	}

	private initScene(){

		//ライトの作成
		let light = new THREE.AmbientLight();
		this.scene.add( light );

		let dLight = new THREE.DirectionalLight();
		dLight.position.set( 5, 5, 5 );
		this.scene.add( dLight );

		//Boxの作成
		let geo = new THREE.BoxGeometry( 0.3, 0.3, 0.3 );
		let mat = new THREE.MeshStandardMaterial({ color: new THREE.Color( 0xdddddd )});
		let box = new THREE.Mesh( geo, mat );
		box.position.z = 0.15;

		this.obj = new THREE.Object3D();
		this.obj.add( box );
		this.obj.visible = false;

		this.scene.add( this.obj );

	}

	private update(){

	}

	private showTarget( args ){

		console.log( 'show' );
		
		//マーカーが表示されたらBoxも表示
		this.obj.visible = true;
		
		this.applyTransforms( args.detail );

	}

	private udpateTarget( args ){

		console.log( 'update' );

		this.applyTransforms( args.detail );

	}

	private hideTarget(){

		console.log( 'hide' );

		//マーカーを見失ったらBoxを非表示
		this.obj.visible = false;

	}

	//マーカーの位置と同期
	private applyTransforms( detail ){
		
		this.obj.position.copy( detail.position );
		this.obj.quaternion.copy( detail.rotation );
		this.obj.scale.set( detail.scale, detail.scale, detail.scale );

	}

}