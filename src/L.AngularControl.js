 'use strict';

 L.AngularControl = L.Control.extend({
    options: {
         position: 'bottomleft',
         template: ''
     },
     onAdd: function(map) {
         var that = this;
         var container = L.DomUtil.create('div', 'angular-control-leaflet');
         angular.element(document).ready(function() {
             // Grab the injector for the current angular app
             var $injector = angular.element(document).injector();

             var $rootScope = $injector.get('$rootScope'),
                 $compile = $injector.get('$compile'),
                 $controller = $injector.get('$controller');

             var scope = $rootScope.$new(true);

             var element = angular.element(container);
             element.html(that.options.template);

             var link = $compile(element);

             // Controller setup based on ui-router's code https://github.com/angular-ui/ui-router
             if (that.options.controller) {
                 var controller = $controller(that.options.controller, {
                     '$map': map,
                     '$scope': scope,
                     '$element': element
                 });

                 if (that.options.controllerAs) {
                     scope[that.options.controllerAs] = controller;
                 }

                 element.data('$ngControllerController', controller);
                 element.children().data('$ngControllerController', controller);
             }

             link(scope);
             scope.$apply();
         });
         return container;
     }
 });

 L.angularControl = function(options) {
     return new L.AngularControl(options);
 };