<?php
	error_reporting(0);
	include "db_prop_tools.php";

	$values = json_decode($_POST['myData'],true);
	
	$objects = $values["myData"];
	
	$len = count($objects);
	
	$sql_stmt = "SELECT * FROM `nottingham` WHERE ";
	$cur = 0;
	
	foreach( $objects as  $query ) {
		if(strcmp ($query['colType'],"STRING") == 0 ) { //String
			$sql_stmt .= $query['colName'] . " = '" . $query['matchString'] . "'";
		} else { //Digital
			if(strcmp($query['digiFilterType'],"Accruate") == 0) {
				$sql_stmt .= $query['colName'] . " = " . $query['digiFilterMath'] . " " ;
			} else {
				$sql_stmt .= $query['colName'] . " > " . $query['digiFilterFrom'] 
							 . " AND " . $query['colName'] . " < " . $query['digiFilterTo'] . " ";
			}
		}
		$cur++;
		if($cur != $len)
			$sql_stmt .= "AND ";
	}
	
	//echo $sql_stmt;
	
	
	
	
	$servername = "localhost";
	$username = "root";
	$password = "";

	// Create connection
	$conn = mysql_connect($servername, $username);
	
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	//echo "Connected successfully <br>";

	if (!mysql_select_db('biocancer')) {
		die('Could not select database: ' . mysql_error());
	}
	
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
	}
	
	$col_num = count($row_names);
	
	//echo "\n col_num = ".$col_num;
?>
<html>
  <head>
	<link rel="stylesheet" type="text/css" href="css/bio.css">
	
	<link rel="stylesheet" href="css/d3.slider.css">
	
	<!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>-->
	<script type="text/javascript" src="js/gsu.util.js"></script>
	<script type="text/javascript" src="js/biodataobj.js"></script>
	<script type="text/javascript" src="js/parseobject.js"></script>
	<script type="text/javascript" src="js/htmltablobj.js"></script>
	<script type="text/javascript" src="js/popupdialog.js"></script>
	<script type="text/javascript" src="js/popupdialog1.js"></script>
	<script type="text/javascript" src="js/svgcanvas.js"></script>
	<script type="text/javascript" src="js/svgscatterchart.js"></script>
	<script type="text/javascript" src="js/svgheatmap.js"></script>
	<script type="text/javascript" src="js/svgparacoord.js"></script>
	<script type="text/javascript" src="js/svgchart.js"></script>
	<script type="text/javascript" src="js/gsu.slider.js"></script>
	<script type="text/javascript" src="js/colormix-2.0.0.js"></script>
	<script type="text/javascript" src="js/pcdialog.js"></script>
	
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script type='text/javascript' src='js/jquery.simplemodal.js'></script>
	<script src="js/d3.js"> </script>
	<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
	
	
	<link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">
	
	<script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
	
    <script type="text/javascript">
	
/**
We convert a JSon Object array to an array of BioDataCase object.
**/
function parseJosnObj(json_obj_arr) {
	var res = [];
	var i,j;
	for(i=0;i<json_obj_arr.length;i++){
		var json_obj = json_obj_arr[i];
		var props = [];
		var values = [];
		var value;
		//var key_name_arr = Object.keys(json_obj);
		for (var property in dbRowProps) {
			if (dbRowProps.hasOwnProperty(property)){
				//console.log("property = " + property);
				eval ("value = json_obj['" + property +"']");
				var prop_name; 
				if(dbRowProps[property] == "DECIMAL")
					prop_name = property + "n";
				else if(dbRowProps[property] == "CATGORICAL")
					prop_name = property + "c";
				else 
					prop_name = property + "s";
				props.push(prop_name);
				values.push(value);
			}
		}
		//console.log("done with one case");
		var bcase = new BioDataCase(props,values);
		res.push(bcase)
	}
	//console.log(res);
	return res;
}

		var google_spreadsheet_url = "https://spreadsheets.google.com/feeds/list/1VIOL9tepP3CXmdkvdZt8kEws3mNV1ZQPSyqRj25zYCc/od6/public/basic?alt=json";
		var superFullData;
		var superDataCases;
		var fullData;
		var dataCases;
		var mainCanvas;
		var dataTable;
		
		
		dbRowProps = {} ;
		var i=0;
		
		
		<?php
			for($i = 0;$i<count($row_names);$i++) {
				echo "dbRowProps['".$row_names[$i] . "']='" . getColDBType($row_names[$i]) . "';\n";
			}
		?>
		
		
		//console.log(dbRowProps);
		
		$.ajax({
				url:   "do_real_query.php",
				type:     "GET",
				data: {query_str:"<?php echo $sql_stmt?>"},
				dataType: "json",
				success: function(data){
					
					//console.log(data);
					/*
					//var biocase = BioDataCase();
					
					var i =0;
					for(i=0;i< data.length;i++) {
						console.log(data[i]);
					}
					
					//addJsId2JSon(data);
					//superFullData = data;*/
					superDataCases = parseJosnObj(data);
					dataCases = superDataCases;
					//console.log(dataCases[0]);
					startPage(dataCases);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
						//console.log(arguments);
						console.log("Status: " + textStatus);
						console.log("Error: " + errorThrown);
						//cleanSendObjArray(curObjIndex);
				},
		});
		
		function addJsId2JSon(data) {	
			var rows = data["feed"]["entry"].length;
			var i = 0;
			for(i=0;i<rows;i++)
				data["feed"]["entry"][i].js_id = i;
		}
		
		function observeSubsetData(id_arr) {
			console.log("id_arr = " + id_arr);
			dataCases = [];
			var i = 0;
			for(i=0;i<superDataCases.length;i++) {
				if( inArrayGSU(superDataCases[i].getPropVal("js_id"),id_arr) )
					dataCases.push(superDataCases[i]);
			}
			
			turncateHTMLPage();
			addTable();
			var popup = new PopUpDialog("content", dataCases[0].getAllNumericalProps(),dataCases[0].getAllNumeratedProps());
			popup.addPopup();
			setupListner();
			
			//we still use the old mainCanvas obj since it keeps
			//the info of all the plotted digrams.
			mainCanvas.updateTblObj(dataTable);
			mainCanvas.updateDataCase(dataCases);
			mainCanvas.refresh();
			
			//startPage();
			//mainCanvas
		}
		
		function startPage() {
			turncateHTMLPage();
			//fullData = data;
			//dataCases = parseGoglJSonObj(fullData);
			configuratePage();
		}
		
		function turncateHTMLPage() {
			document.getElementById("test").innerHTML = "";
			document.getElementById("content").innerHTML = "";
			document.getElementById("table_body_div").innerHTML = "";
			document.getElementById("table_header_div").innerHTML = "";
		}
		
		function configuratePage() {
			addTable();
			var popup = new PopUpDialog("content", dataCases[0].getAllNumericalProps(),dataCases[0].getAllNumeratedProps());
			popup.addPopup();
			setupListner();
			mainCanvas = new SVGCanvas("test",dataTable);
			mainCanvas.updateDataCase(dataCases);
			//testCanvas();
			//draw1(dataCases);
		}
		
		function addTable() {
			var tableData = [];
			var i=0;
			for(i=0;i<dataCases.length;i++) {
				tableData.push(dataCases[i].getAllValues());
			}
			dataTable = new HTMLTable(tableData,dataCases[0].getAllPropNames(),"table_header_div","table_body_div");
			dataTable.addTable();
		}
		
		$(document).ready(function()
		{
			$("#table_body_div").scroll(function () { 
				$("#table_header_div").scrollTop($("#table_body_div").scrollTop());
				$("#table_header_div").scrollLeft($("#table_body_div").scrollLeft());
			});
		});
		
		function setupListner() {
			jQuery(function ($) {
			// Load dialog on page load
			//$('#basic-modal-content').modal();
			//$('#basic-modal-content').modal();
			// Load dialog on click
			$('#basic-modal .flatbtn').click(function (e) {
				$('#basic-modal-content').modal();
				return false;
				});
			});
		}
		
		function draw() {
			if (document.getElementById("group2_1").checked){
					drawScatter();
					$.modal.close();
			}
			else if (document.getElementById("group2_2").checked) {
				//color coding
					tmp = document.getElementById("x_field");
					x_field = tmp.options[tmp.selectedIndex].value;

					tmp = document.getElementById("y_field");
					y_field = tmp.options[tmp.selectedIndex].value;
					if ( x_field=="" || y_field=="") {
						document.getElementById("alertmsg").innerHTML = "Please select field X, Y";
					} else {
						$.modal.close();
						g_equation_config = new EquationDialog("equation", dataCases[0].getAllNumericalProps(),dataCases[0].getAllNumeratedProps(),x_field,y_field,"g_equation_config");
						g_equation_config.addEquEditor();	
					}
			} else if(document.getElementById("group2_3").checked){
				//parallel coordinate
					$.modal.close();
					pcdialog= new PCDialog("equation", dataCases[0].getAllNumericalProps(),dataCases[0].getAllNumeratedProps(),x_field,y_field,"pcdialog");
					pcdialog.addEquEditor();	
					//drawPCG();
			}
		}
		
		function drawHeatmap(params) {
			var x = [];
			var y = [];
			for(i=0;i<dataCases.length;i++) {
					x.push(dataCases[i].getPropVal(params.x_axis));
					y.push(dataCases[i].getPropVal(params.y_axis));
			}
			
			console.log("drawHeatmap params = ");
			console.log(params);
			
			params.x_data = x;
			params.y_data = y;
			params.full_data = dataCases;
			$.modal.close();
			mainCanvas.add(params)
		}
		
		function drawPCG(params) {
			$.modal.close();
			console.log("drawPCG params = ");
			console.log(params);
			params.full_data = dataCases;
			mainCanvas.add(params);
		}
		
		/**
			To draw 
		**/
		function drawScatter() {
			var tmp;
			tmp = document.getElementById("x_field");
			x_field = tmp.options[tmp.selectedIndex].value;

			tmp = document.getElementById("y_field");
			y_field = tmp.options[tmp.selectedIndex].value;
			
			tmp = document.getElementById("z_field");
			z_field = tmp.options[tmp.selectedIndex].value;

			tmp = document.getElementById("d_field");
			d_field = tmp.options[tmp.selectedIndex].value;

			if ( x_field=="" || y_field=="") {
				document.getElementById("alertmsg").innerHTML = "Please select field X, Y";
			} else if( x_field == y_field) {
				document.getElementById("alertmsg").innerHTML = "Field X and Y are same";
			} else if( y_field == z_field) {
				document.getElementById("alertmsg").innerHTML = "Field Y and Z are same";
			} else if( x_field == z_field) {
				document.getElementById("alertmsg").innerHTML = "Field X and Z are same";
			} else {
				document.getElementById("alertmsg").innerHTML = "";
				var x = [];
				var y = [];
				var z = [];
				var c = [];
				for(i=0;i<dataCases.length;i++) {
					x.push(dataCases[i].getPropVal(x_field));
					y.push(dataCases[i].getPropVal(y_field));
					if(z_field != undefined && z_field != null && z_field.trim() != "")
						z.push(dataCases[i].getPropVal(z_field));
					if(d_field != undefined && d_field != null && d_field.trim() != "")
						c.push(dataCases[i].getPropVal(d_field));
				}
				
				var params = { x_data:x, y_data:y,x_axis:x_field,y_axis:y_field,type:"scatter"};
			  
				if(z_field != undefined && z_field != null && z_field.trim() != ""){
					params.z_data = z;
					params.z_axis = z_field;
				} else {
					params.z_data = null;
					params.z_axis = null;
				}
				
				if(d_field != undefined && d_field != null && d_field.trim() != ""){
					params.c_data = c;
					params.c_axis = d_field;
				} else {
					params.c_data = null;
					params.c_axis = null;
				}
				
				mainCanvas.add(params);
			}
		}
		
		function addDiagram() {
			var x = [];
			var y = [];
			var z = [];
			var c = [];
			var i = 0;
			for(i=0;i<dataCases.length;i++) {
				x.push(dataCases[i].ph3n);
				y.push(dataCases[i].ki67n);
				z.push(dataCases[i].mfin);
				c.push(dataCases[i].racec);
			}
			
			var params = {x_data:x,y_data:y,z_data:z,c_data:c,x_axis:"ph3n",y_axis:"ki67n",z_axis:"mfin",c_axis:"racec",type:"scatter"};
			console.log(params);
			mainCanvas.add(params);
		}
		
		function testCanvas() {
			
			var x = [];
			var y = [];
			var z = [];
			var c = [];
			var i = 0;
			for(i=0;i<dataCases.length;i++) {
				x.push(dataCases[i].ph3n);
				y.push(dataCases[i].ki67n);
				z.push(dataCases[i].mfin);
				c.push(dataCases[i].racec);
			}
			//console.log($(window).width());
			var params = {x_data:x,y_data:y,z_data:z,c_data:c,x_axis:"ph3n",y_axis:"ki67n",z_axis:"mfin",c_axis:"racec",type:"scatter"};
			mainCanvas.add(params);
			//mainCanvas.add(params);
			
			//mainCanvas.add(params);
			
			mainCanvas.add(params);
		}
		
		function handle_table_row_selection(index) {
			mainCanvas.toggle(index);
		}
		
		//var color = ColorMix.blend(69);
		//console.log(color);
		//alert('Your blended color is: rgb(' + color.red + ', ' + color.green + ', ' + color.blue + ')');
    </script>
  </head>
  <body>
	<div id="table_header_div" style="overflow:auto;overflow-x: hidden;">
			
	</div>
	<div id="table_body_div" style="overflow:auto;height:40%;">
			
	</div>
	<div id="content">
	
	</div>
	<div id="equation">
	
	</div>
	
	<svg width='100%' height='1000' id='test' style='background-color:grey'>
		
	</svg>
	
	<svg id='test_zcd' width='700' height='400' >
		
	</svg>
	
	<div id="dialog-confirm" title="Exclude others?" style="display:none">
		<p>
		<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>
			<span id="dialog-confirm-content">Do you want to remove all other points from this observation?</span>
		</p>
	</div>
	</body>
</html>