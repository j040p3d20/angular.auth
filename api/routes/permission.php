<?php
	
	/**
	 * get all permissions
	 */
	$app->get('/permission', authorize('user'), function () use ($app, $db) {

		$permissions = array();
		
		$company = $app->request->params('company');
		if($company==null){
			$cursor = $db->permission->find();
		} else {
			$id = new MongoID( $company );
			$query = array( 'company' => $id );
			$cursor = $db->permission->find( $query );
		}
		
		foreach( $cursor as $permission ){
			$permissions[] = (object) $permission;
		}

		$app->response()->header("Content-Type", "application/json");
		echo json_encode($permissions);
	});
	
	/**
	 * get permission by id
	 */
	$app->get('/permission/:id', authorize('user'), function ($id) use ($app, $db) {
		
		$id = new MongoID( $id );
		$permission = (object) $db->permission->findOne( array('_id' => $id ) );
		
		$app->response()->header("Content-Type", "application/json");
		echo json_encode($permission);
		
	});
	
	/**
	 * create permission
	 */
	$app->post('/permission', authorize('user'), function () use ($app, $db) {
		
		$body = $app->request->getBody();
		$permission = json_decode($body);
		$permission->user = new MongoID($permission->user);
		$permission->company = new MongoID($permission->company);
		
		try {
			$db->permission->insert( $permission );
		} catch (Exception $e) {
			$app->response->setStatus(500);
			echo $e->getMessage();
			return;
		}

		$app->response()->header("Content-Type", "application/json");
		echo json_encode( $permission );
		
	});
	
	
	/**
	 * update permission
	 */
	$app->put('/permission/:id', authorize('user'), function ($id) use ($app, $db) {
		
		$id = new MongoID( $id );
		$body = $app->request->getBody();
		$permission = json_decode($body);
		unset($permission->_id);
		$permission->user = new MongoID($permission->user);
		$permission->company = new MongoID($permission->company);
		
		try {
			$db->permission->update(
					array('_id' => $id ),
					array('$set' => $permission)
			);
		} catch (Exception $e) {
			$app->response->setStatus(500);
			echo $e->getMessage();
			return;
		}
		$app->response()->header("Content-Type", "application/json");
		echo json_encode( $permission );
	});
	
	
	/**
	 * delete permission
	 */
	$app->delete('/permission/:id', authorize('user'), function ($id) use ($app, $db) {
		$id = new MongoID( $id );
	});
		
?>
