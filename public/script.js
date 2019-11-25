(function() {
    const ctx = document.getElementById("signcanvas").getContext("2d");
    const drawing = document.getElementById("signcanvas");
    const signature = document.getElementById("signature");
    var axisX;
    var axisY;
    var clicked = false;

    var signing = function(x, y, clicked) {
        if (clicked) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(axisX, axisY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        axisX = x;
        axisY = y;
    };


    function signatureToUrl() {
        var signatureUrl = drawing.toDataURL();
        signature.value = signatureUrl;
        console.log(signature.value);
    }

    drawing.addEventListener("mousedown", function(d) {
        clicked = true;
        signing(
            d.pageX - drawing.offsetLeft,
            d.pageY - drawing.offsetTop,
            false
        );
    });
    drawing.addEventListener("mousemove", function(d) {
        if (clicked == true) {
            signing(
                d.pageX - drawing.offsetLeft,
                d.pageY - drawing.offsetTop,
                true
            );
        }
    });

    drawing.addEventListener("mouseleave", function() {
        clicked = false;
    });

    drawing.addEventListener("mouseup", function() {
        clicked = false;
    });

    drawing.addEventListener("click", signatureToUrl); 

    $(".clear").on("click", function() {
        location.reload();
    });
})();
