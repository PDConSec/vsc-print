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
        const svgs = document.querySelectorAll('svg[data-smiles]');
        svgs.forEach(function(svg) {
          var smiles = svg.getAttribute('data-smiles');
          const configJson = svg.getAttribute('data-smiles-config');
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

      document.querySelectorAll('[data-source-map]')
        .forEach(element => {
          element.addEventListener('click', () => document.querySelector('.xref-highlight')?.classList.remove('xref-highlight'));
          element.addEventListener('dblclick', () => {
            const text = element.getAttribute('data-source-map');
            ws.send(JSON.stringify({ type: 'findInEditor', value: text }));
            element.classList.add('xref-highlight');
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