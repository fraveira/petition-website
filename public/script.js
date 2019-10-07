(function() {
	const ctx = document.getElementById('signcanvas').getContext('2d');
	const drawing = document.getElementById('signcanvas');
	const signature = document.getElementById('signature');
	var axisX;
	var axisY;
	var clicked = false;

	// How to draw.

	var signing = function(x, y, clicked) {
		if (clicked) {
			ctx.strokeStyle = '#2971f0';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(axisX, axisY);
			ctx.lineTo(x, y);
			ctx.stroke();
		}
		axisX = x;
		axisY = y;
	};

	// Store the image data value in a variable

	function signatureToUrl() {
		var signatureUrl = drawing.toDataURL();
		signature.value = signatureUrl;
		console.log(signature.value);
	}

	// Call this when the submit button is clicked instead?//

	// The events: //

	drawing.addEventListener('mousedown', function(d) {
		clicked = true;
		signing(d.pageX - drawing.offsetLeft, d.pageY - drawing.offsetTop, false);
	});
	drawing.addEventListener('mousemove', function(d) {
		if (clicked == true) {
			signing(d.pageX - drawing.offsetLeft, d.pageY - drawing.offsetTop, true);
		}
	});

	drawing.addEventListener('mouseleave', function() {
		clicked = false;
	});

	drawing.addEventListener('mouseup', function() {
		clicked = false;
	});

	drawing.addEventListener('click', signatureToUrl); // Event happens when mouse is down and then leaves, aka click.
})();
