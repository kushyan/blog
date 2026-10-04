// ============================================================
//  Decap CMS 的 GitHub OAuth 代理（Cloudflare Worker）
//  作用：Decap CMS 需要服务端完成 GitHub 授权，本脚本免费托管在
//        Cloudflare Workers 上，负责「登录 → 换取访问令牌」这一环。
//
//  部署步骤（全程网页操作，无需命令行）：
//  1. 在 Cloudflare 新建 Worker：
//     https://dash.cloudflare.com  →  Workers & Pages  →  Create  →  Create Worker
//       - 删掉默认代码，粘贴本文件全部内容，点 Deploy。
//       - 记下你的 worker 域名，形如 https://xxxx.your-subdomain.workers.dev
//
//  2. 在 GitHub 新建 OAuth App：
//     https://github.com/settings/developers  →  New OAuth App
//       - Application name:   我的博客后台
//       - Homepage URL:       https://kushyan.github.io/blog/
//       - Authorization callback URL:  https://xxxx.your-subdomain.workers.dev/callback
//     创建后会得到 Client ID 和 Client Secret（点 Generate a new client secret）。
//
//  3. 给 Worker 添加两个密钥（Settings → Variables and Secrets → Add secret）：
//       - 名称 GITHUB_CLIENT_ID      值：第 2 步的 Client ID
//       - 名称 GITHUB_CLIENT_SECRET  值：第 2 步的 Client Secret
//
//  4. 回到博客的 static/admin/config.yml，把 backend.base_url 改成
//     https://xxxx.your-subdomain.workers.dev（不带路径，不带末尾斜杠）。
//
//  完成。访问 https://kushyan.github.io/blog/admin/ 点“Login with GitHub”即可。
// ============================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const clientId = env.GITHUB_CLIENT_ID;
    const clientSecret = env.GITHUB_CLIENT_SECRET;

    const GH_AUTHORIZE = "https://github.com/login/oauth/authorize";
    const GH_TOKEN = "https://github.com/login/oauth/access_token";

    // 第 1 步：Decap 打开 /auth，这里重定向到 GitHub 授权页
    if (url.pathname === "/auth") {
      const q = new URLSearchParams({
        client_id: clientId,
        redirect_uri: url.origin + "/callback",
        // repo = 完整读写权限（含私有仓库）；若仓库公开，可改成 public_repo
        scope: "repo,user",
      });
      const state = url.searchParams.get("state");
      if (state) q.set("state", state);
      return Response.redirect(GH_AUTHORIZE + "?" + q.toString(), 302);
    }

    // 第 2 步：GitHub 授权后回调 /callback?code=xxx，用 code 换 token
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("缺少 code 参数", { status: 400 });

      const resp = await fetch(GH_TOKEN, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        }),
      });
      const data = await resp.json();

      if (data.error) {
        return new Response(JSON.stringify(data), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 第 3 步：通过 postMessage 把 token 交给 Decap 父窗口
      const payload = JSON.stringify({
        token: data.access_token,
        provider: "github",
      });

      const html = `<!doctype html><html><head><meta charset="utf-8"><title>登录成功</title></head><body>
        <script>
        (function () {
          function receiveMessage(e) {
            window.opener.postMessage(
              "authorization:github:success:" + ${JSON.stringify(payload)},
              e.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })();
        </script>
      </body></html>`;

      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (url.pathname === "/") {
      return new Response("Decap CMS OAuth 代理运行中", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
