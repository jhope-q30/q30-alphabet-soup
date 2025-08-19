import * as params from '@params'; /// import from Hugo

( function(){

    console.log( "navigation js loaded" );

    /** strings */
    const $siteHeaderID = ( typeof params.site_header !== 'undefined' ) ? params.site_header : 'site-header';
    const $siteNavigationID = ( typeof params.site_navigation !== 'undefined' ) ? params.site_navigation : 'site-navigation';
    const $stickyHeader = ( typeof params.sticky_header !== 'undefined' ) ? params.sticky_header : 'sticky-header';
    const $menuTogglerID = ( typeof params.menu_toggle !== 'undefined' ) ? params.menu_toggle : 'menu-toggle';
    const $menuTogglesRef = ( typeof params.menu_toggles !== 'undefined' ) ? params.menu_toggles : 'menu-toggles';
    const $menuOpen = ( typeof params.menu_open !== 'undefined' ) ? params.menu_open : 'menu-open';
    const $menuFade = ( typeof params.menu_fade !== 'undefined' ) ? params.menu_fade : 'menu-fade';
    const $mobileBreakpoint = ( typeof params.breakpoint_mobile !== 'undefined' ) ? String( "( max-width: " + String( Number( params.breakpoint_mobile.replace( "px", "" ) ) - 1 ) + "px )" ) : "( max-width: 991px )";
    const $buttonLabels = 'data-labels';

    /** navigation */
    const $siteHeader = document.getElementById( $siteHeaderID );
    const $siteNavigation = $siteHeader.querySelector( `#${$siteNavigationID}` );

    var $screen = window.matchMedia( $mobileBreakpoint ).matches ? "small" : "large";
    var $scrollTop = document.documentElement.scrollTop;
    var $isSticky = false;

    if ( ! $siteNavigation ) {
        return;
    }

    const $menuToggler = $siteHeader.querySelector( `#${$menuTogglerID}` );
    const $menuToggles = $siteHeader.querySelectorAll( `.${$menuTogglesRef}` ); // query selector of all ele's that open with menu toggle

    /** toggle labels */
    let $menuLables = $menuToggler.getAttribute( $buttonLabels );
    $menuLables = $menuLables.replace( /'/g, '"' );
    $menuLables = JSON.parse( $menuLables );

    const $labels = { 
        'open' : $menuLables.length ? $menuLables[0] : 'open',
        'close' : $menuLables.length ? $menuLables[1] : 'close',
    };

    var closeMenu = () => {
        if( $menuToggler.getAttribute( 'aria-expanded' ) === 'true' ){
            document.body.classList.remove( $menuFade );
            $menuToggler.setAttribute( 'aria-expanded', 'false' );
            $menuToggler.setAttribute( 'aria-label', $labels[ 'open' ] );
            Array.prototype.forEach.call( $menuToggles, ( $toggle, i ) => {
                $toggle.classList.remove( $menuFade );
            });
        }
    }
    var checkKey = (e) => {
        if( e.key == "Escape" ){
            closeMenu();
        }
    }
    var checkInSiteNavigation = (e) => {
        if( ! $siteNavigation.contains( e.relatedTarget ) && $screen == "small" ){
            closeMenu();
        }
    }
    var updateHeader = () => {
        if( $scrollTop > 0 ){
            if( ! $isSticky ){
                setTimeout( () => { $siteHeader.classList.add( $stickyHeader ); }, 1 );
                $isSticky = true;
            }
            return;
        }
        $siteHeader.classList.remove( $stickyHeader );
        $isSticky = false;
    }
    var updateMenuSize = () => {
        if( $screen == "large" ){
            closeMenu();
            $siteNavigation.removeAttribute( 'style' );
            /** remove menuOpen class when on larger screen */
            Array.prototype.forEach.call( $menuToggles, ( $toggle, i ) => {
                if( $toggle.classList.contains( $menuOpen ) ){
                    $toggle.classList.remove( $menuOpen );
                }
            });
        } else {
            $siteNavigation.style.height = ( window.innerHeight - $siteHeader.offsetHeight ) + "px";
        }
    }
    var updateTabIndex = () => {
        if( $screen == "large" ){
            $menuToggler.setAttribute( 'tabindex', '-1' );
        } else {
            $menuToggler.setAttribute( 'tabindex', '0' );
        }
    }
    var updateWindowSize = () => {
        $screen = window.matchMedia( $mobileBreakpoint ).matches ? "small" : "large";
        updateMenuSize();
        updateTabIndex();
    }
    var update = () => {
        $scrollTop = document.documentElement.scrollTop;
        updateHeader();
        updateWindowSize();
        updateTabIndex();
    }
    $menuToggler.setAttribute( 'aria-label', $labels[ 'open' ] );
    $menuToggler.addEventListener( 'click', (e) => {
        let $this = $menuToggler;
        if( $this.getAttribute( 'aria-expanded' ) != 'true' ){ /// if hamburger is open
            $this.setAttribute( 'aria-expanded', 'true' );
            updateMenuSize();
            document.body.classList.add( $menuFade );
            $menuToggler.setAttribute( 'aria-label', $labels[ 'close' ] );
            Array.prototype.forEach.call( $menuToggles, function( $toggle, i ){
                $toggle.classList.add( $menuOpen );
                setTimeout( () => { $toggle.classList.add( $menuFade ); }, 1 );
            });
        } else {
            closeMenu();
        }
    } );
    $menuToggler.addEventListener( 'keydown', checkKey );
    $siteNavigation.addEventListener( 'keydown', checkKey );
    $siteNavigation.addEventListener( 'focusout', checkInSiteNavigation );

    window.addEventListener( 'scroll', update, false );
    window.addEventListener( "resize", updateWindowSize, false );

    setTimeout( () => { update(); }, 1 );

}() );