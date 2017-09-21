var jPlayerAndroidFix = function (a) {
    var b = function (a, b, f) {
        this.playFix = !1;
        this.init(a, b, f);
    };
    b.prototype = {
        init: function (b, e, f) {
            var c = this;
            this.id = b;
            this.media = e;
            this.options = f;
            this.player = a(this.id);
            this.player.bind(a.jPlayer.event.ready, function (a) {
                c.setMedia(c.media);
            });
            a.jPlayer.platform.android && (this.player.bind(a.jPlayer.event.progress, function (b) {
                c.playFixRequired && (c.playFixRequired = !1, c.playFix && (c.playFix = !1, a(this).jPlayer('play')));
            }), this.player.bind(a.jPlayer.event.ended, function (a) {
                c.endedFix && (c.endedFix = !1, setTimeout(function () {
                    c.setMedia(c.media);
                }, 0));
            }), this.player.bind(a.jPlayer.event.pause, function (b) {
                if (c.endedFix) {
                    var d = b.jPlayer.status.duration - b.jPlayer.status.currentTime;
                    (0 === b.jPlayer.status.currentTime || 1 > d) && setTimeout(function () {
                        c.jPlayer._trigger(a.jPlayer.event.ended);
                    }, 0);
                }
            }));
            this.player.jPlayer(this.options);
            this.jPlayer = this.player.data('jPlayer');
            this.cssSelectorAncestor = this.player.jPlayer('option', 'cssSelectorAncestor');
            this.resetAndroid();
            return this;
        },
        setMedia: function (a) {
            this.media = a;
            this.resetAndroid();
            this.player.jPlayer('setMedia', this.media);
            return this;
        },
        play: function () {
            a.jPlayer.platform.android && this.playFixRequired ? this.playFix = !0 : this.player.jPlayer('play');
        },
        resetAndroid: function () {
            a.jPlayer.platform.android && (this.playFix = !1, this.endedFix = this.playFixRequired = !0);
        }
    };
    return b;
}(jQuery);
var _player = null;
var _isPlaying = !1;
var _radUrl = null;
var _volume = 50;
var _sliderVolume = {};
var _volumeWidth = 95;
var _streamUrl = location.protocol + '//yours link here';
jQuery(document).ready(function () {
    jQuery('#containerHidden').jPlayer({
        ready: function (b) {
            jQuery(this).jPlayer('setMedia', { mp3: _streamUrl }).jPlayer('play');
            a.setMedia('#aPlayPause').PlayPause();
            jQuery.browser.msie && jQuery(this).jPlayer('setMedia', { mp3: _streamUrl }).jPlayer('play', 1);
            var d = void 0 === document.ontouchstart ? 'click' : 'touchstart', e = function () {
                    jQuery('#aPlayPause').jPlayer('play');
                    document.documentElement.removeEventListener(d, e, !0);
                };
            document.documentElement.addEventListener(d, e, !0);
        },
        initialVolume: _volume / 100
    });
    _player = jQuery('#containerHidden');
    var a = new jPlayerAndroidFix(PlayPause(), _streamUrl, _sliderVolume);
    _player.bind($.jPlayer.event.stop, function () {
        _player.jPlayer('clearMedia'), Stopped(), _player.bind($.jPlayer.event.timeupdate, self.update_timer);
    }), _player.bind($.jPlayer.event.play, function () {
        $(this).data('jPlayer').androidFix.setMedia = true, Playing(), _player.bind($.jPlayer.event.timeupdate, self.update_timer);
    }), self.update_timer = function (e) {
        e = e.jPlayer.status, $('.jtimer').text($.jPlayer.convertTime(e.currentTime));
    };
    _player.bind(jQuery.jPlayer.event.pause, function (a) {
        jQuery(this).jPlayer('clearMedia');
        Stopped();
    });
    _player.bind($.jPlayer.event.play, function (a) {
        Playing();
    });
    _player.bind($.jPlayer.event.volumechange, function (a) {
        VolumeChanged(a);
    });
    _sliderVolume.setup();
    _sliderVolume.draw();
});
function StopPlayer() {
    _player.jPlayer('pause');
    Stopped();
    return !1;
}
function PlayPause() {
    if (_isPlaying)
        return _player.jPlayer('clearMedia'), Stopped(), !1;
    _player.jPlayer('setMedia', { mp3: _streamUrl });
    _player.jPlayer('play');
    Playing();
}
function StartPlaying(a) {
    _player.jPlayer('play');
    Playing();
    return !1;
}
function VolumeChanged(a) {
}
function Playing() {
    jQuery('#aPlayPause').css('background-position', '-59px 0px');
    _isPlaying = !0;
    return !1;
}
function Stopped() {
    jQuery('#aPlayPause').css('background-position', '0px 0px');
    return _isPlaying = !1;
}
jQuery('#aPlayPause').click(function () {
    return PlayPause();
});
function ChangeVolume(a) {
    _volume != a && (_volume = a, _player.jPlayer('volume', _volume / 100));
}
_sliderVolume._value = _volume;
_sliderVolume._uipadding = 5;
_sliderVolume.onchange = function (a) {
    ChangeVolume(a);
};
_sliderVolume.setValue = function (a) {
    if (isNaN(a))
        return !1;
    a = Math.max(0, Math.min(100, a));
    _sliderVolume._value = a;
    _sliderVolume.draw();
};
_sliderVolume.getValue = function () {
    return _sliderVolume._value;
};
_sliderVolume.draw = function () {
    var a = _volumeWidth - 2 * _sliderVolume._uipadding, a = _sliderVolume.getValue() / 100 * a + _sliderVolume._uipadding;
    jQuery('#volume .handler').css('left', a + 'px');
    jQuery('#volume .fill').css('width', a + 'px');
};
_sliderVolume.calculateFromMouse = function (a) {
    a -= _sliderVolume._uipadding;
    _sliderVolume.setValue(a / (_volumeWidth - 2 * _sliderVolume._uipadding) * 100);
    _sliderVolume.onchange(_sliderVolume.getValue());
};
_sliderVolume.setup = function () {
    jQuery('#volume').append(jQuery('<div class="fill"></div>'));
    jQuery('#volume').append(jQuery('<span class="handler" href="#"></span>'));
    jQuery('#volume').bind('mousedown', function (a) {
        var b = jQuery('#volume').offset();
        _sliderVolume.calculateFromMouse(a.pageX - b.left);
        jQuery('#volume').mousemove(function (a) {
            var b = jQuery('#volume').offset();
            _sliderVolume.calculateFromMouse(a.pageX - b.left);
        });
    });
    jQuery('body').bind('mouseup', function (a) {
        jQuery('#volume').unbind('mousemove');
    });
    jQuery('#volume').bind('mouseup', function (a) {
        var b = jQuery('#volume').offset();
        _sliderVolume.calculateFromMouse(a.pageX - b.left);
    });
    _sliderVolume.draw();
};