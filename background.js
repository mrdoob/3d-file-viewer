chrome.app.runtime.onLaunched.addListener( function ( launchData ) {

	chrome.app.window.create( 'index.html', {
			innerBounds: { width: 600, height: 600 },
			resizable: true,
			focused: true
		},
		function ( appWindow ) {
			// ugh
			appWindow.contentWindow.launchData = launchData;
		}
	);


} );
