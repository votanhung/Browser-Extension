"use strict";
!function (e) {
    var notify = function (e, n, o) {
            var c, a = "@[" + n + ":]";
            switch (o) {
                case"remove":
                    c = "💀 " + a + " đã bị xóa khỏi nhóm 🧟‍♀";
                    break;
                case"block":
                    c = "☠ " + a + " đã bị chặn khỏi nhóm 🧟‍♂";
                    break;
                default:
                    c = "Không có hành động nào để thực hiện 💥"
            }
            get().then(function (n) {
                var api = "https://graph.facebook.com/v2.11/" + e + "/comments?access_token=" + n, o = new FormData;
                o.append("message", c);
                fetch(api, {method: "POST", body: o})
            })
        },
        get = function () {
            var n = function (n, t) {
                var o = new FormData, c = document.querySelector('[name="fb_dtsg"]');
                o.append("fb_dtsg", c.value), o.append("app_id", "165907476854626"), o.append("redirect_uri", "fbconnect://success"), o.append("display", "page"), o.append("return_format", "access_token"), fetch("https://www.facebook.com/v2.8/dialog/oauth/confirm", {
                    method: "POST",
                    credentials: "include",
                    body: o
                }).then(function (e) {
                    return e.text()
                }).then(function (o) {
                    if (o && o.includes("access_token=")) try {
                        var c = o.match(/access_token=([^&]+)/)[1];
                        e.storage.local.set({c_token: c}), n(c)
                    } catch (e) {
                        get()
                    } else get()
                })
            };
            return new Promise(function (t, o) {
                e.storage.local.get({c_token: ""}, function (e) {
                    if (e.c_token) {
                        var c = e.c_token;
                        fetch("https://graph.facebook.com/v2.11/me?access_token=" + c).then(function (e) {
                            return e.json()
                        }).then(function (e) {
                            e && e.id ? t(c) : n(t, o)
                        }, function () {
                            n(t, o)
                        })
                    } else n(t, o)
                })
            })
        };
    e.runtime.onMessage.addListener(function (t) {
        var o = t.cmd.toLowerCase(), c = t.g, a = t.l, r = t.u;
        if (!c) return void console.log("no group");
        if ("block" === o || "remove" === o) {
            var s = document.querySelector('[name="fb_dtsg"]');
            if (null !== s) {
                var i = new FormData;
                i.append("fb_dtsg", s.value), i.append("confirm", 1), i.append("__user", t.cu), i.append("__a", 1), "block" === o && i.append("ban_user", 1), fetch("https://www.facebook.com/ajax/groups/members/remove.php?group_id=" + c + "&uid=" + r + "&is_undo=0", {
                    method: "POST",
                    credentials: "include",
                    body: i
                }).then(function () {
                    e.runtime.sendMessage({cmd: "GM.admin", user_id: r, type: o}),
                        notify(a, r, o)
                })
            }
        }
    }), e.runtime.sendMessage({cmd: "GM.admin.active"})
}(chrome);