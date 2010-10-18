<?php

print_r( $_POST );

if ( !empty( $_POST['name'] ) ) {
	echo $_POST['name'];
}
else {
	header("HTTP/1.1 500 Internal Server Error");
	echo 'FAILED';
}

?>