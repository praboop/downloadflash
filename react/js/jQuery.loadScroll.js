// Dynamically load images while scrolling
// Source: github.com/ByNathan/jQuery.loadScroll
// Version: 1.0.1

(function($) {
    
    $.fn.loadScroll = function(container, imgId, duration) {
    
        var $window = (container) ? container : $(window),
            images = this,
            inview,
            loaded;
 
        images.one('loadScroll', function() {

            var img = $('#thumbnail-' + imgId);

            if (img.attr('data-src')) {
                img.attr('src',
                img.attr('data-src'));
                img.removeAttr('data-src');
                
                if (duration) {
                    
                    $(img).hide()
                           .fadeIn(duration)
                           .add('img')
                           .removeAttr('style');
                    
                } else return false;
            }
        });


        $window.scroll(function() {
        
            inview = images.filter(function() {

                var a = Math.round($window.scrollTop()),
                    b = Math.round($window.height()),
                    c = Math.round($(this).position().top), // Math.round($(this).offset().top),  //  $(this)[0].offsetTop Math.round($(this).offset().top - $window.offset().top),
                    d = Math.round($(this).height());

                var arr = [a, b, c, d];

                var cond = (c > 0) && (b - c > 0);
                var log = (c) + ' > 0 ' + " AND " + (b - c) + ' > 0';


                console.log(this.getAttribute('id') + ' -> inview ? ' + (cond) + ". bounds " + JSON.stringify(arr) + ' cond: ' + log)
                    
                return cond;
                
            });
            
            loaded = inview.trigger('loadScroll');
            images = images.not(loaded);
                    
        });
    };
    
})(jQuery);