<?php

if ( empty( $_SERVER['HTTP_X_REQUESTED_WITH'] ) || strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ) !== 'xmlhttprequest' ) {
	header("HTTP/1.1 500 Internal Server Error");
	echo "Failure!";
	print_r($_SERVER);
}
else {
	echo 'Success!';
}

?>