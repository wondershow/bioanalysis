<?php
/**
This service returns two things, max value and min value 
of a mysql table comlun. The return format is like this
max,min
**/
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

$sql_statement = "SELECT data_type 
	FROM information_schema.columns 
	WHERE table_schema = 'biocancer'
	AND table_name = 'nottingham' 
	AND column_name = '".$_GET['row_name']."'";
	
$result = mysql_query($sql_statement);
	
if (!$result) {
    die('Could not query:' . mysql_error());
}
	$row = mysql_fetch_array($result, MYSQL_NUM);
	echo $row[0];
	if($row[0] != "STRING") {
		$sql_statement = "SELECT MAX(`".$_GET['row_name']."`) 
						 FROM `nottingham`  
						 WHERE 1 ";
		$result = mysql_query($sql_statement);
		$row = mysql_fetch_array($result, MYSQL_NUM);
		echo "," . $row[0] . ",";
		
		$sql_statement = "SELECT MIN(`".$_GET['row_name']."`) 
						 FROM `nottingham`  
						 WHERE 1 ";
		$result = mysql_query($sql_statement);
		$row = mysql_fetch_array($result, MYSQL_NUM);
		echo $row[0];
	}
?>