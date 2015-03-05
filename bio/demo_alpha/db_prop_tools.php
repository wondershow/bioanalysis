<?php
	/**
	To get the type of the db column
	**/
	function getColDBType($col_name) {
		error_reporting(0);
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
		
		$sql_statement = "SELECT data_type 
					FROM information_schema.columns 
					WHERE table_schema = 'biocancer'
					AND table_name = 'nottingham' 
					AND column_name = '".$col_name."'";
	
		$result = mysql_query($sql_statement);
	
		if (!$result) {
			die('Could not query:' . mysql_error());
		}
		$row = mysql_fetch_array($result, MYSQL_NUM);
		
		$pos = strrpos($row[0], "varchar");
		if ($pos === false) { // no varchar, we think it is digital
			$sql_statement = "SELECT count( DISTINCT(`".$col_name."`) ) FROM `nottingham`";
			$result = mysql_query($sql_statement);
			$row = mysql_fetch_array($result, MYSQL_NUM);
			if(intval($row[0])>5)
				return "DECIMAL";
			else
				return "CATGORICAL";
		} else {
			return "STRING";
		}
		
	}	
?>