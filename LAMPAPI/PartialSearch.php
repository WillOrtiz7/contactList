<?php

# Retrieves json input from user login request
$inputData = getInputData();

$userId = $inputData['userId'];
$userInput = '%' . $inputData['userInput'] . '%';
$firstNames = array();
$lastNames = array();

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
	$statement = $connection->prepare("SELECT firstName,lastName FROM Contacts WHERE UserID=? AND CONCAT(Contacts.FirstName, ' ', Contacts.LastName) LIKE CONCAT('%', ?, '%')");
	$statement->bind_param("ss", $inputData['userId'], $inputData['userInput']);
	$statement->execute();
	$result = $statement->get_result();

	if($result->num_rows > 0){
        while($row = $result->fetch_assoc()) {
            array_push($firstNames, $row['firstName']);
            array_push($lastNames, $row['lastName']);
        }
        returnWithInfo($firstNames, $lastNames);
    }
    else {
        returnWithError("No Matches Found");
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
	$retValue = '{"firstNames":"",
	    "lastNames":"",
        "error":"' . $error . '"
	}';
	sendResultInfoAsJson( $retValue );
}

# Creates and returns formatted string with specified user data from the database and an empty error field
# Front-End will display firstName, lastName, phoneNumber, and emailAddress to User but keep ID for use in EditContact or RemoveContact
function returnWithInfo( $firstNames, $lastNames )
{
	$retValue = '{"firstNames":' . json_encode($firstNames) . ',
	    "lastNames":' . json_encode($lastNames) . ',
		"error":""
	}';
	sendResultInfoAsJson( $retValue );
}

?>
