<?php

	session_start();

	$mongo = new MongoClient();
	$db = $mongo->angularauth;

	require 'Slim/Slim.php';
	\Slim\Slim::registerAutoloader();
	$app = new \Slim\Slim();
	
	require 'routes/authentication.php';
	require 'routes/user.php';
	require 'routes/company.php';
	require 'routes/permission.php';
	
	$app->response()->header('Cache-Control', 'no-cache');
	$app->config('debug', true);
	
	$app->run();

?>