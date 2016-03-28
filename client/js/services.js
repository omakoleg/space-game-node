angular.module('services')
.service('dialogService', function(){
  this.show = function(message, cb){
    if(confirm(message)){
      cb();
    }
  }
});