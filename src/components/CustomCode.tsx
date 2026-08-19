import { getSiteContent } from "@/lib/cms";

/**
 * Site-wide custom code from the CMS: extra CSS, a `<head>` snippet and an
 * end-of-body snippet.
 *
 * Rendered as written — filtering would defeat the purpose, since this is where a
 * verification meta tag, an analytics snippet or a one-off override goes. What
 * contains it is authorisation: only an admin can reach the screen that writes
 * these, and the settings route enforces that.
 *
 * The CSS is a plain `<style>` after ThemeStyle, so it can override any token.
 *
 * The two HTML snippets are inserted by a small inline script rather than
 * rendered directly, for two reasons that both bite otherwise:
 *
 *  - React needs an element to hang `dangerouslySetInnerHTML` on, and a wrapper
 *    `<div>` inside `<head>` is invalid HTML. The browser relocates it, the
 *    server and client trees stop matching, and hydration fails (React #418).
 *  - A `<script>` inserted via `innerHTML` never executes, so an analytics
 *    snippet pasted into the field would silently do nothing. The inserter
 *    rebuilds script elements so they run.
 *
 * The trade-off is that these two snippets are applied client-side, so they are
 * not in the server-rendered HTML. A crawler that does not execute JavaScript
 * will not see them — worth knowing if a verification tag ever has to be visible
 * without JS.
 */

/**
 * Inserts a snippet into `document.head` or `document.body`, re-creating script
 * elements so they execute. Kept dependency-free and tiny; it ships inline.
 */
const INSERTER = `(function(html,where){try{
var t=document.createElement("template");t.innerHTML=html;
var target=where==="head"?document.head:document.body;
Array.prototype.forEach.call(t.content.childNodes,function(node){
  if(node.nodeName==="SCRIPT"){
    var s=document.createElement("script");
    Array.prototype.forEach.call(node.attributes,function(a){s.setAttribute(a.name,a.value)});
    s.textContent=node.textContent;target.appendChild(s);
  } else { target.appendChild(node.cloneNode(true)); }
});
}catch(e){console.error("[custom code]",e)}})`;

function inserter(html: string, where: "head" | "body"): string {
  // JSON.stringify escapes the snippet for a JS string literal; the `</script`
  // guard stops a snippet containing a closing tag from ending this script early.
  const literal = JSON.stringify(html).replace(/<\/script/gi, "<\\/script");
  return `${INSERTER}(${literal},"${where}");`;
}

export async function CustomHead() {
  const { code } = await getSiteContent();
  const css = code.css.trim();
  const head = code.head.trim();
  if (!css && !head) return null;
  return (
    <>
      {css && <style id="norr3-custom-css" dangerouslySetInnerHTML={{ __html: css }} />}
      {head && <script dangerouslySetInnerHTML={{ __html: inserter(head, "head") }} />}
    </>
  );
}

export async function CustomBodyEnd() {
  const { code } = await getSiteContent();
  const html = code.bodyEnd.trim();
  if (!html) return null;
  return <script dangerouslySetInnerHTML={{ __html: inserter(html, "body") }} />;
}
