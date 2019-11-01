window.addEventListener( 'load', function () {

	if ( Array.isArray( window.launchData.items ) ) {

		var item = window.launchData.items[ 0 ];

		item.entry.file( function ( file ) {

			viewer.src = URL.createObjectURL( file );

		} );

	}

} );