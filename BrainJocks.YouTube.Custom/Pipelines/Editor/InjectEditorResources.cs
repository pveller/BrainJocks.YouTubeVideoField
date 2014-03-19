using System.Web;
using System.Web.UI;
using Sitecore;
using Sitecore.Pipelines;
using Sitecore.Shell.Applications.ContentEditor.Pipelines.RenderContentEditor;
using Sitecore.StringExtensions;

namespace BrainJocks.YouTube.Custom.Pipelines.Editor
{
    public class InjectEditorResources
    {
        private const string ScriptTag = "<script type='text/javascript' language='javascript' src='{0}{1}'></script>";
        private const string StyleTag = "<link href='{0}{1}' rel='stylesheet' />";

        private static readonly string[] RemoteScriptsToInclude =
        {
            "http://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.pack.js"
        };

        private static readonly string[] RemoteStylesToInclude =
        {
            "http://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.css"
        };

        public void Process(PipelineArgs args)
        {
            if (Context.ClientPage.IsEvent) return;

            HttpContext context = HttpContext.Current;
            if (context == null) return;

            var page = context.Handler as Page;
            if (page == null) return;

            var pipelineArgs = args as RenderContentEditorArgs;
            if (pipelineArgs == null || pipelineArgs.Item == null) return;

            DoProcess(page);
        }

        protected virtual void DoProcess(Page page)
        {
            AddReferences(page, RemoteScriptsToInclude, ScriptTag, string.Empty);
            AddReferences(page, RemoteStylesToInclude, StyleTag, string.Empty);
        }

        protected virtual void AddReferences(Page page, string[] resources, string tag, string root)
        {
            foreach (string resource in resources)
            {
                page.Header.Controls.Add(new LiteralControl(tag.FormatWith(root, resource)));
            }
        }
    }
}