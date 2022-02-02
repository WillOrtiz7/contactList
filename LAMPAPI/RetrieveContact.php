<?php

# Retrieves json input from user login request
$inputData = getInputData();

$firstName = "";
$lastName = "";
$phoneNumber = "";
$emailAddress = "";
$userId = 0;

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
	$statement = $connection->prepare("SELECT firstName,lastName,phoneNumber,emailAddress FROM Contacts WHERE id=?");
	$statement->bind_param("s", $inputData['id']);

	$statement->execute();
	$result = $statement->get_result();

	# This will only return user info if $result found corresponding user data in the database
	if( $row = $result->fetch_assoc()  )
	{
		returnWithInfo( $row['firstName'], $row['lastName'], $row['phoneNumber'], $row['emailAddress'], $row['id'] );
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
	$retValue = '{"firstName":"",
        "lastName":"",
        "phoneNumber":"",
        "emailAddress":"",
        "ID":"",
        "error":"' . $error . '"
	}';
	sendResultInfoAsJson( $retValue );
}

# Creates and returns formatted string with specified user data from the database and an empty error field
# Front-End will display firstName, lastName, phoneNumber, and emailAddress to User but keep ID for use in EditContact or RemoveContact
function returnWithInfo( $firstName, $lastName, $phoneNumber, $emailAddress, $id )
{
	$retValue = '{"firstName":"' . $firstName . '",
        "lastName":"' . $lastName . '",
        "phoneNumber":"' . $phoneNumber . '",
        "emailAddress":"' . $emailAddress . '",
        "ID":"' . $id . '",
		"error":""
	}';
	sendResultInfoAsJson( $retValue );
}

?>
