<?php
	$query_str = $_GET["query_str"];
	
	
	//$query_str = "SELECT * FROM `nottingham` WHERE MIN > 2000 AND MIN < 4000";
	
	
	$servername = "localhost";
	$username = "root";
	$password = "";
	//header('Content-Type: application/json');
	// Create connection
	$conn = mysql_connect($servername, $username);
	
	if (!mysql_select_db('biocancer')) {
		die('Could not select database:' . mysql_error());
	}
	
	//$result = mysqli_query($conn,$query_str);
	$result = mysql_query($query_str);
	
	$rows = array();
	
	while($r = mysql_fetch_assoc($result)) {
		$rows[] = $r;
	}
	print json_encode($rows);
	//echo "Fuck danhuang";
	
	mysql_close($conn);
?>