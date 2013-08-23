<?php
	
	/**
	 * get all users
	 */
	$app->get('/user', authorize('user'), function () use ($app, $db) {
			
		$users = array();
		$permissions = array();
		$ids = array();
		
		$company = $app->request->params('company');
		if($company==null){
			$cursor = $db->permission->find();
		} else {
			$id = new MongoID( $company );
			$query = array( 'company' => $id );
			$cursor = $db->permission->find( $query );
		}
			
		foreach( $cursor as $permission ){
			$permission = (object) $permission;
			$permissions[] = $permission;
			$ids[] = $permission->user;
		}
			
		foreach( $db->user->find(array('_id' => array('$in' => $ids ))) as $user ){
			$user = (object) $user;
			$users[] = $user;
		}

		$app->response()->header("Content-Type", "application/json");
		/*
		echo json_encode(
			array(
				'users' => $users,
				'permissions' => $permissions
			)
		);
		*/
		echo json_encode($users);
	});
	
	/**
	 * get user by id
	 */
	$app->get('/user/:id', authorize('user'), function ($id) use ($app, $db) {
		
		$id = new MongoID( $id );
		$user = (object) $db->user->findOne( array('_id' => $id ) );
		
		$app->response()->header("Content-Type", "application/json");
		echo json_encode($user);
		
	});
	
	/**
	 * create user
	 */
	$app->post('/user', authorize('user'), function () use ($app, $db) {
		
		$body = $app->request->getBody();
		$user = json_decode($body);
		
		try {
			$db->user->insert( $user );
		} catch (Exception $e) {
			$app->response->setStatus(500);
			echo $e->getMessage();
			return;
		}

		$app->response()->header("Content-Type", "application/json");
		echo json_encode( $user );
		
	});
	
	
	/**
	 * update user
	 */
	$app->put('/user/:id', authorize('user'), function ($id) use ($app, $db) {
		
		$id = new MongoID( $id );
		$body = $app->request->getBody();
		$user = json_decode($body);
		unset($user->_id);
		
		try {
			$db->user->update(
					array('_id' => $id ),
					array('$set' => $user)
			);
		} catch (Exception $e) {
			$app->response->setStatus(500);
			echo $e->getMessage();
			return;
		}
		$app->response()->header("Content-Type", "application/json");
		echo json_encode( $user );
	});
	
	
	/**
	 * delete user
	 */
	$app->delete('/user/:id', authorize('user'), function ($id) use ($app, $db) {
		$id = new MongoID( $id );
		$db->user->remove(array('_id' => $id ));
		$db->permission->remove(array('user' => $id ));
	});
		
?>
