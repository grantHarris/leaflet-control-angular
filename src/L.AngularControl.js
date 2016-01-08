L.AngularControl = L.Control.extend({
	options: {
		position: 'bottomleft',
		template: ''
	},
	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-angular');
		
		var $injector = angular.injector(['ng']);
		var $rootScope = $injector.get('$rootScope'),
			$compile = $injector.get('$compile'),
			$controller = $injector.get('$controller');

		var scope = $rootScope.$new(true);
		var element = angular.element(container);
		
		element.html(this.options.template);

		var link = $compile(element)
		
		if (this.options.controller) {
          
          var controller = $controller(this.options.controller, {
          	$map: map,
          	$scope: scope,
          	$element: element
          });

          if (this.options.controllerAs) {
            scope[this.options.controllerAs] = controller;
          }

          element.data('$ngControllerController', controller);
          element.children().data('$ngControllerController', controller);
        }

        link(scope);
		scope.$apply();
		return container;
	}
});

L.angularControl = function (options) {
  return new L.AngularControl(options);
};
