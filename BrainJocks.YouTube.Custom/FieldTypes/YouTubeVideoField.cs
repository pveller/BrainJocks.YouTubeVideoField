using System;
using Sitecore.Data.Fields;
using Sitecore.Globalization;

namespace BrainJocks.YouTube.Custom.FieldTypes
{
    public class YouTubeVideoField : CustomField
    {
        public enum ThumbnailSize
        {
            Small = 0, // default
            Medium = 1,
            Large = 2
        }

        public YouTubeVideoField(Field innerField)
            : base(innerField)
        {
        }

        public YouTubeVideoField(Field innerField, string runtimeValue)
            : base(innerField, runtimeValue)
        {
        }

        public string Video
        {
            get { return Value; }
        }

        public static string PreviewMarkup
        {
            get { return @"                    
                    <a id='{0}' href='http://www.youtube.com/v/{1}?fs=1&autoplay=1' target='_blank'><img src='{2}'/></a>                    
                    <script type='text/javascript'>
                        (function ($) {{
                            $(document).ready(function() {{
                                $('#{0}').click(function(e) {{
                                    $.fancybox({{
                                        'padding': 0,
                                        'title': this.title,
                                        'width': 640,
                                        'height': 385,
                                        'href': this.href,
                                        'type': 'swf'
                                    }});

                                    e.preventDefault();
                                    e.stopPropagation();
                                }});
                            }});
                        }})(jQuery);
                    </script>"; }
        }

        public static implicit operator YouTubeVideoField(Field field)
        {
            return field != null ? new YouTubeVideoField(field) : null;
        }

        public static string GetThumbnailImageUrl(string id, ThumbnailSize size = ThumbnailSize.Small)
        {
            switch (size)
            {
                case ThumbnailSize.Large:
                    return string.Format("//i.ytimg.com/vi/{0}/hqdefault.jpg", id);
                case ThumbnailSize.Medium:
                    return string.Format("//i.ytimg.com/vi/{0}/mqdefault.jpg", id);
                default:
                    return string.Format("//i.ytimg.com/vi/{0}/default.jpg", id);
            }
        }

        public static string FormatValueForPageEditorDisplay(string rawValue, ThumbnailSize size = ThumbnailSize.Small)
        {
            return string.IsNullOrEmpty(rawValue)
                ? Translate.Text("[No video selected]")
                : string.Format(PreviewMarkup, Guid.NewGuid(), rawValue, GetThumbnailImageUrl(rawValue, size));
        }
    }
}