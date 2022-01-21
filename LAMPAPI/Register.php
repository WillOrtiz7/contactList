<?php

# Retrieves json input from user login request
$inputData = getInputData();

$id = 0;
$firstName = "";
$lastName = "";

# MySql Connection Parameters
$host = "167.99.228.82";
$dbUser = "TheBeast";
$dbPass = "WeLoveCOP4331";
$dbName = "COP4331";

$connection = new mysqli($host, $dbUser, $dbPass, $dbName);
if( $connection->connect_error )
{
	returnWithError( $connection->connect_error );
}
else
{
	$statement = $connection->prepare("INSERT into Users (Login,Password,FirstName,LastName) VALUES(?,?,?,?)");
	$statement->bind_param("ssss", $inputData['login'], $inputData['password'], $inputData['firstName'], $inputData['lastName']);
	$statement->execute();

	$stmt->close();
	$connection->close();
	returnWithInfo($inputData['login']);
}

# Input json will be decoded and true means that the decoded string will be turned into an array
function getInputData()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
	header('Content-type: application/json');
	echo $obj;
}

# Creates and returns formatted string with empty user data and an error passed to this function
function returnWithError( $error )
{
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $error . '"}';
	sendResultInfoAsJson( $retValue );
}

# Creates and returns formatted string with specified user data from the database and an empty error field
function returnWithInfo( $login )
{
	$retValue = '{"Successfully registered user":"' . $login . '"}';
	sendResultInfoAsJson( $retValue );
}

?>
