var BrainJocks = (function($, BrainJocks) {
    var console = window.console || { log: function() {} };

    BrainJocks.YouTubeSearch = BrainJocks.YouTubeSearch || {};

    var Driver = function() {
    };

    Driver.prototype.init = function(args) {
        var defaults = {
            debug: false,
            maxResults: 20
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
        var self = this;
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/search',
            type: 'GET',
            data: {
                'q': this.query.q,
                'part': 'snippet',
                'type': 'video',
                'key': this.key,
                'maxResults': 20,
                'pageToken': ((direction < 0) ? this.query.prevPageToken : this.query.nextPageToken) || ''
            },
            error: function (xhr, status, error) {
                //ToDo: add error rendering
                self.render(error);
            },
            success: function(response, status, xhr) {
                self.render(response);
                }
        });

        return false;
    };


    Driver.prototype.details = function(id, callback) {
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/videos',
            type: 'GET',
            data: {
                part: 'snippet',
                id: id,
                key: this.key,
                maxResults: 1
            },
            error: function (xhr, status, error) {
                //ToDo: add error rendering
                callback(error);
            },
            success: function (response, status, xhr) {
                // patch the difference in YouTube search.list and videos.list JSON
                if (response && response.items && response.items.length > 0) {
                    response.items[0].id = {
                        videoId: response.items[0].id
                    };
                }
                
                callback(response);
            }
        });
    };

    BrainJocks.YouTubeSearch.Driver = new Driver();

    return BrainJocks;

})(jQuery, BrainJocks || {});
