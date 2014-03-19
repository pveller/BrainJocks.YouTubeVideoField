using BrainJocks.YouTube.Custom.FieldTypes;
using Sitecore;
using Sitecore.Diagnostics;
using Sitecore.Shell.Applications.WebEdit.Commands;
using Sitecore.Shell.Framework.Commands;
using Sitecore.Text;
using Sitecore.Web;
using Sitecore.Web.UI.Sheer;

namespace BrainJocks.YouTube.Custom.Commands
{
    public class EditYouTubeVideoField : WebEditCommand
    {
        public string DialogUrl
        {
            get { return "control:SelectYouTubeVideo"; }
        }

        public override void Execute(CommandContext context)
        {
            string formValue = WebUtil.GetFormValue("scPlainValue");
            context.Parameters.Add("fieldValue", formValue);

            Context.ClientPage.Start(this, "Run", context.Parameters);
        }


        public void Run(ClientPipelineArgs args)
        {
            Assert.ArgumentNotNull(args, "args");

            string controlId = args.Parameters["controlid"];

            if (args.IsPostBack)
            {
                if (!args.HasResult) return;

                SheerResponse.SetAttribute("scHtmlValue", "value", YouTubeVideoField.FormatValueForPageEditorDisplay(args.Result));
                SheerResponse.SetAttribute("scPlainValue", "value", args.Result);

                SheerResponse.Eval("scSetHtmlValue('" + controlId + "', false, true)");
            }
            else
            {
                var urlString = new UrlString(UIUtil.GetUri(DialogUrl));
                urlString["val"] = args.Parameters.Get("fieldValue");

                Context.ClientPage.ClientResponse.ShowModalDialog(urlString.ToString(), "650px", "700px", string.Empty, true);

                args.WaitForPostBack();
            }
        }
    }
}