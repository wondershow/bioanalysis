<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script> 
<link rel="stylesheet" type="text/css" href="css/bio.css">
<script>
	g_selected_colname = "";
	g_row_value_type = undefined;
	g_row_value_real_type = undefined;
	g_row_value_max = undefined;
	g_row_value_min = undefined;
	g_query_obj = [];
	
	function getRowNumber() {
		e = document.getElementById("column_list");
		g_selected_colname = e.options[e.selectedIndex].value;
		url_str = "get_row_property.php?row_name="+g_selected_colname;
		$.ajax({
			type: "GET",
			url: url_str,
			datatype: "html",
//			data: dataString,
			contentType: "application/json; charset=utf-8",
			success: function(data) {
//				console.log("data is here");//do something;
				 
				console.log(data);
				tmp = data.split(",");
				
				g_row_value_real_type = tmp[0];
				
				if(g_row_value_real_type == 'decimal' || g_row_value_real_type == 'int'){
					g_row_value_type = 'DIGITAL';
					g_row_value_max = tmp[1];
					g_row_value_min = tmp[2];
				} else {
					g_row_value_type = 'STRING';
				}
				addRowFilter();
			},
		});
	}
	
	function getMaxValue(col_name) {
		
	}
		
	function addRowFilter() {
		var filter_html = "Please input your search criteria:<br><br>";
		if( g_row_value_type == "STRING" ) {
			filter_html += "Hint: The value type of selected column is String <br>"; 
			filter_html += g_selected_colname + " = " + "<input type='text' name='string_filter' id = 'string_filter'><br><br>";
			filter_html += "<br>";
		} else {
			if(g_row_value_real_type == "INT") {
				filter_html += "Hint: The value type of selected column is INT(Catagorical) <br>"
							   + "The max value is " + g_row_value_max + ", the min value is " + g_row_value_min + "<br>"; 
			} else {
				filter_html += "Hint: The value type of selected column is DECIMAL <br>"
							+ "The max value is " + g_row_value_max + ", the min value is " + g_row_value_min  + "<br>"; 
			}
			//filter_html += g_selected_colname + " = " + "<input type='text' name='string_filter' id = 'string_filter'><br>";
			filter_html += "<input type='radio' name='digital_filter_type' id='digital_filter_type' value='Accruate'>Accruate: ";
			filter_html += g_selected_colname + " = " + "<input type='text' name='digital_equal' size='10' id = 'digital_equal'>";
			filter_html += "<br><br>";
			
			filter_html += "<input type='radio' name='digital_filter_type' id='digital_filter_type' value='Range'>Range "
			filter_html += "<input type='text' size='4' name='digital_from' id = 'digital_from'>" +  " &lt; " + g_selected_colname + " &lt; " +  "<input type='text' size='4' name='digital_to' id = 'digital_to'>";
			filter_html += "<br><br>";
		}
		
		filter_html += "<input type='button' value='add' onclick='addFilter()'> </input>"
		filter_html += "<br>";
		document.getElementById("filter").innerHTML = filter_html;
		document.getElementById("myDialog").showModal();	
	}
	
	function addFilter() {
		var filter = {colName:null,colType:null,digiFilterType:null,digiFilterMath:null,digiFilterFrom:null,digiFilterTo:null};
		filter.colName = g_selected_colname;
		filter.colType = g_row_value_type;
		
		if(g_row_value_type == "STRING" ) {
			filter.matchString = document.getElementById("string_filter").value;
			document.getElementById("query_detail").innerHTML += filter.colName + " = " + filter.matchString + "<br>";
		} else {
			var digi_filter_type;// = document.getElementById("digital_filter_type").value;
			var radios = document.getElementsByName("digital_filter_type");
			for (var i = 0, length = radios.length; i < length; i++) {
				if (radios[i].checked) {
				// do whatever you want with the checked radio
				digi_filter_type = radios[i].value;
				filter.digiFilterType = radios[i].value;
				// only one radio can be logically checked, don't check the rest
				break;
				}
			}
			
			if(digi_filter_type == "Accruate") {
				filter.digiFilterMath = document.getElementById("digital_equal").value;
				document.getElementById("query_detail").innerHTML += filter.colName + " = " + filter.digiFilterMath + "<br>";
			} else {	
				filter.digiFilterFrom = document.getElementById("digital_from").value;
				filter.digiFilterTo = document.getElementById("digital_to").value;
				document.getElementById("query_detail").innerHTML += filter.digiFilterFrom + " &lt; "  + filter.colName + " &lt; " + filter.digiFilterTo + "<br>";
			}
		}
		
		
		document.getElementById("myDialog").close();
		g_query_obj.push(filter);
	}
	
	function submitQuery() {
		var dataToSend = { 
			dummy: "asdfasdfas", 
			data: g_query_obj
		};
		console.log("ajax submitting")
		
		
		var postData = 
		{
				"bid":1,
				"location1":"1","quantity1":2,"price1":3,
				"location2":"2","quantity2":2,"price2":3,
				"location3":"3","quantity3":2,"price3":3
		};
		
		
		$.ajax({
		type: 'POST',
        datatype: "json",
		url: "do_filter_query.php",
        data: {'myData': JSON.stringify(g_query_obj)},
		//data: "postData="+postData,
		
		//contentType: "html",
        
        success: function(rsp) {
			console.log("fuck");
			console.log(rsp);
			
        },
		error: function(e){
               // console.log(e.message);
        }
    });
		
		
	}
	
	function submitform() {
		var url = 'do_filter_query.php';
		$('#query_action').attr('action', url);
		var data = JSON.stringify({
			"myData" : g_query_obj
		})
		$('#myData').val(data).appendTo('#query_action');
		//$("#myData").
		$("#query_action").submit();
	}
	
	function submitform1()
	{   
	 var url = 'do_filter_query.php';
	 //var url = '/users/' + $('#user_id').val();
	 $('#myform').attr('action', url);
     var data = JSON.stringify({
        "userdata": $('#user_data').val()
     })
     $('<input type="hidden" name="json"/>').val(data).appendTo('#myform');
     $("#myform").submit();
	}
	
	
</script>

	<script type="text/javascript" src="js/popupdialog.js"></script>
	<link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">
	<script type='text/javascript' src='js/jquery.simplemodal.js'></script>
	<script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
	
	
	

</head>
<body>
<?php
error_reporting(0);

$servername = "localhost";
$username = "root";
$password = "";

// Create connection
$conn = mysql_connect($servername, $username);

//$conn = mysql_connect("localhost", "root")

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//echo "Connected successfully <br>";

if (!mysql_select_db('biocancer')) {
    die('Could not select database: ' . mysql_error());
}

//echo "DB selected <br>";


$result = mysql_query('SELECT `COLUMN_NAME` 
					FROM `INFORMATION_SCHEMA`.`COLUMNS` 
					WHERE `TABLE_SCHEMA`="biocancer" 
					AND `TABLE_NAME`="nottingham";');
if (!$result) {
    die('Could not query:' . mysql_error());
}

$row_names = [];

while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
	array_push($row_names, $row[0]);
	//printf("Row Name:%s <br>", $row[0]);
}

//print_r($row_names);




//echo mysql_result($result, 2); // outputs third employee's name
?>
			
			
			<select id="column_list">
			<?php
			  foreach ($row_names as $column_name) {
				echo "<option value=" . $column_name . ">" . $column_name . "</option> \n";
				//echo "<option> 1</option>";
			  }
			?>
			</select>
		
		
			
			<button onclick="getRowNumber()"> Add query </button>
			<button onclick="submitform()"> Submit Query </button>
		
			<form id="query_action" method='post' name="query_action" action="do_filter_query.php">
				<input type="hidden" id = "myData" name = "myData">
				<input type="hidden" id = "myData1" name = "myData1" value='zcd'>
			</form>
		
		<div id="query_detail">
			Query details: <br><br><br><br>
		</div>
		<dialog id="myDialog" width="30%" height="30%"> 
			<div id = "filter">
				
			</div>
		</dialog>
		
	
	
</body>
</html>