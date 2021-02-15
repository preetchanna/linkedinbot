$(document).ready(function () {
    
    $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    $('[rel="tooltip"]').tooltip({ trigger: 'hover' });

    var submitBtn = $('.btn-primary[type="submit"]').ladda();

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

	/*
	*
	*
	* Function to initiate ajax request for all the forms
	*
	*
	*/
	$('.submit-data-ajax').submit(function(e){
		e.preventDefault();
		var form = $(this);
          var l = $( '.ladda-button' ).ladda();
          // Start loading
          l.ladda('start');
		var intendedURL = form.attr("action");
		var jqxhr = $.ajax({
			method: "POST",
			dataType: "json",
			url: intendedURL,
			data: form.serialize()
		})
		  .done(function(data) {
			message = data["message"];
            if(data["redirect"]){
                toastr.options.onHidden = function() {
                    window.location = data["redirect"];
                }
            }
            l.ladda('stop');
            toastr["success"](message);
		  })
		  .fail(function(data) {
              // console.log(data.status);
              if(data.status == 419){
                // toastr.options.onHidden = function() {
                    window.location.reload();
                // }
              }
			  var error = data.responseJSON;
			  var errorString = '';

              if(error["message"] !== "undefined" && error["message"] != ''){
                    errorString += error["message"] + "\n<br/>";
                    if(error.errors !== "undefined"){
                        for(index in error.errors){
                            errorString += error.errors[index] + "\n<br/>";
                        }
                    }
                }

                l.ladda('stop'); 
				toastr["error"](errorString);
		  })
		  .always(function(data) {
			  // console.log(data);
			// alert( "complete" );
		  });
	});
	/*
	*
	*
	* Function to delete data
	*
	*
	*/
	$(".delete-data-ajax").on("click",function(e){
	e.preventDefault();
	var form = $(this);
	var intendedURL = form.attr("href");
    if(intendedURL.includes("mobile")){
        var textContent = "This record can be restored later.";
    } else {
        var textContent = "This action cannot be undone.";
    }

	swal({
            title: "Are you sure?",
            text: textContent,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
    }, function () {
        swal({title: "Processing...",text: "Please be patient, It will be completed soon.",type: "info",showConfirmButton: false});
		//Confirmation
		$.ajax({
			method: "GET",
			dataType: "json",
			url: intendedURL
		})
		.done(function(data) {
			message = data["message"];
			swal({title: "Deleted!",text: message,type: "success"}, function(){ location.reload(); });
			// toastr["success"](message);
		})
		.fail(function(data) {
            var errorString = '';
            var errorString_swal = '';

            if(data.responseText){
                var resT = data.responseText;
                if(resT.includes("login")){
                    errorString = "Session has expired. Redirecting...";
                    window.location.reload();
                }
            }

            if(data.responseJSON){
                var error = data.responseJSON;
                if(error["message"] !== "undefined" && error["message"] != ''){
                    // errorString += error["message"] + "\n<br/>";
                    if(error.errors !== "undefined"){
                        for(index in error.errors){
                            errorString += error.errors[index] + "\n<br/>";
                            errorString_swal += error.errors[index] + "\n";
                        }
                    }
                }
            }
			swal({title: "Warning",text: errorString_swal,type: "warning"}, function(){ location.reload(); });
			toastr["error"](errorString);
		});
    });
});
	/*
	*
	*
	* Function to view data
	*
	*
	*/
	$('#myModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget); // Button that triggered the modal
		var title = button.data('title'); // Extract info from data-* attributes
		var sub_url = button.data('url');
		var url_id = button.data('id');
		
		  var modal = $(this);
		  modal.find('.modal-title').html(title);
		  
		  var intendedURL = APP_URL + sub_url + url_id;
          spinnerHTML = '<div class="spiner-example">';
          spinnerHTML += '<div class="sk-spinner sk-spinner-wandering-cubes">';
          spinnerHTML += '<div class="sk-cube1"></div><div class="sk-cube2"></div>';
          spinnerHTML += '</div></div>';
		  modal.find('.modal-body').html(spinnerHTML);
		  
		  $.ajax({
			method: "GET",
			dataType: "json",
			url: intendedURL,
            // statusCode: {
            //     302: function(){
            //         console.log("moved");
            //     }
            // },
            // headers: {
            //     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            // }
		  })
		  .done(function(data) {
			modal.find('.modal-body').html(data["html"]);
		  })
		  .fail(function(data, textStatus, errorThrown) {
                var errorString = '';

                if(data.responseText){
                    var resT = data.responseText;
                    if(resT.includes("login")){
                        errorString = "Session has expired. Redirecting...";
                        window.location.reload();
                    }
                }                

                if(data.responseJSON){
                    var error = data.responseJSON;
                    if(error["message"] !== "undefined" && error["message"] != ''){
                        errorString += error["message"];
                    // } else {
                        for(index in error.errors){
                            errorString += error.errors[index] + "\n<br/>";
                        }
                    }
                }
				modal.find('.modal-body').html(errorString);
		  });
	});


    $('.view-data').click(function (e) {
    
        $("#myModal").find(".modal-body").html("Loading...");

        $("#myModal").find(".modal-title").text("...");
        var title = $(this).closest("tr").find("td:nth-child(2)").text();

        // view contact in mobiles view
        if( $(this).siblings("span").length )
            title = $(this).siblings("span").text();

        $.ajax({
            url: "http://52.24.176.32/msrs/public/" + $(this).attr("data-url") + "/callapi",
            type: "POST",
            dateType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {
                number: $(this).attr("data-id"),
                contact_id: $(this).attr("data-id"),
                action: $(this).attr("data-action"),
                assigned_id: $(this).attr("data-assigned-id")
            },
            success: function (result) {
                var res = JSON.parse(result);
                
                if(res.code != "1000")
                {
                    var html = '<strong>'+res.message+'</strong>';
                }
                else{
                    if(typeof res.docs !== "undefined"){
                         var docs = res.docs.data;
                        var base_path = res.base_path;
                    }   
                    res = res.data;
                    var html = '<table class="table m-0"><tbody>';
                    for (var key in res) {
                        html += '<tr><td>' + key.split("_").pop() + '</td><td>' + res[key] + '</td></tr>';
                    }
                    html += '</tbody></table>';
                    
                    if(typeof docs !== "undefined" && docs.length > 0){
                        html += '<div class="mail-box"><div class="mail-attachment">';
                        html += '<p><span><i class="fa fa-paperclip"></i> '+docs.length+' attachments</span>';
                        // html += '<a href="#">Download all</a>|<a href="#">View all images</a>';
                        html += '</p>';
                        html += '<div class="attachment">';
                        for (var key in docs) {
                            var docName = docs[key]["path"];
                            var docExt = docName.split('.').pop();
                            html += '<div class="file-box"><div class="file">';
                            html += '<a href="'+APP_URL+'/contact/downloadDoc/'+window.btoa(docs[key]["id"])+'"><span class="corner"></span>';
                            if(docExt == "pdf"){
                                html += '<div class="icon"><i class="fa fa-file"></i></div>';                
                            } else {
                                html += '<div class="image"><img alt="image" class="img-fluid" src="'+base_path+"/"+docName+'"></div>';                
                            }
                            html += '<div class="file-name">'+docs[key]["path"]+'<br/><small>Added: '+docs[key]["created_at"]+'</small></div>';
                            html += '</a></div></div>';
                        }
                        html += '<div class="clearfix"></div>';
                        html += '</div></div>';
                    }
                }
                $("#myModal").find(".modal-title").text(title);
                $("#myModal").find(".modal-body").html(html);
            },
            fail: function (result) {
                console.log("Error: " + result);
            }
        });
    });

    $('.view-file').click(function (e) {

        //$("#fileModal").find(".modal-body").html("Loading...");
        var contact_id = $(this).attr("data-id");
        var rowId = $(this).attr("data-row-id");

        // view contact in mobiles view
        if( $(this).siblings("span").length )
            title = $(this).siblings("span").text();
        
        reloadDocList(rowId);
        
        var row_id = $(this).attr("data-row-id");
        $('#upload_form').attr('action', "upload/"+rowId);
        $('#upload_form').find('input[name=contact_id]').val(contact_id);
        $('.progress-bar').text('0%');
        $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
    });

    $('#upload_form').ajaxForm({
          beforeSend:function(){
              $('#success').empty();
              $('.progress-bar').text('0%');
              $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
          },
          uploadProgress:function(event, position, total, percentComplete)
          {
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').css('width', percentComplete + '%');
          },
            success: function (result) {
                var res = JSON.parse(result);

                if (res.code == "1000"){
                    $('.progress-bar').text('Uploaded');
                    $('.progress-bar').css('width', '100%');
                    $('#ident_file').val('');
                    reloadDocList($(this).attr('url').split("/")[1]);
                }
                else{
                    $('.progress-bar').text('0%');
                    $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
                }
                showResponseMsg(res);
            },
            fail: function (result) {
                var res = JSON.parse(result);
                $('.progress-bar').text('0%');
                $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
                showResponseMsg(res);
            }
    });
    
    $('.delete-data').click(function (e) {
        e.preventDefault();
        var $This = $(this);
        var form = {
            action:  $(this).attr("data-action"),
            number:  $(this).attr("data-id"),
            contact_id:  $(this).attr("data-id")
        };
        var url = $(this).attr("data-url");
        var rowId = $(this).attr("data-row-id");
        if(url == "mobile")
            var msg = "You can restore the number later";
        else
            var msg = "You can restore the contact later";
        swal({
            title: "Are you sure?",
            text: msg,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            closeOnConfirm: true
        },function (isConfirm) {
            if ($(".sweet-alert .checkbox-container #delete_admin_id").prop("checked")) 
                form["delete_admin_id"] = $(".sweet-alert .checkbox-container #delete_admin_id").val();
            if ($(".sweet-alert .checkbox-container #delete_registrant_id").prop("checked")) 
                form["delete_registrant_id"] = $(".sweet-alert .checkbox-container #delete_registrant_id").val();
            if (isConfirm) {
                $.ajax({
                    url: "http://52.24.176.32/msrs/public/"+url+"/callapi/"+rowId,
                    type: "POST",
                    dateType: "json",
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: form,
                    success: function (result) {
                        var res = JSON.parse(result);
                        if (res.code == "1000"){
                            location.reload(); 
                            // if( $This.closest("tr").next("tr.footable-row-detail").length )
                            //     $This.closest("tr").next("tr.footable-row-detail").remove();
                            
                            // $This.closest("tr").remove();
                        }
                        showResponseMsg(res);
                    },
                    fail: function (result) {
                        var res = JSON.parse(result);
                        showResponseMsg(res);
                    }
                });
            }
            $(".sweet-alert .checkbox-container").remove();
        });

        if(url == "mobile"){
            var html = '<div class="checkbox-container"><div class="checkbox checkbox-warning"> <input type="checkbox" name="delete_registrant_id" value="'+$(this).closest("tr").find(".registrant-contact").attr("data-id")+'" id="delete_registrant_id"> <label for="delete_registrant_id"> Delete Registrant Contact <b>'+$(this).closest("tr").find(".registrant-contact span").text()+'</b> </label> </div> <div class="checkbox checkbox-warning"> <input type="checkbox" name="delete_admin_id" value="'+$(this).closest("tr").find(".admin-contact").attr("data-id")+'" id="delete_admin_id"> <label for="delete_admin_id"> Delete Admin Contact <b>'+$(this).closest("tr").find(".admin-contact span").text()+'</b></label> </div> </div>';
            $(".sweet-alert .sa-button-container").before(html);
        }
    });

    $(".ajax-form").submit(function (e) {
        var form = $(this);
        e.preventDefault();
        if( !validateInputs(form) ) 
            return false;
        var ajaxUrl = $(this).attr("action");
        makeAjaxCall(ajaxUrl, $(this));
        return false;
    });

    /*$('.refresh-contacts').click(function (e) {
        var $This = $(this);
        $(this).find("span").hide();
        $(this).find(".sk-spinner").removeClass("d-none");

        $.ajax({
            url: "http://52.24.176.32/msrs/public/mobile/getcall",
            type: "POST",
            dateType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {
                action: "getAvailableContacts"
            },
            success: function (result) {
                var res = JSON.parse(result);
                var html = "";
                jQuery.each(res, function (index, row) {
                    html += '<option value="' + row.contact_id + '">' + row.name + '</option>';
                });
                if (html == '')
                    html = '<option value="0" disabled selected>No available contacts</option>';
                $(".contacts-dropdown").html(html);

                $This.find("span").show();
                $This.find(".sk-spinner").addClass("d-none");
            },
            fail: function (result) {
                console.log("Error: " + result);
                $This.find("span").show();
                $This.find(".sk-spinner").addClass("d-none");
            }
        });


    });*/

    function makeAjaxCall(ajaxUrl, form) {
        submitBtn.ladda('start');
        $.ajax({
            url: ajaxUrl,
            type: "POST",
            dateType: "json",
            data: form.serialize(),
            success: function (result) {
                var res = JSON.parse(result);
                if (res.redirect == "true") {
                    window.location.href = res.path;
                    return;
                } 

                showResponseMsg(res, form);
            },
            fail: function (result) {
                var res = JSON.parse(result);
                showResponseMsg(res);
            },
            complete: function (data) {
                submitBtn.ladda('stop');
            }
        });
    }

    function showResponseMsg(res, form = false){
        // console.log(form.find("input[name='action']").val());

        if (res.code == "1000") {
            var $toast = toastr["success"](res.message, "Success");

            if( form && (form.find("input[name='action']").val() == "createContact" || form.find("input[name='action']").val() == "create") )  
                form.trigger("reset");

            if( $('.refresh-contacts').length )
                $('.refresh-contacts').trigger("click");
        } 
        else if (parseInt(res.code) > 1000 && parseInt(res.code) < 2000)
            var $toast = toastr["warning"](res.message, "Message");
        else
            var $toast = toastr["error"](res.message, "Error");
    }

    function validateInputs(form){

        var mobile = /^(\+[0-9]{1,3}\.[0-9]{1,14})?$/;
        if( form.find("input[name='mobile']").val() )
            if(!mobile.test( form.find("input[name='mobile']").val() )){
                var $toast = toastr["error"]("Mobile format not correct.", "Error");
                return false; 
            }

        return true;
    }

    function reloadDocList(rowId){
        
        $.ajax({
            //url: "http://52.24.176.32/msrs/public/" + $(this).attr("data-url") + "/callapi",
            url: "http://52.24.176.32/msrs/public/" + $('.view-file').attr("data-url") + "/doc/" + rowId,
            type: "POST",
            dateType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (result) {
                var res = JSON.parse(result);
                res = res.data;

                var html = '';
                if(res.length > 0){
                    $.each(res, function(k, v) {
                        /// do stuff
                        html += '<tr>';
                        html += '<td>' + v.path + '</td><td>' + v.created_at + '</td>';
                        html += '<td>';
                        html += '<a href="'+APP_URL+'/contact/downloadDoc/'+window.btoa(v.id)+'" class="p-xxs text-info"><i class="fa fa-arrow-circle-down"></i></a>';
                        html += '<a href="javascript:deleteDoc();" class="p-xxs text-danger delete-doc" data-toggle="tooltip" data-placement="top" data-original-title="Delete Doc" data-action="deleteContactDoc" data-url="contact" data-id="'+rowId+'" data-doc-id="'+v.id+'" ><i class="fa fa-trash"></i></a>';
                        html += '</td>';
                        html += '</tr>';                        
                    });
                }
                else{
                    html = '<tr><td colspan="3">No results found</td></tr>';
                }
                $("#fileModal").find("tbody").html(html);
                
                /*$('.download-doc').click(function(e){
                    e.preventDefault();
                    var This = $(this);

                    var url = This.attr("data-url");
                    var docId = This.attr("data-doc-id");
                    var rowID = This.attr("data-id");

                    var form = {
                        action:  This.attr("data-action"),
                        rowId:  rowID,
                        contact_id: $('.view-file').attr("data-id")
                    };
                    
                    $.ajax({
                        url: APP_URL+"/"+url+"/downloadDoc/"+window.btoa(docId),
                        type: "POST",
                        dateType: "json",
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        data: form,
                        success: function (result) {
                            window.location = result;
                        },
                        error: function (result) {
                            toastr["warning"](result["responseJSON"][0], "Message");
                        }
                    });
                });*/
                //Add click event to docs
                $('.delete-doc').click(function (e) {
                    e.preventDefault();
                    var $This = $(this);
                    var form = {
                        action:  $(this).attr("data-action"),
                        rowId:  $(this).attr("data-id"),
                        contact_id: $('.view-file').attr("data-id")
                    };
                    var url = $(this).attr("data-url");
                    var docId = $(this).attr("data-doc-id");
                    var rowID = $(this).attr("data-id");

                    swal({
                        title: "Are you sure?",
                        text: "You can restore the document later",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: true
                    },function (isConfirm) {
                        if (isConfirm) {
                            $.ajax({
                                //url: "http://52.24.176.32/msrs/public/"+url+"/callapi/"+rowId,
                                url: "http://52.24.176.32/msrs/public/"+url+"/removeDoc/"+docId,
                                type: "POST",
                                dateType: "json",
                                headers: {
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data: form,
                                success: function (result) {
                                    var res = JSON.parse(result);
                                    if (res.code == "1000"){
                                        reloadDocList(rowID);
                                    }
                                    showResponseMsg(res);
                                },
                                fail: function (result) {
                                    var res = JSON.parse(result);
                                    showResponseMsg(res);
                                }
                            });
                        }
                        $(".sweet-alert .checkbox-container").remove();
                    });

                });

                $('.progress-bar').text('0%');
                $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
            },
            fail: function (result) {
                console.log("Error: " + result);
            }
        });
    }

    // $("#menu-toggle").click(function (e) {
    // 	e.preventDefault();
    // 	$("#wrapper").toggleClass("toggled");
    // });
});

function deleteMSRS(THS){
	var form = $(THS);
	var intendedURL = form.attr("href");
	swal({
            title: "Are you sure?",
            text: "This document cannot be restored later",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
    }, function () {
		//Confirmation
		$.ajax({
			method: "GET",
			dataType: "json",
			url: intendedURL
		})
		.done(function(data) {
			message = data["message"];
			swal({title: "Deleted!",text: message,type: "success"}, function(){ 
				var target = APP_URL + "/"+data["type"]+"/contact/doc/"+data["id"];
					// Reload the url and refresh content on the modal
					$.ajax({
					method: "GET",
					dataType: "json",
					url: target
					})
					  .done(function(data) {
						$('#fileModal .modal-body .documents').html(data);
					  });
			});
			// toastr["success"](message);
		})
		.fail(function(data) {
			var error = data.responseJSON;
            var errorString = '';
            if(error["message"] !== "undefined" && error["message"] != ''){
                    errorString += error["message"] + "\n<br/>";
                    if(error.errors !== "undefined"){
                        for(index in error.errors){
                            errorString += error.errors[index] + "\n<br/>";
                        }
                    }
                }
			toastr["error"](errorString);
		});
    });
}
