import React from 'react';
import ReactDOM from 'react-dom';
import {hashHistory, Router, Route, Redirect} from 'react-router';

import Layout from './layout/layout';

const app = (
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<Route path="blog" />
			<Route path="picture" />
			<Route path="video" />
		</Route>
	</Router>
);

ReactDOM.render(
	app,
	document.getElementById('store'),
	function() {
		console.timeEnd('react-app')
	}
);