(function($) {
  window.onYouTubeLoaded = function() {
    $(document).ready(function() {
      var driver = BrainJocks.YouTubeSearch.Driver;

      driver.init({
        key: 'AIzaSyBmmCyZySDk_letQcklTH5Q_R5f4lQ24Wo',
        view: new BrainJocks.YouTubeSearch.DustView({
          template: 'video-results-template', 
          placeholder: $('#results')
        })
      });

      $('#search-button').click(function(e) {
        driver.search($('#search-query').val());
      });

      $('.pager > .next').click(function(e) {
        driver.next();
      });

      $('.pager > .previous').click(function(e) {
        driver.prev();
      });

      $.extend(dust.filters, { 
        fromNow: function(timestamp){
          return moment(timestamp).fromNow();
        }
      });

      dust.compileFn($('#video-results-template').html(), 'video-results-template');

      $('#search-button').attr('disabled', false);

      // display urrently selected video
      var videoId = 'seqszJ-_Mn0';
      driver.details(videoId, function(response) {
        var view = new BrainJocks.YouTubeSearch.DustView({
          template: 'video-results-template', 
          placeholder: $('#video-selected-preview'), 
          pagination: false 
        });

        view.render(response);

        driver.select(videoId);
      });

    });
  };
})(jQuery);

