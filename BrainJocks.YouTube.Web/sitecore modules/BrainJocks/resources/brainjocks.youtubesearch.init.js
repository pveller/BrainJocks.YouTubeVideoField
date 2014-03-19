(function($) {
    $(document).ready(function() {
        var driver = BrainJocks.YouTubeSearch.Driver;

        driver.init({
            key: '<Your Google Api Key Here>',
            view: new BrainJocks.YouTubeSearch.DustView({
                template: 'video-results-template',
                placeholder: $('#Results')
            })
        });

        $('#SearchButton').click(function(e) {
            driver.search($('#SearchQuery').val());
            return false;
        });

        $('.pager > .next').click(function(e) {
            driver.next();
        });

        $('.pager > .previous').click(function(e) {
            driver.prev();
        });

        var submitQueryOnEnter = function (e) {
            if (e.which == 13) {
                // prevent Sitecore from submitting the form
                e.preventDefault();
                e.stopPropagation();

                $('#SearchButton').click();
            }
        };

        $('#SearchQuery').keydown(submitQueryOnEnter);
        $('#SearchButton').keydown(submitQueryOnEnter);

        $('#SearchButton').attr('disabled', false);

        $.extend(dust.filters, {
            fromNow: function(timestamp) {
                return moment(timestamp).fromNow();
            }
        });

        dust.compileFn($('#VideoResultsTemplate').html(), 'video-results-template');

        // display currently selected video
        var videoId = $('#RawValue').val();
        if (videoId) {
            driver.details(videoId, function(response) {
                var view = new BrainJocks.YouTubeSearch.DustView({
                    template: 'video-results-template',
                    placeholder: $('#SelectedValue'),
                    pagination: false
                });

                view.render(response);

                driver.select(videoId);
            });
        }
    });
})(jQuery);
