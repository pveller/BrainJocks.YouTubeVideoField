var BrainJocks = (function($, BrainJocks) {

    BrainJocks.YouTubeSearch = BrainJocks.YouTubeSearch || {};

    var DustView = function(args) {
        var defaults = {
            preview: true,
            selection: true,
            pagination: true,
            placeholder: $('body')
        };

        $.extend(this, defaults, args || {});
    };

    DustView.prototype.render = function(response) {
        var self = this;
        dust.render(this.template, response, function(err, out) {
            if (err) {
                self.placeholder.html('Internal error. Please try again');
                response = null;

            } else {
                self.placeholder.html(out);
            }

            self.activatePreview(response);
            self.activateSelection(response);
            self.activatePagination(response);
        });

        return false;
    };

    DustView.prototype.highlight = function(videoId) {
        $('.selected').removeClass('selected');

        if (videoId) {
            $('.' + videoId).addClass('selected');
            $('.' + videoId).find('.video-selected-mark').addClass('selected');
        }
    };

    DustView.prototype.activatePreview = function() {
        if (!this.preview) return;

        $('.video-autoplay').unbind('click.preview');
        $('.video-autoplay').bind('click.preview', function(e) {
            $.fancybox({
                'padding': 0,
                'title': this.title,
                'width': 640,
                'height': 385,
                'href': this.href,
                'type': 'swf'
            });

            e.preventDefault();
        });
    };

    DustView.prototype.activateSelection = function() {
        if (!this.selection) return;

        $('.video-result').unbind('click.select');
        $('.video-result').bind('click.select', function(e) {
            var src = e.target || e.srcElement;
            if (!src.href && !src.parentNode.href) {
                BrainJocks.YouTubeSearch.Driver.select($(this).data('id'));
            } else {
                // skip as the click was on the video preview links
            }
        });
    };

    var _activatePagerButtons = function(selector, token) {
        if (token) {
            $(selector).removeClass('disabled');
        } else {
            $(selector).addClass('disabled');
        }
    };

    DustView.prototype.activatePagination = function(response) {
        if (!this.pagination) return;

        if (response && response.pageInfo) {
            $('.pager').css('display', response.pageInfo.totalResults > 0 ? 'block' : 'none');
            _activatePagerButtons('.pager > .next', response.nextPageToken);
            _activatePagerButtons('.pager > .previous', response.prevPageToken);

        } else {
            $('.pager').css('display', 'none');
        }
    };

    BrainJocks.YouTubeSearch.DustView = DustView;

    return BrainJocks;

})(jQuery, BrainJocks || {});