/*!
 * Player Plugin for jPlayer JavaScript Library.
 * Web Player Only HTML5 Version.
 * autoplay function in mobile and new web browsers not work.
 * You need add play button them click.
 * Copyright 2017-2019 Player.
 * Author: Tom Jonson.
 * Licensed under the Apache License 2.0.
 * https://github.com/TomJonson/html5-Audio-Player/blob/master/LICENSE
 * Version: 5.27.347
 * Date: 05.05.2019
 *
 * WebSite (https://github.com/TomJonson)
 */
var jPlayerAndroidFix = function ($) {
    var fix = function (id, media, options) {
        this.playFix = false;
        this.init(id, media, options);
    };
    fix.prototype = {
        init: function (id, media, options) {
            var self = this;
            // Store the params
            this.id = id;
            this.media = media;
            this.options = options;
            // Make a jQuery selector of the id, for use by the jPlayer instance.
            this.player = $(this.id);
            // Make the ready event to set the media to initiate.
            this.player.bind($.jPlayer.event.ready, function (event) {
                // Use this fix's setMedia() method.
                self.setMedia(self.media);
            });
            // Apply Android fixes
            if ($.jPlayer.platform.android) {
                // Fix playing new media immediately after setMedia.
                this.player.bind($.jPlayer.event.progress, function (event) {
                    if (self.playFixRequired) {
                        self.playFixRequired = false;
                        // Enable the contols again
                        // self.player.jPlayer('option', 'cssSelectorAncestor', self.cssSelectorAncestor);
                        // Play if required, otherwise it will wait for the normal GUI input.
                        if (self.playFix) {
                            self.playFix = false;
                            $(this).jPlayer('play');
                        }
                    }
                });
                // Fix missing ended events.
                this.player.bind($.jPlayer.event.ended, function (event) {
                    if (self.endedFix) {
                        self.endedFix = false;
                        setTimeout(function () {
                            self.setMedia(self.media);
                        }, 0);    // what if it was looping?
                    }
                });
                this.player.bind($.jPlayer.event.pause, function (event) {
                    if (self.endedFix) {
                        var remaining = event.jPlayer.status.duration - event.jPlayer.status.currentTime;
                        if (event.jPlayer.status.currentTime === 0 || remaining < 1) {
                            // Trigger the ended event from inside jplayer instance.
                            setTimeout(function () {
                                self.jPlayer._trigger($.jPlayer.event.ended);
                            }, 0);
                        }
                    }
                });
            }
            // Instance jPlayer
            this.player.jPlayer(this.options);
            // Store a local copy of the jPlayer instance's object
            this.jPlayer = this.player.data('jPlayer');
            // Store the real cssSelectorAncestor being used.
            this.cssSelectorAncestor = this.player.jPlayer('option', 'cssSelectorAncestor');
            // Apply Android fixes
            this.resetAndroid();
            return this;
        },
        setMedia: function (media) {
            this.media = media;
            // Apply Android fixes
            this.resetAndroid();
            // Set the media
            this.player.jPlayer('setMedia', this.media);
            return this;
        },
        play: function () {
            // Apply Android fixes
            if ($.jPlayer.platform.android && this.playFixRequired) {
                // Apply Android play fix, if it is required.
                this.playFix = true;
            } else {
                // Other browsers play it, as does Android if the fix is no longer required.
                this.player.jPlayer('play');
            }
        },
        resetAndroid: function () {
            // Apply Android fixes
            if ($.jPlayer.platform.android) {
                this.playFix = false;
                this.playFixRequired = true;
                this.endedFix = true;    // Disable the controls
                                         // this.player.jPlayer('option', 'cssSelectorAncestor', '#NeverFoundDisabled');
            }
        }
    };
    return fix;
}($);
var player = null;
var isPlaying = null;
var volume = 50;
var Volume = {};
var volumeWidth = 90;
var streamTwoCurvesUrl = '//';
var streamLinkUrl = 'yours domain name';
var streamOneCurveUrl = '/';
var streamLinkSource = 'yours stream name';
var streamLink = (location.protocol === 'https:' ? 'http:' : 'https:') + streamTwoCurvesUrl + (location.href === 'subdomain one.' ? 'subdomain two.' === 'subdomain three.' : 'subdomain one.') + streamLinkUrl + streamOneCurveUrl + streamLinkSource;
$(document).ready(function () {
    var id = '#containerHidden';
    var streamUrl = { mp3: streamLink };
    var options = {
            solution: 'html',
            supplied: 'mp3',
            preload: 'none',
            useStateClassSkin: false,
            autoBlur: false,
            keyEnabled: true,
            currentTime: '.jtimer',
            errorAlerts: false,
            warningAlerts: false
        }, player = $('#containerHidden');
    var myAndroidFix = new jPlayerAndroidFix(id, streamUrl, options, Volume);
        player.bind($.jPlayer.event.stop, function () {
        player.bind($.jPlayer.event.timeupdate, self.update_timer);
    }), player.bind($.jPlayer.event.play, function () {
        player.bind($.jPlayer.event.timeupdate, self.update_timer);
    }), self.update_timer = function (e) {
        e = e.jPlayer.status, $('.jtimer').text($.jPlayer.convertTime(e.currentTime));
    };
    function PlayPause() {
        if (isPlaying)
            return myAndroidFix.setMedia(streamUrl), Stopped();
            myAndroidFix.setMedia(streamUrl).play(), Playing();
    }
    function Playing() {
        $('#aPlayPause').css('background-position', '-59px 0px');
        $('#aPlayPause').attr('title', 'Stop [P]');
        isPlaying = true;
    }
    function Stopped() {
        $('#aPlayPause').css('background-position', '0px 0px');
        $('#aPlayPause').attr('title', 'Play [P]');
        isPlaying = false;
    }
    $('#aPlayPause').attr('title', 'Play [P]');
    $('#aPlayPause').click(function () {
        PlayPause();
    });
    document.onkeydown = function (e) {
        if (e.keyCode === 32) {
            PlayPause();
        }
        if (e.keyCode === 80) {
            PlayPause();
        }
    };
    function isTouchDevice() {
        return 'undefined' !== typeof window.ontouchstart;
    }
    var tmp = {}, c = new Array();
    function ChangeVolume(a) {
        volume != a && (volume = a, $('#containerHidden').jPlayer('volume', volume / 100));
    }
    Volume.value = volume;
    Volume.padding = 5;
    Volume.onchange = function (a) {
        ChangeVolume(a);
    };
    Volume.setValue = function (a) {
        if (isNaN(a))
            return !1;
        a = Math.max(0, Math.min(100, a));
        Volume.value = a;
        Volume.draw();
    };
    Volume.getValue = function () {
        return Volume.value;
    };
    Volume.draw = function () {
        var a = volumeWidth - 2 * Volume.padding, a = Volume.getValue() / 100 * a + Volume.padding;
        $('#volume .handler').css('left', a + 'px');
        $('#volume .fill').css('width', a + 'px');
        $('body').css({
            '-ms-user-select': 'none',
            '-moz-user-select': 'none',
            '-webkit-user-select': 'none',
            'user-select': 'none'
        });
    };
    Volume.calculateFromMouse = function (a) {
        a -= Volume.padding;
        Volume.setValue(a / (volumeWidth - 2 * Volume.padding) * 100);
        Volume.onchange(Volume.getValue()), tmp.moving = false;
    };
    Volume.setup = function () {
        $('#volume').append($('<div class="fill"></div>'));
        $('#volume').append($('<span class="handler" href="#"></span>'));
        $('.handler').attr('title', 'Volume');
        $('#volume').bind('mousedown', function (a) {
            var b = $('#volume').offset();
            Volume.calculateFromMouse(a.pageX - b.left);
            $('#volume').mousemove(function (a) {
                var b = $('#volume').offset();
                Volume.calculateFromMouse(a.pageX - b.left);
            });
        });
        $('body').bind('mouseup', function (a) {
            $('body').removeAttr('style'), $('#volume').unbind('mousemove');
        });
        $('#volume').bind('mouseup', function (a) {
            var b = $('#volume').offset();
            Volume.calculateFromMouse(a.pageX - b.left);
        });
        Volume.draw();
    };
    Volume.setup();
    Volume.draw();
});
