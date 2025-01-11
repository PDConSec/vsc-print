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

            const elements = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, table');
            elements.forEach(element => {
                element.addEventListener('dblclick', () => {
                    const text = element.innerText || element.textContent;
                    ws.send(JSON.stringify({ type: 'findInEditor', value: text }));
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