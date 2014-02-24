
var BrainJocks = (function($, BrainJocks) {
  var console = window.console || { log: function() {} };

  BrainJocks.YouTubeSearch = BrainJocks.YouTubeSearch || {};

  var Driver = function() {
  };

  Driver.prototype.init = function(args) {
    var defaults = {
      debug : false,
      maxResults : 20
    };

    $.extend(this, defaults, args || {});

    this.view = this.view || {
      render: function(response) {
        console.log("view.render() is not defined");
      },

      highlight: function(videoId) {
        console.log("view.highlight() is not defined");
      }
    };

    this.query = {
      // a current search context object to hold query string and pagination
      q: '',
      prevPageToken: null,
      nextPageToken: null
    };
  };

  Driver.prototype.render = function(response) {
    if (this.debug) {
      console.log("Received from YouTube: " + JSON.stringify(response));
    }

    if (!response) return;

    this.query.nextPageToken = response.nextPageToken;
    this.query.prevPageToken = response.prevPageToken;

    this.view.render(response);
    this.view.highlight(this.video);
  };


  Driver.prototype.select = function(id) {
    if (this.debug) {
      console.log("Selected: " + id);
    }

    this.video = id;
    this.view.highlight(this.video);
  };

  Driver.prototype.search = function(q) {
    this.query.q = q;
    this.query.nextPageToken = null;
    this.query.prevPageToken = null;

    return this._paginate(1); 
  };

  Driver.prototype.next = function() {
    return this._paginate(1);    
  };

  Driver.prototype.prev = function() {
    return this._paginate(-1);
  };

  // pass -1 to paginate back or +1 to paginate forward. 
  Driver.prototype._paginate = function(direction) {
    var request = gapi.client.youtube.search.list({
      q: this.query.q,
      part: 'snippet',
      type: 'video',
      key: this.key,
      maxResults: this.maxResults,
      pageToken : (direction < 0) ? this.query.prevPageToken : this.query.nextPageToken
    });

    var self = this;
    request.execute(function(response) {
      self.render(response);
    }); 

    return false;
  };


  Driver.prototype.details = function(id, callback) {
    var request = gapi.client.youtube.videos.list({
        part: 'snippet',
        id: id,
        key: this.key,
        maxResults: 1
    });

    request.execute(function(response) {
        // patch the difference in YouTube search.list and videos.list JSON results
        if (response && response.items && response.items.length > 0) {
          response.items[0].id = {
            videoId: response.items[0].id
          };
        }

        callback(response);
    });
  };

  BrainJocks.YouTubeSearch.Driver = new Driver();

  return BrainJocks;

})(jQuery, BrainJocks || {});












