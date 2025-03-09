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
    };
  </script>
</head>

<body onload="listenForUpdates();printAndClose({{printAndClose}})">
  <h2>{{documentHeading}}</h2>
  {{{summary}}}
  {{#each items}}
  {{#if @last}}
  <div>{{{this}}}</div>
  {{else}}
  <div class="page-break-control">{{{this}}}</div>
  {{/if}}
  {{/each}}
</body>

</html>