function message_protocol(klass, data){
  return {
    klass: klass,
    data: data || {}
  }
}
function int(val){
  return parseInt(val);
}

var message_handlers = {
  action_move :                     function(){ return new MessageActionMove(); },
  get_static :                      function(){ return new MessageGetStatic(); },
  get_ships :                       function(){ return new MessageGetShips(); },
  move_to :                         function(){ return new MessageMoveTo(); },
  warp_system_to :                  function(){ return new MessageWarpSystemTo(); },
  warp_system_from :                function(){ return new MessageWarpSystemFrom(); },
  take_off_planet :                 function(){ return new MessageTakeOffPlanet(); },
  land_planet :                     function(){ return new MessageLandPlanet(); },
  get_planet_devices:                function(){ return new MessageGetPlanetDevices();},
  get_ship_devices:                 function(){ return new MessageGetShipDevices();},
	notification:                     function(){ return new MessageNotification();}
}

// controller for mesages processing
function MessageProcessor(scope){
  this.scope = scope;
  this.process = function(data){
    // currently reject all messages on frontend - tbd
    if(this.scope.solar_system 
      && typeof data.solar_system_id != 'undefined'
      && int(data.solar_system_id) != this.scope.solar_system.id
    ) {
      // console.log('drop', data, resp.solar_system_id, this.scope.solar_system.id);
      return;
    }
    var handler = message_handlers[data.klass];
    if(handler){
      handler().response(this.scope, data);
    }
  }
}

// ----------------------------------------------------------------------------
function MessageGetStatic() {
  this.request = function(scope){
    return message_protocol('get_static');
  }
  this.response = function(scope, data){
    scope.$apply(function () {
      scope.solar_systems = data.solar_systems;
      scope.click_solar_system_action(scope.solar_systems[0]);
      _.each(scope.solar_systems, function(item){
        // minimap magic - tdb
        item.xr = (item['x'] - 1) * 20;
        item.yr = (4 - item['y']) * 20;
      });
    });
  }
}
// ----------------------------------------------------------------------------
function MessageGetShips() {
  this.request = function(scope){
    return message_protocol('get_ships', { solar_system_id: scope.solar_system.id });
  }
  this.response = function(scope, data){
    scope.$apply(function () {
      scope.ships = data.ships;
      // ships in space with current user ships
      _.each(scope.ships, function(ship){
        scope.set_ship_relative(ship, true);
      });
    });
  }
}
function MessageGetPlanetDevices() {
  this.request = function(scope, ship){
    return message_protocol('get_planet_devices', { planet_id: ship.planet_id });
  }
  this.response = function(scope, data){
    scope.$apply(function () {
      scope.trade_window_planet_devices = data.devices;
    });
  }
}
function MessageGetShipDevices() {
  this.request = function(scope, ship){
    return message_protocol('get_ship_devices', { ship_id: ship.id });
  }
  this.response = function(scope, data){
    scope.$apply(function () {
      scope.trade_window_ship_devices = data.devices;
      scope.ship_modifiers = data.modifiers;
      console.log(data.modifiers);
    });
  }
}
function MessageWarpSystemTo() {
  this.request  = function(scope, solar_system_id){
    return message_protocol('warp_system_to', { 
      ship_id: scope.ship.id,
      solar_system_id: solar_system_id 
    });
  }
  this.response = function(scope, data){
    scope.$apply(function () {
      if(scope.ships) {
        scope.ships.push(data.ship);
        scope.set_ship_relative(data.ship);
      }
    });
  }
}

function MessageWarpSystemFrom() {
  this.response = function(scope, data){
    scope.$apply(function () {
      if(scope.ships){
        scope.delete_ship_by_id(data.ship_id);
        // remove selection in case of current ship
        if(scope.ship && data.ship_id == scope.ship.id){
          scope.ship = null;
        }
      }
    });
  }
}
// ----------------------------------------------------------------------------
function MessageBuyDevice(){
  this.request = function(scope, device){
    return message_protocol('buy_device', {
      ship_id: scope.trade_window_ship.id,
      device_id: device.id
    });
  }
}
function MessageSellDevice(){
  this.request = function(scope, device){
    return message_protocol('sell_device', {
      ship_id: scope.trade_window_ship.id,
      device_id: device.id
    });
  }
}
function MessageNotification(){
  this.response = function(scope, data){
    alert("Ship: " + data.ship_id + " " + data.message);
  }
}
function MessageActionMove(){
  this.request = function(scope, data){
    return message_protocol('action_move', {
      ship_id: scope.ship.id,
      x: data.x,
      y: data.y
    });
  }
}
function MessageLandPlanet(){
  this.request = function(scope, planet_id){
    return message_protocol('land_planet', {
      ship_id: scope.ship.id,
      planet_id: planet_id
    });
  }
  this.response = function(scope, data){
    scope.$apply(function () {
      if(scope.ships){
        var ship = scope.find_ship_by_id(data.ship.id);
        // ship not yet loaded to system
        if(ship){
          ship.planet_id = data.ship.planet_id;
          // remove seleciton in case of current ship
          if(scope.ship && data.ship.id == scope.ship.id){
            scope.ship = null;
          }
        }
      }
    });
  }
}
function MessageTakeOffPlanet() {
  this.request = function(scope, ship_id){
    return message_protocol('take_off_planet', {
      ship_id: ship_id
    });
  }
  this.response = function(scope, data){
    scope.$apply(function () {
      if(scope.ships) {
        var ship = scope.find_ship_by_id(data.ship_id);
        // show ship in system
        // close planet window
        if(ship){
          ship.planet_id = null;
          if(ship.user_id){
            scope.click_ship_handler(ship);
            if(data.ship_id == int(scope.trade_window_ship.id)){
              scope.trade_window_is_show = false;
            }
          }
        }
      }
    });
  }
}
function MessageMoveTo(){
  this.response = function(scope, data){
    var ship = scope.find_ship_by_id(parseInt(data.ship_id));
    if (ship){
      ship.x = int(data.x);
      ship.y = int(data.y);
      scope.$apply(function () {
        scope.set_ship_relative(ship);
      });
    }
  }
}

function initViewport(){
  var w = $(window).width();
  $('.main-container').css('width', w - 2).css('height', $(window).height() - 2);
  $(".actions-container").css('left', w/2 - $(".actions-container").width() / 2);
}
//--------------------------------------------------------------------------------
var app = angular.module('spaceApp', ['ngAnimate']);

app.directive('uiPositionAnimate', function() {
  var module = {};
  module.link = function(scope, element, attrs) {
    scope.$watch(attrs.uiPositionAnimate, function(val, oldVal) {
      if(val === oldVal) return; // Skip inital call
      if(val == 0) return; // Skip starting
      var positions = val.split(':');
      var elem = jQuery(element);
      if(elem.css('top') == 0 || elem.css('top') == 'auto'){
        elem.css('left', positions[0]).css('top', positions[1]);
      } else {
        elem.animate({
          top: int(positions[1]),
          left: int(positions[0])
        }, 2000);
      }
    });
  }
  return module;
});

app.controller('solarSystemCtrl', function($scope, $http, $filter, $parse){
  initViewport();
  
  $scope.user_id = 1;
  
  $scope.init_socket = function(){
    $scope.ws         = new WebSocket("ws://" + window.document.location.host + "/");
    $scope.processor  = new MessageProcessor($scope);
    $scope.ws.onmessage = function(message) {
      var data = JSON.parse(message.data);
      // console.log('message:', data);
      $scope.processor.process(data);
    };
    // request static data
    setTimeout(function(){
      $scope.send((new MessageGetStatic()).request());
    }, 500);
  }
  $scope.send = function(data){
    $scope.ws.send(JSON.stringify(data));
  }
  
  $scope.init_socket();
  
  $scope.find_ship_by_id = function(id){
    return _.find($scope.ships, function(ship){ return ship.id == id; });
  }
  $scope.find_planet_by_id = function(id){
    return _.find($scope.planets, function(p){ return p.id == id; });
  }
  $scope.delete_ship_by_id = function(id){
    _.each($scope.ships, function(ship, index){
      if(ship && ship.id == id){
        $scope.ships.splice(index, 1);
      }
    });
  }
  
  // ----- handlers ------- 
  $scope.click_grid_handler = function($event){
    if($scope.is_move_action){
      $scope.is_move_action = false;
      var data = $scope.get_coordinates($event.offsetX, $event.offsetY);
      $scope.send((new MessageActionMove().request($scope, data)));
    }
    console.log($event);
  }
  $scope.click_planet_handler = function(planet){
    if($scope.is_land_planet_action){
      $scope.is_land_planet_action = false;
      $scope.send((new MessageLandPlanet().request($scope, planet.id)));
    }
  }
  $scope.click_ship_handler = function(ship){
    $scope.ship = ship;
  }
  // ----- actions ------- 
  $scope.move_action = function(){
    $scope.is_move_action = $scope.is_move_action ? false : true;
  }
  $scope.land_planet_action = function(){
    $scope.is_land_planet_action = $scope.is_land_planet_action ? false : true;
  }
  $scope.show_planet_ships_action = function(){
    $scope.is_show_planet_ships = $scope.is_show_planet_ships ? false : true;
  }
  $scope.take_off_planet_action = function(ship){
    $scope.send((new MessageTakeOffPlanet().request($scope, ship.id)));
  }
  $scope.warp_system_action = function(){
    $scope.is_warp_system_action = $scope.is_warp_system_action ? false : true;
  }
  $scope.click_solar_system_action = function(ss){
    if ($scope.is_warp_system_action){
      $scope.is_warp_system_action = false;
      $scope.send((new MessageWarpSystemTo().request($scope, ss.id)));
    } else {
      $scope.solar_system = ss;
      $scope.planets = ss.planets;
      $scope.ships = [];
      // set radius
      $scope.set_radius($scope.solar_system.radius)
      // render planets
      _.each($scope.planets, function(planet){
        planet.xr = ($scope.cell_radius + planet['x']) * $scope.cell_size;
        planet.yr = ($scope.cell_radius - planet['y']) * $scope.cell_size;
        planet.ships = [];
      });
      //request ships
      $scope.send((new MessageGetShips().request($scope)));
    }
  }
  /* ---------- Trade Window -------------- */
  $scope.trade_window_close_handler = function(){
    $scope.trade_window_is_show = false;
  }
  $scope.trade_window_show_handler = function(ship){
    $scope.trade_window_is_show = true;
    $scope.trade_window_ship = ship;
    $scope.send((new MessageGetPlanetDevices()).request($scope, ship));
    $scope.send((new MessageGetShipDevices()).request($scope, ship));
  }
  $scope.trade_window_buy_device = function(device){
    $scope.send((new MessageBuyDevice()).request($scope, device));
  }
  $scope.trade_window_sell_device = function(device){
    $scope.send((new MessageSellDevice()).request($scope, device));
  }
  /* -------------------------------------- */
  
  
  $scope.ships_add = function(ship){
    $scope.ships.push(ship);
    $scope.set_ship_relative(ship);
  }
  $scope.set_ship_relative = function(ship){
    if (Math.abs(ship['x']) <= $scope.cell_radius && Math.abs(ship['y']) <= $scope.cell_radius) {
      ship.xr = ($scope.cell_radius + ship['x']) * $scope.cell_size;
      ship.yr = ($scope.cell_radius - ship['y']) * $scope.cell_size;
      ship.xy_animate = ship.xr + ':' + ship.yr;
    }
  };
  
  // action handlers
  
  $scope.show_map_action = function(){
    $scope.action_minimap_show = $scope.action_minimap_show ? false : true;
  }

  
  $scope.get_coordinates = function(x, y){
    var cells_x = x / $scope.cell_size;
    var cells_y = y / $scope.cell_size;
    return {
      x: Math.round(cells_x) - $scope.solar_system_radius - 2,
      y: -1 * (Math.round(cells_y) - $scope.solar_system_radius - 2)
    }
  }
  
  $scope.set_radius = function(num){
     $scope.solar_system_radius = num;
     num = num + 2; //each side space
     $scope.cell_radius = num;
     $scope.cell_size = 20;
     $scope.html_radius = num * $scope.cell_size;
     $scope.html_zero_radius = (num + 1) * $scope.cell_size; // +1 for zero line
     $scope.html_system_size = (num * 2 + 1) * $scope.cell_size; // +1
     $scope.html_system_size_max = $scope.html_system_size > 800 ? 800 : $scope.html_system_size;
     $scope.html_system_size_div2 = $scope.html_system_size / 2;
  }
  
  
  
});