**Release** folder has everything you need to start using YouTube Video Picker field in your projects

> Note: compiled against Sitecore 7 Update 2

# Installation Options

## Option 1

The `*.update` files are TDS artifacts straight form the build with `/p:Configuration=Release`:

* `TDS.Core.update` has `core` database items (custom field type definition) that support the YouTube Video Picker field
* `TDS.Master.update` has `master` database items - test layout and rendering as well as a slight modification to the Sample data template to include two video fields - as well as all binaries and file system resources.
* `TDS.Master.Content.update` has items from under `sitecore\content` which in this case is only the updated `Home` item.

You would normally install `Core` followed by `Master` and skip the `Content` package as it only brings a demo item. You would also probably throw away test layout and rendering once deployed.

To install `.update` artifacts please use `/sitecore/admin/updateinstallationwizard.aspx`.

## Option 2

The `*.zip` is a traditional Sitecore package with everything in it.

# Configuration

There's one thing you will need to do after you install the package - configure your Google API key:

1. Obtain (if you don't have one) a Google API key for your site and properly configure access restrictions in the [Google Developers Console](https://console.developers.google.com)
2. Open `<site root>\Website\sitecore modules\BrainJocks\resources\brainjocks.youtubesearch.init.js` and enter your Google API key:
```javascript
var driver = BrainJocks.YouTubeSearch.Driver;

driver.init({
    key: '<Your Google Api Key Here>',
    view: new BrainJocks.YouTubeSearch.DustView({
        template: 'video-results-template',
        placeholder: $('#Results')
    })
});
```

We will (hopefully) remove this wrinkle with a site-specific setting in a hypothetical future version of the YouTube Video Picker Field.

# Troubleshooting

If everything looks good but the picker dialog keeps returning no results please open the inspector/console and see if YouTube API comes back with a 400 (bad request). The likely cause is either not configured or not properly configured API key. You can try how your key works with YouTube API [here](https://developers.google.com/youtube/v3/docs/search/list).

Enjoy!