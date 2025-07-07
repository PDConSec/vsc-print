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
      if (typeof SmiDrawer === "function") {
        var svgs = document.querySelectorAll('svg[data-smiles]');
        svgs.forEach(function(svg) {
          var smiles = svg.getAttribute('data-smiles');
          var configJson = svg.getAttribute('data-smiles-config');
          let moleculeOptions;
          let reactionOptions;
          if (configJson) {
            try {
              // decodeURIComponent to match encodeURIComponent in processMarkdown.ts
              var parsedConfig = JSON.parse(decodeURIComponent(configJson));
              moleculeOptions = parsedConfig.moleculeOptions ?? {};
              reactionOptions = parsedConfig.reactionOptions ?? {};
            } catch (e) {
              // ignore, fallback to empty options
            }
          }
          var parent = svg.parentNode;
          var errorDiv = document.createElement('div');
          errorDiv.style.color = 'red';
          errorDiv.style.fontFamily = 'monospace';
          errorDiv.style.background = '#fff0f0';
          errorDiv.style.border = '1px solid #f88';
          errorDiv.style.padding = '0.5em 1em';
          errorDiv.style.margin = '0.5em 0';
          function showError(msg) {
            if (parent) {
              var pre = document.createElement('pre');
              pre.textContent = msg;
              errorDiv.appendChild(pre);
              parent.replaceChild(errorDiv, svg);
            }
          }
          try {
            var drawer = new SmiDrawer(moleculeOptions, reactionOptions);
            SmilesDrawer.parse(smiles, function(tree) {
              drawer.draw(smiles, svg);
            }, function(err) {
              showError('Invalid SMILES: ' + smiles + (err ? '\n' + err : ''));
            });
          } catch (err) {
            showError('Invalid SMILES: ' + smiles + (err ? '\n' + err : ''));
          }
        });
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