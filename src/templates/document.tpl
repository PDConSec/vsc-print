<!DOCTYPE html>
<html>

<head>
    <base href="{{baseUrl}}" />
    <title>{{documentTitle}}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {{{stylesheetLinks}}}
    {{{scriptTags}}}
    <script type="application/javascript">
        function printAndClose(enabled) {
            if (typeof SmiDrawer === "object") {
                SmiDrawer.apply();
            }
            if (enabled) {
                window.addEventListener("afterprint", (event) => {
                    fetch("completed").then(window.close);
                });
                setTimeout(window.print, 500);
            }
        }
        function listenForUpdates() {
            const ws = new WebSocket(`ws://localhost:${window.location.port}`);
            ws.onopen = function () {
                const sessionId = window.location.pathname.split("/")[1];
                ws.send(JSON.stringify({ sessionId: sessionId }));
            };
            ws.onmessage = function (event) {
                const message = JSON.parse(event.data);
                if (message.type === 'refreshPreview') {
                    const scrollOffset = window.scrollY;
                    ws.send(JSON.stringify({ type: 'scrollOffset', value: scrollOffset }));
                    location.reload();
                } else if (message.type === 'restoreScroll') {
                    const setScrollPosition = () => {
                        window.scrollTo(0, message.scrollOffset);
                    };
                    if (document.readyState === 'complete') {
                        setScrollPosition();
                    } else {
                        window.addEventListener('load', setScrollPosition);
                        const images = document.querySelectorAll('img');
                        let loadedImages = 0;
                        images.forEach(img => {
                            if (img.complete) {
                                loadedImages++;
                            } else {
                                img.addEventListener('load', () => {
                                    loadedImages++;
                                    if (loadedImages === images.length) {
                                        setScrollPosition();
                                    }
                                });
                            }
                        });
                    }
                }
            };

            document.querySelectorAll('p:not(div[data-raw] p), li:not(div[data-raw] li), h1:not(div[data-raw] h1), h2:not(div[data-raw] h2), h3:not(div[data-raw] h3), h4:not(div[data-raw] h4), h5:not(div[data-raw] h5), h6:not(div[data-raw] h6), table:not(div[data-raw] table), pre:not(div[data-raw] pre), img:not(div[data-raw] img)')
            .forEach(element => {
                element.addEventListener('dblclick', () => {
                    const text = element.getAttribute('data-raw');
                    ws.send(JSON.stringify({ type: 'findInEditor', value: text }));
                });
            });
            document.querySelectorAll('code:not(div[data-raw] code), td:not(div[data-raw] td), th:not(div[data-raw] th), a:not(div[data-raw] a)')
            .forEach(element => {
                element.addEventListener('dblclick', () => {
                    const p = element.closest('[data-raw]');
                    let text = p.getAttribute('data-raw');
                    ws.send(JSON.stringify({ type: 'findInEditor', value: text }));
                });
            });
            document.querySelectorAll('div[data-raw] p, div[data-raw] li, div[data-raw] h1, div[data-raw] h2, div[data-raw] h3, div[data-raw] h4, div[data-raw] h5, div[data-raw] h6, div[data-raw] table, div[data-raw] pre, div[data-raw] img, div[data-raw] code, div[data-raw] td, div[data-raw] th, div[data-raw] a').forEach(element => {
                element.addEventListener('dblclick', () => {
                    const div = element.closest("[data-raw]");
                    ws.send(JSON.stringify({ type: 'findInEditor', value: btoa(div.innerHTML) }));
                });
            });
        };
    </script>
</head>

<body onload="listenForUpdates();printAndClose({{printAndClose}});">
    {{{documentHeading}}}
    <div>
        {{{content}}}
    </div>
</body>

</html>