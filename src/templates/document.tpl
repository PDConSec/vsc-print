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
          debugger;
            const ws = new WebSocket(`ws://localhost:${window.location.port}`);
            ws.onopen = function () {
                const sessionId = window.location.pathname.split("/")[1];
                ws.send(JSON.stringify({ sessionId: sessionId }));
            };
            ws.onmessage = function (event) {
                const message = JSON.parse(event.data);
                debugger;
                if (message.type === 'refreshPreview') {
                    location.reload();
                }
            };
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