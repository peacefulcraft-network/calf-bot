class EventRouter {
	constructor() {
		this.routes = {};
		this.routeKeys = [];
	}

	addRoute(condition, route) {
		if (this.routes[condition] == undefined) {
			this.routes[condition] = { if: condition, routes: [ route ]};
			this.routeKeys.push(condition);
		} else {
			this.routes[condition].routes.push(route);
		}
	}

	addRouteModule(commandModule) {
		this.addRoute(commandModule.if, commandModule);
	}

	on(event) {
		for(let i=0; i<this.routeKeys.length; i++) {
			const routePath = this.routes[this.routeKeys[i]];

			if (this.routes[this.routeKeys[i]].if(event)) {
				for(let j=0; j<routePath.routes.length; j++) {
					routePath.routes[j].on(event);
				}
			}
		}
	}

	removeRoute(route) {
		let iLim = this.routeKeys.length;
		for(let i=0; i<iLim; i++) {
			const routePath = this.routes[this.routeKeys[i]];
			let jLim = routePath.routes.length;
			for(let j=0; j<jLim; j++) {
				if (routePath.routes[j] == route) {
					delete routePath.routes[j];
					// Adjust indexes because we deleted something from the list
					j -= 1;
					jLim -= 1;

					if (routePath.routes[j].length == 0) {
						delete this.routes[this.routeKeys[i]];
						delete this.routeKeys[i];
						// Adjust indexes because we delete something from the list
						i -= 1;
						iLim -= 1;
						break;
					}
				}
			}
		}
	}
};

module.exports = EventRouter;