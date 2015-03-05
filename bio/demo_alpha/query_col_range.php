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

if(strcmp ($_GET['type'],'MAX' )==0) {
	$sql_statement = "SELECT MAX(`".$_GET['row_name']."`) 
	FROM `nottingham`  
	WHERE 1 ";
} else {
	$sql_statement = "SELECT MIN(`".$_GET['row_name']."`) 
	FROM `nottingham`  
	WHERE 1 ";
}
	
$result = mysql_query($sql_statement);
	
if (!$result) {
    die('Could not query:' . mysql_error());
}
	$row = mysql_fetch_array($result, MYSQL_NUM);
	echo $row[0];
?>