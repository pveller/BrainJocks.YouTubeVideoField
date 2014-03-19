using System;
using BrainJocks.YouTube.Custom.FieldTypes;
using Sitecore;
using Sitecore.Diagnostics;
using Sitecore.Pipelines.RenderField;

namespace BrainJocks.YouTube.Custom.Pipelines.Rendering
{
    internal class GetYouTubeVideoFieldValue
    {
        public void Process(RenderFieldArgs args)
        {
            Assert.ArgumentNotNull(args, "args");

            string fieldTypeKey = args.FieldTypeKey;
            if (fieldTypeKey != "youtubevideo") return;

            args.DisableWebEditContentEditing = true;

            if (!Context.PageMode.IsPageEditorEditing) return;

            YouTubeVideoField video = args.GetField();

            YouTubeVideoField.ThumbnailSize size;
            Enum.TryParse(args.Parameters["Size"], out size); // default is Small

            args.Result.FirstPart = YouTubeVideoField.FormatValueForPageEditorDisplay(video.Value, size);
        }
    }
}