using System;
using System.Text;
using System.Web.UI;
using BrainJocks.YouTube.Custom.FieldTypes;
using Sitecore;
using Sitecore.Diagnostics;
using Sitecore.Globalization;
using Sitecore.Text;
using Sitecore.Web.UI.HtmlControls;
using Sitecore.Web.UI.Sheer;

namespace BrainJocks.YouTube.Custom.Controls
{
    internal class YouTubeVideoLookup : Input
    {
        public string DialogUrl
        {
            get { return "control:SelectYouTubeVideo"; }
        }

        protected override void DoRender(HtmlTextWriter output)
        {
            var sb = new StringBuilder();

            if (string.IsNullOrEmpty(Value))
            {
                sb.AppendFormat("<p id='{0}'>", ID)
                    .Append(Translate.Text("There is no video selected."))
                    .Append("</p>");
            }
            else
            {
                string thumbUrl = YouTubeVideoField.GetThumbnailImageUrl(Value, YouTubeVideoField.ThumbnailSize.Medium);
                sb.AppendFormat(YouTubeVideoField.PreviewMarkup, ID, Value, thumbUrl);
            }

            output.Write(sb.ToString());
        }


        #region Handle Message Boilerplate

        public override void HandleMessage(Message message)
        {
            base.HandleMessage(message);
            if (!ShouldHandleMessage(message))
            {
                return;
            }

            DoHandleMessage(message);
        }

        protected virtual bool ShouldHandleMessage(Message message)
        {
            return IsCurrentControl(message)
                   && !string.IsNullOrWhiteSpace(message.Name);
        }

        protected virtual bool IsCurrentControl(Message message)
        {
            return string.Equals(message["id"], ID, StringComparison.InvariantCultureIgnoreCase);
        }

        #endregion


        /// <summary>
        ///     Suports calling Select and Clear for [control]:select and [control]:clear events
        /// </summary>
        /// <param name="message"></param>
        protected void DoHandleMessage(Message message)
        {
            Assert.IsNotNull(message.Name, "Message Name");

            string[] command = message.Name.Split(':');
            Assert.IsTrue(command.Length > 1, "Expected message format is control:message");

            switch (command[1])
            {
                case "clear":
                    Sitecore.Context.ClientPage.Start(this, "Reset");
                    return;

                case "select":
                    Sitecore.Context.ClientPage.Start(this, "Select");
                    return;
            }
        }

        public void Select(ClientPipelineArgs args)
        {
            if (args.IsPostBack)
            {
                if (!args.HasResult) return;

                Value = args.Result;
                SetModified();
                SheerResponse.Refresh(this);
            }
            else
            {
                Assert.IsNotNull(DialogUrl, "Dialog URL");
                var urlString = new UrlString(UIUtil.GetUri(DialogUrl));

                if (!string.IsNullOrEmpty(Value))
                {
                    urlString["val"] = Value;
                }

                Sitecore.Context.ClientPage.ClientResponse.ShowModalDialog(urlString.ToString(), "650px", "700px", string.Empty, true);

                args.WaitForPostBack();
            }
        }

        public void Reset(ClientPipelineArgs args)
        {
            Value = String.Empty;
            SetModified();
            SheerResponse.Refresh(this);
        }

        protected override void SetModified()
        {
            base.SetModified();

            if (TrackModified)
            {
                Sitecore.Context.ClientPage.Modified = true;
            }
        }
    }
}