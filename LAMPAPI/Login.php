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
	# Specifies that an ID, firstName, and lastName will be chosen from the database when given a variable login and password
	$statement = $connection->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");

	# Uses retrieved json input login and password strings as database retrieval parameters
	$statement->bind_param("ss", $inputData["login"], $inputData["password"]);

	# $result should now hold the ID, firstName, and lastName of a user if the login and password inputted to the api were valid
	$statement->execute();
	$result = $statement->get_result();

	# This will only return user info if $result found corresponding user data in the database
	if( $row = $result->fetch_assoc()  )
	{
		returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
	}
	else
	{
		returnWithError("No Records Found");
	}

	$statement->close();
	$connection->close();
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
	$retValue = '{"id":0,
		"firstName":"",
		"lastName":"",
		"error":"' . $error . '"}';
	sendResultInfoAsJson( $retValue );
}

# Creates and returns formatted string with specified user data from the database and an empty error field
function returnWithInfo( $firstName, $lastName, $id )
{
	$retValue = '{"id":' . $id . ',
		"firstName":"' . $firstName . '",
		"lastName":"' . $lastName . '",
		"error":""}';
	sendResultInfoAsJson( $retValue );
}

?>
