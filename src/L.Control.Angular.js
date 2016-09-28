 'use strict';

 L.Control.Angular = L.Control.extend({
    options: {
         position: 'bottomleft',
         template: ''
     },
     onAdd: function onAdd (map) {
         var that = this;
         this._container = L.DomUtil.create('div', 'angular-control-leaflet');
         
         L.DomEvent
            .on(this._container, 'dblclick', L.DomEvent.stop)
            .on(this._container, 'click', L.DomEvent.stop);
         
         angular.element(document).ready(function() {
             
             var $injector = angular.element(document).injector();

             if (!$injector) {
                 $injector = angular.element(document.querySelectorAll('[ng-app]')).injector();
             }

             if (!$injector) {
                 throw "L.Control.Angular can't find your Angular app";
             }

             var $rootScope = $injector.get('$rootScope'),
                 $compile = $injector.get('$compile'),
                 $controller = $injector.get('$controller');

             that._scope = $rootScope.$new(true);

             var element = angular.element(that._container);
             element.html(that.options.template);

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
         return this._container;
     },
     onRemove: function(){
        if(this._scope){
            this._scope.$destroy();
        }
        
        L.DomEvent
            .off(this._container, 'dblclick', L.DomEvent.stop)
            .off(this._container, 'click', L.DomEvent.stop);
     }
 });

 L.control.angular = function(options) {
     return new L.Control.Angular(options);
 };