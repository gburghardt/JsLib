if (!Function.prototype.bind) {
  Function.prototype.bind = function(context) {
    var self = this;
    var fn = function() {
      return self.apply(context, arguments);
    };

    fn.cleanup = function() {
      self = fn = context = null;
    };

    return fn;
  };
}
