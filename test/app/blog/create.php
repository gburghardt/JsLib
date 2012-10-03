<?php
function to_json($data) {
	return str_replace( "\n", '\\n', json_encode( $data ) );
}

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
	$_REQUEST['id'] = time();
	header('HTTP/1.1 201 Created');
	echo to_json($_REQUEST);
}
else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	header('HTTP/1.1 201 Created');
	echo to_json($_REQUEST);
}
else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	if (empty($_REQUEST['id'])) {
		header("HTTP/1.1 404 Not Found");
	}
	else {
		header("HTTP/1.1 200 OK");
		$blog_post = array(
			'id' => $_REQUEST['id'],
			'title' => 'I came from a database!',
			'publish_date' => '2012/10/02',
			'body' => '<p>Yup. I certainly did.</p>'
		);
		echo to_json($blog_post);
	}
}
else if ($_SERVER['REQUEST_METHOD'] == 'DELETE' && !empty($_REQUEST['id'])) {
	header("HTTP/1.1 200 OK");
}
else {
	header("HTTP/1.1 404 Not Found");
}
?>