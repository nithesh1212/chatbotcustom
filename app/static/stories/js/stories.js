$(document).ready(function() {
	story = {};
	$("#prompt").hide();
	function getStories()
	{
	    $.get("/stories/read1", {},
			function(data)
			{
			    html = "<center>No stories found!</center>"
			    if(data[0])
			    {
			        html =""
                    $.each(data, function(idx, obj)
                    {
                        html += '<div class="story" objId='+obj._id.$oid+'>\
                                    <h4>'+ obj.storyName +'</h4> \
                                    <button type="submit" class="btn btn-default pull-right" id = "btnEdit" objId='+obj._id.$oid+'>\
                                    <span class="glyphicon glyphicon-edit" title = "Edit Story" ></span>\
                                    </button>\
                                     <button type="submit" class="btn btn-default pull-right" id = "btnDelete" objId='+obj._id.$oid+'>\
                                    <span class="glyphicon glyphicon-trash" title = "Delete Story"></span>\
                                    </button>\
                                     <button type="submit" class="btn btn-default pull-right" id = "btnTrain" objId='+obj._id.$oid+'>\
                                    <span class="glyphicon glyphicon-road" title = "Train"></span>\
                                    </button>\
                                    <button type="submit" class="btn btn-default pull-right" id = "btnBuild" objId='+obj._id.$oid+'>\
                                    <span class="glyphicon glyphicon-ok-sign" title = "Build Model" ></span>\
                                    </button>\
                                    </div>';
                    });
                }
				$('.stories').html(html);
			});
	}

	function goStories(botid)
	{
	    window.location.href='/stories/home/'+botid
	}


	getStories();


	$("#btnCreateStory").click(function()
	{

		if($("#storyName")[0].value && $("#intentName")[0].value && $("#speechResponse")[0].value )
		{
			if($("input#apiTrigger")[0].checked)
			{
				story.apiTrigger = true;
				story.apiDetails = {
				    "isJson":true,
				    "isHeader":true,
					"url":$("input#apiUrl")[0].value,
					"requestType":$( "select#requestType option:selected" )[0].value,

				};
				if($("input#isJson")[0].checked)
				{
				    story.apiDetails.isJson = true;
				    story.apiDetails.jsonData = $("textarea#jsonData")[0].value;
                }
                if($("input#isHeader")[0].checked)
				{
				    alert("My name id Header")
				    story.apiDetails.isHeader = true;
				    story.apiDetails.headerData = $("textarea#headerData")[0].value;
                }


			}else{
				story.apiTrigger = false ;
			}
			story.storyName=$("#storyName")[0].value;
			story.intentName=$("#intentName")[0].value;
			story.speechResponse=$("#speechResponse")[0].value;
			story.botId=$("#botid")[0].value;
			console.log(story);
			$.ajax({
				url: '/stories/read',
				type: 'POST',
				data: JSON.stringify(story),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: false,
				success: function(msg) {
				    alert("Story created successfully.");
					goStories(story.botId);
					story = {};
					//$(".panel-footer")[0].innerHTML="";
					//$("#storyName")[0].value="";
					//$("#intentName")[0].value="";
					//$("#speechResponse")[0].value="";
				},
				error:function(msg)
				{
				alert("Can't create story");
				gotories(story.botId);
				story={};
				}

			});
        }

	});

    $("#uploadCSV").click(function()
	{
	    //alert("File uploading.........")
	    document.getElementById("status").textContent="Uploading............."
	    var data1 = new FormData();
	    var botId=$('#upbotId')[0].value;
        jQuery.each(jQuery('#file')[0].files, function(i, file) {
    data1.append('file', file);});
	    $.ajax({
				url: '/stories/fileupload/'+botId,
				data: data1,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
                success: function(data1){
                    alert("Successfully Uploaded");
                    window.location.href='/stories/home/'+botId

            },
            error:function(msg)
				{
				alert("Unable to upload file");

				document.getElementById("status").textContent="Solutions:<br> 1.Check CSV template<br> 2.Story might already be present."


				story={};
				}
			});

	});



	$(document).on('click', "button#btnEdit", function() {
		_id = $(this).attr("objId");
		window.open("edit/"+_id);
	});

	$(document).on('click', "button#btnTrain", function() {
		_id = $(this).attr("objId");
		window.open("/train/"+_id);
	});

	$(document).on('click', "button#btnDelete", function() {
		var r =confirm("Do yo   u want to continue?");
		if (r == true)
		{
			_id = $(this).attr("objId");
			$.ajax({
				url:"/stories/"+_id,
				type: 'DELETE',
				success: function(result) {
					 $( "div[objId="+_id+"]" ).remove();
					 getStories();
				}
			});
		}
	});

	$(document).on('change', "input#paramRequired", function() {
		 if(this.checked){
		 	$("#prompt").show();
		 }else{
		 	$("#prompt").hide();
		 }

	});

	$(document).on('change', "input#apiTrigger", function() {
		 if(this.checked){
		 	$("input#apiUrl").prop( "disabled", false );
		 	$("select#requestType").prop( "disabled", false );
		 	$("input#isJson").prop( "disabled", false );
		 	$("input#isHeader").prop( "disabled", false );

		 }else{
		 	$("input#apiUrl").prop( "disabled", true );
		 	$("select#requestType").prop( "disabled", true );
		 	$("input#isJson").prop( "disabled", true );
		 	$("input#isJson").prop( "checked", false );
		 	$("input#isHeader").prop( "disabled", false );
		 	$("textarea#jsonData").hide();
		 	$("textarea#headerData").hide();
		 }
	});

    $(document).on('change', "input#isJson", function() {
		 if(this.checked){
		 	$("textarea#jsonData").show();
		 }else{
            $("textarea#jsonData").hide();
		 }
	});

    $(document).on('change', "input#isHeader", function() {
		 if(this.checked){
		 	$("textarea#headerData").show();
		 }else{
            $("textarea#headerData").hide();
		 }
	});

	renderParams =function() {

		html ='<div class="row"><div class="col-md-2"><h4>No</h4></div> <div class="col-md-2"><h4>Name</h4></div> <div class="col-md-2"><h4>Required</h4></div> <div class="col-md-2"><h4>Prompt</h4></div> </div>';


		$.each(story.parameters, function( index, param )
		{
			if(!param.required){
				req = "False";
				prom = "_";

			}else{
				req = "True";
				prom = param.prompt;
			}
					html +='<div class="row"><div class="col-md-2">'+(index+1)+'</div> <div class="col-md-2">'+param.name+'</div> <div class="col-md-2">'+req+'</div> <div class="col-md-2">'+prom+'</div> </div>';
		});

		$("#param")[0].innerHTML=html;

    }

	$(document).on('click', "button#btnAddParam", function()
	{
		if(!$("#paramName")[0].value){
			alert("Param name cant be empty");
			$("#paramName")[0].focus();
			return;
		}else{
			if($("#paramRequired")[0].checked && !$("#prompt")[0].value){
				alert("prompt cant be empty");
				$("#prompt")[0].focus();
				return;
			}
		}

		param = {
			"name":$("#paramName")[0].value,
			"type":$("#paramEntityType")[0].value
		}

		$("#paramName")[0].value="";

		 if($("#paramRequired")[0].checked){
			param.required=$("#paramRequired")[0].checked;
				param.prompt=$("#prompt")[0].value;
		 }
		 $("#paramRequired")[0].value="";
		 $("#prompt")[0].value="";
		 if(!story.parameters){
		 	story.parameters = [];
		 }
		 story.parameters.push(param);
		 renderParams();
	});


	$(document).on('click', "button#btnBuild", function() {
		_id = $(this).attr("objId");
		$.post("/core/buildModel/"+_id, {
			},
			function(data) {
			console.log(data);
                if(data.errorCode)
                {
                    alert(data.description);
                }else if (data.result)
                {
                    alert("Sucess");
                }
			});
	});

});
