var mesg = {}
function log() {
var mylog="";
  for (var x in mesg) {
    mylog += x + ": " + mesg[x] + '<BR>';
  }
//$('#log').html(mylog);
console.log(mylog);
}

(function($) {
    
    $.fn.loadScroll = function(container, duration) {

        console.log('in load scroll ' + duration)

    
        var $window = (container) ? container : $(window),
            images = this,
            inview,
            loaded;
    
        $window.scroll(function() {

        
            inview = images.filter(function() {
            
                var a = Math.round($window.scrollTop()),
                    b = Math.round($window.height()),
                    c = Math.round($(this).offset().top), // Math.round($(this).offset().top - $window.offset().top)
                    d = Math.round($(this).height());

                var arr = [a, b, c, d];
                var cond = (c > 0) && (b - c > 0);
                var m = (c) + ' > 0 ' + " AND " + (b - c) + ' > 0';
                
                //mesg[$(this).html()] = 'inview ? ' + (cond) + ". bounds " + JSON.stringify(arr) + ' cond: ' + m
                //console.log('inview ? ' + (cond) + ". bounds " + JSON.stringify(arr) + ' cond: ' + m)
                console.log(this.getAttribute('id') + ' -> inview ? ' + (cond) + ". bounds " + JSON.stringify(arr) + ' cond: ' + m)
                //log()
                    
                return cond;
                
            });
            
            //loaded = inview.trigger('loadScroll');
           // images = images.not(loaded);
                    
        });
    };
    
})(jQuery);
