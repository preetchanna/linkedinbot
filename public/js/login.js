$(document).ready(function () {

    $('.footable').footable();


    toastr.options = {
        "closeButton": true,
        "debug": false,
        "progressBar": true,
        "preventDuplicates": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": "7000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    $(".ajax-form").submit(function (e) {
        var form = $(this);
        e.preventDefault();

        // var btnText = $(this).find(".ajax-caller").text();
        // var $Btn = $(this).find(".ajax-caller");
        // $(this).find(".ajax-caller").text("Processing");
        // $(this).find(".ajax-caller").addClass("disabled");
        var action = $(this).attr("action");

        makeAjaxCall(action, $(this).serialize());

        // $Btn.text(btnText);
        // $Btn.removeClass("disabled");

        return false;
    });

    function makeAjaxCall(action, data) {
        var l = $( '.ladda-button' ).ladda();
        l.ladda('start');
        $.ajax({
            url: action,
            type: "POST",
            dateType: "json",
			data: data
		}).done(function (result) {
            // console.log(result);
			// console.log("success");
			if(result.auth){
				window.location.href = result.intended;
                l.ladda('stop');
				return;
			} else {
				var res = JSON.parse(result);
                l.ladda('stop');
				if (res.redirect == "true") {
					window.location.href = res.path;
					return;
				}
				showResponseMsg(res);
			}
            // form.trigger("reset");
            // form.reset();
        }).fail(function (result) {
            // console.log(result.status);
            l.ladda('stop');
            if(result.status == 419){
                window.location.reload();
            }
            var res = result.responseJSON;//JSON.parse(result);
			// console.log("fail"+res);
            showResponseMsg(res);
        }).always(function (result) {
			// console.log("In always");
        });
    }

    function showResponseMsg(res) {
        var $toast
		// console.log(res.message+"("+res.code+")");
        if (res.code === "1000")
            $toast = toastr["success"](res.message, "Success");
        else if (parseInt(res.code) > 1000 && parseInt(res.code) < 2000)
            $toast = toastr["warning"](res.message, "Message");
        else{
            var errorString = '';
            errorString += res.message + "\n<br/>";
            if(res.errors !== "undefined"){
                for(index in res.errors){
                    errorString += res.errors[index] + "\n<br/>";
                }
            }
            $toast = toastr["error"](errorString, "Error");
        }   
    }

});