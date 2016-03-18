 'use strict';

 L.Control.Angular = L.Control.extend({
    options: {
         position: 'bottomleft',
         template: ''
     },
     onAdd: function onAdd (map) {
         var that = this;
         var container = L.DomUtil.create('div', 'angular-control-leaflet');
         
         angular.element(document).ready(function() {
             // Grab the injector for the current angular app
             var $injector = angular.element(document).injector();

             var $rootScope = $injector.get('$rootScope'),
                 $compile = $injector.get('$compile'),
                 $controller = $injector.get('$controller');

             that._scope = $rootScope.$new(true);

             var element = angular.element(container);
             element.html(that.options.template);

             // Controller setup based on ui-router's code https://github.com/angular-ui/ui-router
             if (that.options.controller) {
                 var controller = $controller(that.options.controller, {
                     '$map': map,
                     '$scope': that._scope,
                     '$element': element,
                     '$options': that.options
                 });

                 if (that.options.controllerAs) {
                     that._scope[that.options.controllerAs] = controller;
                 }

                 element.data('$ngControllerController', controller);
                 element.children().data('$ngControllerController', controller);
             }

             $compile(element)(that._scope);
             that._scope.$apply();
         });
         return container;
     },
     onRemove: function(){
        if(this._scope){
            this._scope.$destroy();
        }
     }
 });

 L.control.angular = function(options) {
     return new L.Control.Angular(options);
 };