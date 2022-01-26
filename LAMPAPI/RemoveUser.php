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
	$statement = $connection->prepare("DELETE FROM Users WHERE FirstName=? AND LastName=? AND Login = ? AND Password = ?");
	$statement->bind_param("ssss", $inputData['firstName'], $inputData['lastName'], $inputData['login'], $inputData['password']);
    $statement->execute();

    if ($statement->affected_rows > 0)
    {
        returnWithError("");
    }
    else
    {
        returnWithError("Failed to delete user");
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
	$retValue = '{"error":"' . $error . '"}';
	sendResultInfoAsJson( $retValue );
}

?>
