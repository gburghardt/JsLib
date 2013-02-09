<?php
header('Content-type: text/json; charset=utf-8');
$request_method = $_SERVER['REQUEST_METHOD'];

if ($request_method == 'PUT') {
	$_POST['blog']['id'] = time();
	header('HTTP/1.1 200 OK');
	echo json_encode($_POST);
}
else if ($request_method == 'POST') {
	header('HTTP/1.1 201 Created');
	$_POST['blog']['id'] = time();
	echo json_encode($_POST);
}
else if ($request_method == 'GET') {
	if (empty($_GET['id'])) {
		header("HTTP/1.1 404 Not Found");
	}
	else {
		header("HTTP/1.1 200 OK");
		$blog_post = array(
			'blog' => array(
				'id' => $_GET['id'],
				'title' => 'I came from a database!',
				'author' => 'John Doe'
			)
		);
		echo json_encode($blog_post);
	}
}
else if ($request_method == 'DELETE' && !empty($_GET['id'])) {
	header("HTTP/1.1 200 OK");
}
else {
	header("HTTP/1.1 404 Not Found");
}

?>