import * as THREE from 'three';
window.THREE = THREE;

import { CustomPipelineModule } from './CustomPipelineModule';

declare var XR;
declare var XRExtras;

class APP{

	private customPipelineModule: CustomPipelineModule;

	constructor() {

		this.customPipelineModule = new CustomPipelineModule();
		

        if( XR ){

			this.init();
			
        }else{

			window.addEventListener('xrloaded', this.init.bind(this));
			
        }
    }

    private init() {

		XR.addCameraPipelineModules([
			XR.GlTextureRenderer.pipelineModule(),
			XR.Threejs.pipelineModule(),
			XR.XrController.pipelineModule(),
			XRExtras.AlmostThere.pipelineModule(),
			XRExtras.FullWindowCanvas.pipelineModule(),
			XRExtras.Loading.pipelineModule(),
			XRExtras.RuntimeError.pipelineModule(),
			this.customPipelineModule.xrModule,
		])

	XR.run({
		canvas: document.getElementById('canvas')
	})
		
    }

}

window.addEventListener('load',()=>{

	let app = new APP();

});