import { Mesh, MeshStandardMaterial } from './three.module.js';
import { OBJLoader } from './loaders/OBJLoader.js';
import { PLYLoader } from './loaders/PLYLoader.js';
import { STLLoader } from './loaders/STLLoader.js';	

window.addEventListener( 'load', function () {

	// Experimental: Don't do this at home

	const DEFAULT_MATERAL = new MeshStandardMaterial( { roughness: 1, metalness: 0.5 } );

	var canvas = viewer.shadowRoot.querySelector( 'canvas' );
	var poster = viewer.shadowRoot.querySelector( '.slot.poster' );

	var scene = viewer[ Object.getOwnPropertySymbols( viewer )[ 13 ] ];
	
	function setCustomObject( object ) {

		scene.model.setObject( object );

		setTimeout( function () {

			canvas.classList.add('show');
			poster.classList.remove( 'show' );

		}, 1000 );

	}

	//

	if ( Array.isArray( window.launchData.items ) ) {

		var item = window.launchData.items[ 0 ];

		item.entry.file( function ( file ) {

			var extension = file.name.split( '.' ).pop().toLowerCase();
			var reader = new FileReader();

			switch ( extension ) {

				case 'glb':

					viewer.src = URL.createObjectURL( file );

					break;

				case 'obj':

					reader.addEventListener( 'load', function ( event ) {

						var object = new OBJLoader().parse( event.target.result );

						object.traverse( function ( child ) {

							var material = child.material;

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

						var geometry = new PLYLoader().parse( event.target.result );

						setCustomObject( new Mesh( geometry, DEFAULT_MATERAL ) );

					}, false );
					reader.readAsArrayBuffer( file );

					break;

				case 'stl':

					reader.addEventListener( 'load', function ( event ) {

						var geometry = new STLLoader().parse( event.target.result );

						setCustomObject( new Mesh( geometry, DEFAULT_MATERAL ) );

					}, false );
					reader.readAsBinaryString( file );

					break;

			}

		} );

	}

} );