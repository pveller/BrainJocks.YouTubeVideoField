using System;
using Sitecore;
using Sitecore.Web;
using Sitecore.Web.UI.HtmlControls;
using Sitecore.Web.UI.Pages;
using Sitecore.Web.UI.Sheer;

namespace BrainJocks.YouTube.Web.XmlControls
{
    public class SelectYouTubeVideo : DialogForm
    {
        protected Edit RawValue;

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (Context.ClientPage.IsEvent) return;

            RawValue.Value = WebUtil.GetQueryString("val");
        }

        protected override void OnOK(object sender, EventArgs args)
        {
            SheerResponse.SetDialogValue(RawValue.Value);

            base.OnOK(sender, args);
        }
    }
}