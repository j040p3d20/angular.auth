<?php
	
	/**
	 * register
	 */
	$app->post('/register', function () use ($app, $db) {
		
		$body = $app->request->getBody();
		$data = json_decode($body);
		
		try {
			$db->user->insert( $data->user );
			$db->company->insert( $data->company );
		} catch (Exception $e) {
			$app->response->setStatus(500);
			echo $e->getMessage();
		}
		
		$permission = array(
				'user' => $data->user->_id,
				'company' => $data->company->_id,
				'value' => 'owner'
		);
		
		$db->permission->insert( $permission );
		$data->permission = $permission;

		$app->response()->header("Content-Type", "application/json");
		echo json_encode( $data );
	});
	
	/**
	 * login
	 */
	$app->post('/login', function () use ($app, $db) {
		
		$cookies = $app->request->cookies;
		$body = json_decode($app->request->getBody());
		
		if( isset($body->email) && isset($body->password) )
		{
			$email = $body->email;
			$password = $body->password;
			$authorization = hash('sha512',$password);
			
			$login = validate($email, $authorization);
			if ($login) {
				setcookie("email", $email);
				setcookie("authorization", $authorization);
			}
		}
		else if( $cookies->email && $cookies->authorization )
		{
			$email = $cookies["email"];
			$authorization = $cookies["authorization"];
			$login = validate($email, $authorization);
		}
		
		if($login)
		{
			$_SESSION['login'] = $login;
			$app->response()->header("Content-Type", "application/json");
			echo json_encode( $login );
		}
		else 
		{
			$app->halt(401);
		}
	});
	
	/**
	 * logout
	 */
	$app->post('/logout', function () use ($app) {
		//setcookie("PHPSESSID", "", 1);
		setcookie("email", "", 1);
		setcookie("authorization", "", 1);
	});
	
	/**
	 * validate
	 */
	function validate($email, $authorization) {
		global $db;
		$user = (object) $db->user->findOne(array('email' => $email));
			
		if($authorization == hash('sha512',$user->password))
		{
			$permissions = array();
			$companies = array();
			$ids = array();
			
			foreach( $db->permission->find(array('user' => $user->_id)) as $permission ){
				$permission = (object) $permission;
				$permissions[] = $permission;
				$ids[] = $permission->company;
			}
			
			foreach( $db->company->find(array('_id' => array('$in' => $ids ))) as $company ){
				$company = (object) $company;
				$companies[] = $company;
			}
			
			return array(
					'user' => $user,
					'permissions' => $permissions,
					'companies' => $companies
			);
		}
	}
	
	/**
	 * authorize
	 */
	function authorize($role = "user") {
		return function () use ( $role ) {
			
			return true;
			
			$app = \Slim\Slim::getInstance();
			if(!empty($_SESSION['user'])) {
				return true;
				/*
				if($_SESSION['user']['role'] == $role || $_SESSION['user']['role'] == 'admin') {
					return true;
				}
				else {
					$app->halt(403);
				}
				*/
			}
			else {
				$app->halt(401);
			}
		};
	}

?>
