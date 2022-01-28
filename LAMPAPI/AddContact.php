<?php

# Retrieves json input from user request
$inputData = getInputData();

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
	$statement = $connection->prepare("INSERT into Contacts (FirstName,LastName,PhoneNumber,EmailAddress,UserID) VALUES(?,?,?,?,?)");
	$statement->bind_param("sssss", $inputData['firstName'], $inputData['lastName'], $inputData['phoneNumber'], $inputData['emailAddress'], $inputData['userId']);
	$statement->execute();

	$statement->close();
	$connection->close();

	returnWithError("");
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
	$retValue = '{"error":"' . $error . '"}';
	sendResultInfoAsJson( $retValue );
}

?>
