/**
 * jQuery Quovolver 2.0.2
 * https://github.com/sebnitu/Quovolver
 *
 * By Sebastian Nitu - Copyright 2012 - All rights reserved
 * Author URL: http://sebnitu.com
 */
;(function ($) {
    $.fn.quovolver = function(options) {
        'use strict';
        
        // Extend our default options with those provided.
        var opts = $.extend({}, $.fn.quovolver.defaults, options);

        // This allows for multiple instances of this plugin in the same document
        return this.each(function () {

            // Go To function
            function gotoItem(itemNumber) {

                // Check if stuff is already being animated and kill the script if it is
                if( $items.is(':animated') || $this.is(':animated') ) { return false; }
                // If the container has been hidden, kill the script
                // This prevents the script from bugging out if something hides the revolving
                // object from another script (tabs for example)
                if( $box.is(':hidden') ) { return false; }

                // Don't let itemNumber go above or below possible options
                if ( itemNumber < 1 ) {
                    itemNumber = $total;
                } else if ( itemNumber > $total ) {
                    itemNumber = 1;
                }

                // Create the data object to pass to our transition method
                var gotoData = {
                        current : $( $items[$active -1] ), // Save currently active item
                        upcoming : $( $items[itemNumber - 1] ) // Save upcoming item
                };

                // Save current and upcoming hights and outer heights
                gotoData.currentHeight = getHiddenProperty(gotoData.current, 'height');
                gotoData.upcomingHeight = getHiddenProperty(gotoData.upcoming, 'height');
                gotoData.currentOuterHeight = getHiddenProperty(gotoData.current, 'outerHeight');
                gotoData.upcomingOuterHeight = getHiddenProperty(gotoData.upcoming, 'outerHeight');

                // Save current and upcoming widths and outer widths
                gotoData.currentWidth = getHiddenProperty(gotoData.current, 'width');
                gotoData.upcomingWidth = getHiddenProperty(gotoData.upcoming, 'width');
                gotoData.currentOuterWidth = getHiddenProperty(gotoData.current, 'outerWidth');
                gotoData.upcomingOuterWidth = getHiddenProperty(gotoData.upcoming, 'outerWidth');

                // Transition method
                if (o.transition !== 'basic' &&
                    typeof o.transition === 'string' &&
                    eval('typeof ' + o.transition) === 'function' ) {
                    // Run the passed method
                    eval( o.transition + '(gotoData)' );
                } else {
                    // Default transition method
                    basic(gotoData);
                }

                // Update active item
                $active = itemNumber;

                // Update navigation
                updateNavNum($nav);
                updateNavText($nav);

                // Disable default behavior
                return false;
            }

            // Build navigation
            function buildNav() {
                // Check the position of the nav and insert container
                var nav;
                if ( o.navPosition === 'above' || o.navPosition === 'both' ) {
                    $box.prepend('<div class="quovolve-nav quovolve-nav-above"></div>');
                    nav = $box.find('.quovolve-nav');
                }
                if ( o.navPosition === 'below' || o.navPosition === 'both' ) {
                    $box.append('<div class="quovolve-nav quovolve-nav-below"></div>');
                    nav = $box.find('.quovolve-nav');
                }
                if ( o.navPosition === 'custom' ) {
                    if ( o.navPositionCustom !== '' && $( o.navPositionCustom ).length !== 0 ) {
                        $( o.navPositionCustom ).append('<div class="quovolve-nav quovolve-nav-custom"></div>');
                        nav = $( o.navPositionCustom ).find('.quovolve-nav');
                    } else {
                        // console.log('Error', 'That custom selector did not return an element.');
                    }
                }

                // Previous and next navigation
                if ( o.navPrev ) {
                    nav.append('<span class="nav-prev"><a href="#">' + o.navPrevText + '</a></span>');
                }
                if ( o.navNext ) {
                    nav.append('<span class="nav-next"><a href="#">' + o.navNextText + '</a></span>');
                }
                // Numbered navigation
                if ( o.navNum ) {
                    nav.append('<ol class="nav-numbers"></ol>');
                    for (var i = 1; i < ($total + 1); i++ ) {
                        nav
                            .find('.nav-numbers')
                            .append('<li><a href="#item-' + i + '">' + i + '</a></li>');
                    }
                    updateNavNum(nav);
                }
                // Navigation description
                if ( o.navText ) {
                    nav.append('<span class="nav-text"></span>');
                    updateNavText(nav);
                }

                return nav;
            }

            // Get height of a hidden element
            function getHiddenProperty(item, property) {
                // Get the requested property
                var value = item[property]();
                // if no value, it's probably because this element and/or a parent element is hidden
                if (!value || value == 0) {
                    // walk up the DOM and show all elements momentarily
                    var elements = item.parents().andSelf().filter(':hidden');
                    // store current display
                    elements.each(function() {
                        this.oDisplay = this.style.display;
                        $(this).show();
                    });
                    // Get the property again
                    var value = item[property]();
                    // revert visibility of elements
                    elements.each(function() {
                        this.style.display = this.oDisplay;
                    });
                }
                // Return the value
                return value;
            }

            // Equal Column Heights
            function equalHeight(group) {
                var tallest = 0;
                group.height('auto');
                group.each(function() {
                    var thisHeight;
                    if ( $(this).is(':visible') ) {
                        thisHeight = $(this).height();
                    } else {
                        thisHeight = getHiddenProperty( $(this), 'height' );
                    }
                    if(thisHeight > tallest) {
                        tallest = thisHeight;
                    }
                });
                group.height(tallest);
            }

            // Update numbered navigation
            function updateNavNum(nav) {
                if (o.navEnabled) {
                    nav.find('.nav-numbers li').removeClass('active');
                    nav
                        .find('.nav-numbers a[href="#item-' + $active + '"]')
                        .parent()
                        .addClass('active');
                }
            }

            // Update navigation description
            function updateNavText(nav) {
                if (o.navEnabled) {
                    var content = o.navTextContent.replace('@a', $active).replace('@b', $total);
                    nav.find('.nav-text').text(content);
                }
            }

            // Start auto play
            function autoPlay() {
                var intervalSpeed = (o.autoPlaySpeed == 'auto' ? $items[$active-1].textLength*25 + 2000 : o.autoPlaySpeed);
                $box.addClass('play');
                clearTimeout($intervalID);
                $intervalID = setTimeout(function() {
                    gotoItem( $active + 1 );
                    autoPlay();
                }, intervalSpeed);
            }

            // Pause auto play
            function pauseAutoPlay() {
                if ( o.stopAutoPlay !== true ) {
                    $box.hover(function() {
                        $box.addClass('pause').removeClass('play');
                        clearTimeout($intervalID);
                    }, function() {
                        $box.removeClass('pause').addClass('play');
                        clearTimeout($intervalID);
                        autoPlay();
                    });
                }
            }

            // Stop auto play
            function stopAutoPlay() {
                $box.hover(function() {
                    $box.addClass('stop').removeClass('play');
                    clearTimeout($intervalID);
                }, function() {});
            }

            function goToAndPlay(itemNumber) {
                clearTimeout($intervalID);
                gotoItem(itemNumber);
                if (o.autoPlay) { 
                    autoPlay();
                }
            }

            // Transition Effects
            // Basic (default) Just swaps out items with no animation
            function basic(data) {
                $this.css('height', data.upcomingOuterHeight);
                data.current.hide();
                data.upcoming.show();
                if (o.equalHeight === false) {
                    $this.css('height', 'auto');
                }
            }

            // Fade animation
            function fade(data) {

                // Set container to current item's height
                $this.height(data.currentOuterHeight);

                // Fade out the current container
                data.current.fadeOut(o.transitionSpeed, function() {
                    // Resize container to upcming item's height
                    $this.animate({
                        height : data.upcomingOuterHeight
                    }, o.transitionSpeed, function() {
                        // Fade in the upcoming item
                        data.upcoming.fadeIn(o.transitionSpeed, function() {
                            // Set height of container to auto
                            $this.height('auto');
                        });
                    });
                });

            }

            // Save our object
            var $this = $(this);

            // Build element specific options
            // This lets me access options with this syntax: o.optionName
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

            // Initial styles and markup
            $this.addClass('quovolve')
                 .css({ 'position' : 'relative' })
                 .wrap('<div class="quovolve-box"></div>');

            var groupMethod;
            if( o.children ) {
                groupMethod = 'find';
            } else {
                groupMethod = 'children';
            }

            // Initialize element specific variables
            var $box = $this.parent('.quovolve-box'),
                $items = $this[groupMethod](o.children),
                $active = 1,
                $total = $items.length;

            // Hide all except the first
            $items.hide().filter(':first').show();

            // Call build navigation function
            if ( o.navPrev || o.navNext || o.navNum || o.navText ) {
                o.navEnabled = true;
                var $nav = buildNav();
            } else {
                o.navEnabled = false;
            }

            // Call equal heights function
            if (o.equalHeight) {
                equalHeight( $items );
                // Recalculate equal heights on window resize
                $(window).resize(function() {
                    equalHeight( $items );
                    $this.css('height', $($items[$active -1]).outerHeight() );
                });
            }

            // Auto play interface
            if (o.autoPlay) {
                  if (o.autoPlaySpeed == 'auto') {
    								// get and store # of chars in each quote
	                $items.each(function() {
	                  this.textLength = $(this).text().length;
	                });
								}
                var $intervalID;
                autoPlay();
                if (o.stopOnHover) {
                    stopAutoPlay();
                } else if (o.pauseOnHover) {
                    pauseAutoPlay();
                }
            }

            // Bind to the forward and back buttons
            $('.nav-prev a',$box).click(function () {
                goToAndPlay( $active - 1 );
                return false;
            });
            $('.nav-next a',$box).click(function () {
                goToAndPlay( $active + 1 );
                return false;
            });

            // Bind the numbered navigation buttons
            $('.nav-numbers a',$box).click(function() {
                goToAndPlay( $(this).text() );
                return false;
            });

            // Create a public interface to move to a specific item
            $(this).bind('goto', function (event, item) {
                goToAndPlay( item );
            });

        }); // @end of return this.each()

    };
    
    $.fn.quovolver.defaults = {

        children : '', // If selector is provided, we will use the find method to get the group of items

        transition : 'fade', // The style of the transition
        transitionSpeed : 300, // This is the speed that each animation will take, not the entire transition

        autoPlay : true, // Toggle auto rotate
        autoPlaySpeed : 'auto', // Duration before each transition: either milliseconds or 'auto' to determine by quote length
        pauseOnHover : true, // Should the auto rotate pause on hover
        stopOnHover : false, // Should the auto rotate stop on hover (and not continue after hover)
        equalHeight : true, // Should every item have equal heights

        navPosition : 'above', // above, below, both, custom (must provide custom selector for placement)
        navPositionCustom : '', // selector of custom element

        navPrev : false, // Toggle "previous" button
        navNext : false, // Toggle "next" button
        navNum : false, // Toggle numbered navigation
        navText : false, // Toggle navigation description (e.g. display current item # and total item #)

        navPrevText : 'Prev', // Text for the "previous" button
        navNextText : 'Next', // Text for the "next" button
        navTextContent : '@a / @b' // @a will be replaced with current and @b with total

    };
})(jQuery);
