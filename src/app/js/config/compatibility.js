angular.module("app").config(function() {
	var keyboardEvent = new KeyboardEvent('a'); 
	if(typeof(keyboardEvent.key) === 'undefined' && typeof(keyboardEvent.keyIdentifier) === 'undefined'){
		swal({
			title: 'Unsupported browser',
			html: 'Please try upgrading it <br/><br/>',
			type: 'error',
			allowOutsideClick: false,
			allowEscapeKey: false,
			closeOnConfirm: false, 
			closeOnCancel: false, 
			showConfirmButton: false
		});
	}
});