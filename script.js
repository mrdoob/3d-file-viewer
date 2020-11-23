import { Mesh, MeshStandardMaterial } from './three.module.js';
import { DRACOLoader } from './loaders/DRACOLoader.js';
import { FBXLoader } from './loaders/FBXLoader.js';
import { OBJLoader } from './loaders/OBJLoader.js';
import { PLYLoader } from './loaders/PLYLoader.js';
import { STLLoader } from './loaders/STLLoader.js';

window.addEventListener( 'load', function () {

	// Experimental: Don't do this at home
	
	const FAKE_JSON = '{"asset":{"version":"2.0"},"scenes":[{"name":"Scene"}],"scene":0}';
	const FAKE_SCENE = URL.createObjectURL( new Blob( [ FAKE_JSON ], { type: "application/json" } ) );

	const DEFAULT_MATERAL = new MeshStandardMaterial( { color: 0x606060, roughness: 1.0, metalness: 0.0 } );

	// console.log( Object.getOwnPropertySymbols( viewer ) );
	
	const scene = viewer[ Object.getOwnPropertySymbols( viewer )[ 14 ] ];
	
	function setCustomObject( object ) {
		
		viewer.src = FAKE_SCENE;
		scene.model.setObject( object );

	}
	
	function handleFile( file ) {

		const extension = file.name.split( '.' ).pop().toLowerCase();
		const reader = new FileReader();

		switch ( extension ) {

			case 'drc':

				reader.addEventListener( 'load', function ( event ) {

					const loader = new DRACOLoader();
					loader.setDecoderPath( './libs/' );
					loader.setDecoderConfig( { type: 'js' } );
					loader.decodeDracoFile( event.target.result, function ( geometry ) {

						geometry.computeVertexNormals();

						setCustomObject( new Mesh( geometry, DEFAULT_MATERAL ) );

					} );						

				}, false );
				reader.readAsArrayBuffer( file );

				break;
				
			case 'fbx':
				
				reader.addEventListener( 'load', function ( event ) {

					const object = new FBXLoader().parse( event.target.result );

					object.traverse( function ( child ) {

						const material = child.material;
						
						if ( material && material.isMeshPhongMaterial ) {

							child.material = DEFAULT_MATERAL;

						}

					} );
					
					setCustomObject( object );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'glb':
			case 'gltf':
				
				viewer.src = URL.createObjectURL( file );

				break;

			case 'obj':

				reader.addEventListener( 'load', function ( event ) {

					const object = new OBJLoader().parse( event.target.result );

					object.traverse( function ( child ) {

						const material = child.material;

						if ( material && material.isMeshPhongMaterial ) {

							child.material = DEFAULT_MATERAL;

						}

					} );

					setCustomObject( object );

				}, false );
				reader.readAsText( file );

				break;

			case 'ply':

				reader.addEventListener( 'load', function ( event ) {

					const geometry = new PLYLoader().parse( event.target.result );

					geometry.computeVertexNormals();

					setCustomObject( new Mesh( geometry, DEFAULT_MATERAL ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'stl':

				reader.addEventListener( 'load', function ( event ) {

					const geometry = new STLLoader().parse( event.target.result );

					setCustomObject( new Mesh( geometry, DEFAULT_MATERAL ) );

				}, false );
				reader.readAsBinaryString( file );

				break;

		}

	}
	
	/*
	
	document.addEventListener( 'dragover', function ( event ) {

		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';

	}, false );

	document.addEventListener( 'drop', function ( event ) {

		event.preventDefault();

		handleFile( event.dataTransfer.files[ 0 ] );

	}, false );

	*/

	if ( Array.isArray( window.launchData.items ) ) {

		var item = window.launchData.items[ 0 ];

		item.entry.file( handleFile );

	}

} );