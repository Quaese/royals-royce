(function($){

// [START - PLUGIN] ------------------------------------------------
    $.fn.qpHorizontalParalax = function(options) {
        // Element, das mit dem Selektor gewählt wurde
        var $win = $(document),
            elem = this,
            list = elem.children('ul'),
            slides = list.children('li'),
            // Über defaults.Eigenschaft sind die Optionen erreichbar
            defaults = jQuery.extend({
                index: 0,
                anim: 1200
            }, options),
            preventDefaultEvents = true,
            startX, startY, isCss;



        // Private:
        function init(){
            // Testen, ob CSS-Eigenschaft existiert
            isCss = checkCssProperty('transition');

            // Dimensionen berechnen
            calcDimensions();

            // Scroll- und Touchevents registrieren
            registerEvents();

            $(window).on('resize', function(evt){
                _onResize(evt);
            });

            return elem;
        };

        function calcDimensions(){
            defaults.width = $(window).width();
            defaults.height = $(window).height();
            defaults.listWidth = slides.length * defaults.width;

            // Länge für UL festlegen
            list.width(defaults.listWidth);
            list.css({
                'left': (defaults.index*defaults.width) + "px"
            });

            // Breite für Teil-Inhalte festlegen
            slides.each(function(index, element){
                $(element).width(defaults.width);
                $(element).height(defaults.height);
            });
        }

/* *** [Events] *** */
        // Behandelt die Neuberechnung und Anzeige des richtigen Slide bei einem Resize des Fensters
        function _onResize(evt){
            // mousewheel-Event entfernen, um Überlagerung zu vermeiden
            $win.off("mousewheel.qpHorPara DOMMouseScroll.qpHorPara");
            // touch-Events entfernen
            if ('ontouchstart' in document.documentElement) {
                $win.off("touchstart.qpHorPara touchmove.qpHorPara");
            }

            // Dimensionen neu berechnen
            calcDimensions();

            // slide-Funktion aufrufen
            animSlide(defaults.index, 0);
        }


        function onTouchStart(evt){
            if (evt.touches.length === 1) {
                startX = evt.touches[0].pageX;
                startY = evt.touches[0].pageY;
                isMoving = true;

                //this.addEventListener('touchstart', onTouchStart, false);
                $win.on('touchmove.qpHorPara', function(evt){
                    onTouchMove(evt.originalEvent);
                });
            }
        }

        function onTouchMove(e) {
            if(defaults.preventDefaultEvents) {
                e.preventDefault();
            }

            if(isMoving) {
                var x = e.touches[0].pageX,
                    y = e.touches[0].pageY,
                    dx = startX - x,
                    dy = startY - y,
                    delta = 0;

                $win.off("touchstart.qpHorPara touchmove.qpHorPara");

                if(dx > 0) {
                    delta = 1;
                } else {
                    delta = -1;
                }

                // if(dy > 0) {
                //     // defaults.wipeDown();
                //     output.html(output.html() + "<br />" + 'wipeDown');
                // } else {
                //     // defaults.wipeUp();
                //     output.html(output.html() + "<br />" + 'wipeUp');
                // }
                if(delta !== 0){
                    calcIndex(delta);
                }
            }
        }

        function hMouseWheelHandler(evt) {
            // mousewheel-Event entfernen, um Überlagerung zu vermeiden
            $win.off("mousewheel.qpHorPara DOMMouseScroll.qpHorPara");
            // Standard-Verhalten unterbinden
            evt.preventDefault();

            var origEvt = evt.originalEvent,                                                    // Orginalevent
                delta = -Math.max(-1, Math.min(1, (origEvt.wheelDelta || -origEvt.detail)));    // -1 oder 1

            calcIndex(delta);
        }

        function registerEvents(){
            // DOMMouseScroll wegen Firefox ab Version 3
            $win.on("mousewheel.qpHorPara DOMMouseScroll.qpHorPara", function(evt){
                hMouseWheelHandler(evt);
            });
            if ('ontouchstart' in document.documentElement) {
                //this.addEventListener('touchstart', onTouchStart, false);
                $win.on('touchstart.qpHorPara', function(evt){
                    onTouchStart(evt.originalEvent);
                });
            }
        }

/* *** [Animation] *** */
        function calcIndex(delta) {
            var index = defaults.index + delta;         // neuer Index

            if(index >= 0 && index < slides.length){
                defaults.index = index;
                animSlide(defaults.index);
            }else{
                registerEvents();
            }
        }

        function animSlide(index, anim) {
            var nLeft;

            if(index >= 0 && index < slides.length){
                anim = (anim === undefined) ? defaults.anim : anim;
                nLeft = -index * defaults.width;

                if(isCss){
                    list.css({
                        'left': nLeft + "px",
                        'transition': 'left ' + (anim/1000) + 's ease-in-out'
                    });

                    window.setTimeout(function(){
                        registerEvents();
                    }, anim+50);
                }else{
                    list.animate({
                        left: nLeft + "px",
                    }, {
                        duration: anim,
                        easing: 'easeInOutQuart',
                        complete: function() {
                            registerEvents();
                        }
                    });
                }

            }
        }

/* *** [HILFSFUNKTIONEN] *** */
        // Existenz einer CSS-Eigenschaft testen
        function checkCssProperty(prop) {
            var elem = document.createElement('div'),
                prefixes = ['Moz', 'Webkit', 'O', 'ms'],
                _prop, i, prefixedProp;

            // testen auf Eigenschaft ohne Präfix
            if (prop in elem.style) {
                return true;
            }

            _prop = prop.charAt(0).toUpperCase() + prop.substr(1);

            if (prop in elem.style) {
                return true;
            }

            for (i=0; i<prefixes.length; ++i) {
                var prefixedProp = prefixes[i] + _prop;

                if (prefixedProp in elem.style) {
                    return true;
                }
            }

            return false;
        }

        // Public:
        // Methode - aufrufbar über Referenz.Methodenname
        this.displayMyName = function(){
            //alert(settings.qp_name);
            this.eventCaller();
        };

        this.eventCaller = function(){
            if(settings.my_callback != null)
                settings.my_callback(settings.qp_name, settings.url);
        }

        this.getPrivate = function(){
            alert(privateFn());
        }

      // Plugin initialisieren
      init();

      // if possible, return "this" to not break the chain
      return this;
    };
// [ENDE  - PLUGIN] ------------------------------------------------


    $(function(){
        // Horizontale Navigation (Slider)
        $('#contentWrapper').qpHorizontalParalax();
    })
})(jQuery);
