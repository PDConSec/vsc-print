# Regexes for parsing resource names

## Resources
https://regex101.com/

### Test HTML
```HTML
<h1 id="vsc-print-1" data-line="0" class="code-line">vsc-print</h1>
<h2 id="issue-21-1" data-line="2" class="code-line">Issue 21</h2>
<p data-line="4" class="code-line">Hallo ich bin Müller Blümchen.
Änderungen sind nicht möglich.</p>
<p data-line="7" class="code-line">Liebe grüsse
Ötzil Meyer</p>
<h2 id="issue-22-1" data-line="10" class="code-line">Issue 22</h2>
<p data-line="12" class="code-line"><img src="x:/path/to/2158834-45134090-2560-1440.jpg" alt="img1" class="loading" id="image-hash--695913206"><br>
<img src="d|/path/to/venom-movie-2018-cd.jpg" alt="img2" class="loading" id="image-hash--931243578">
<img src="https://assets.amuniversal.com/6ad992b0bfb101381a80005056a9545d" alt="img3" class="loading" id="image-hash--1870985651"></p>
```

## Absolute URL
* Starts with `http:` or `https:`

## Handling
None.

## Relative URL

* Does _not_ start with drive letter then colon
* Does _not_ start with `http:` or `https:`

### Expression 
```
/(img src=")(?!http[s]?)(?![a-z]:)([^"]+)/gmi
```

### Handling
Prepend base path then escape colon to `/C/O/L/O/N`

## Explicit file path
* Does _not_ start with drive letter then colon

### Expression
```
/(img src="[a-z]):([^"]*)/gmi
```

### Handling
Escape colon to `/C/O/L/O/N`.
