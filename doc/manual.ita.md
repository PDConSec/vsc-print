# Usare l'estensione Stampa

Versione italiana a cura di sipronunciaaigor

[ENGLISH](manual.eng.md) | [FRANCAISE](mania.fra.md) | [DEUTSCH](manual.deu.md) | [ESPAGNOLE](manual.esp.md) | [中文CHINESE](manual.zho.md) | [ITALIANO](manual.ita.md) | [Aggiungere una lingua (mauale inglese)](how-to-add-a-language.md)

# Sommario

1. [Uso generale](#uso-generale)
2. [Personalizzazione della configurazione](#personalizzazione-della-configurazione)
3. [Markdown](#markdown)
4. [Estensioni Markdown e spazi di lavoro remoti](#estensioni-markdown-e-spazi-di-lavoro-remoti)
5. [Risoluzione dei problemi](#risoluzione-dei-problemi)

# Uso generale

È possibile stampare in svariati modi.

* È possibile stampare il documento attivo, tramite icona o menu contestuale.
* È possibile stampare una selezione dal documento attivo, tramite icona o menu contestuale.
* È possibile stampare un file direttamente dal pannello di esplorazione dei file tramite il menu contestuale, senza aver aperto il file in precedenza.
* È possibile stampare tutti i file presenti in una cartella, con rispetto delle liste di esclusione.

I documenti Markdown possono essere renderizzati e vi si possono applicare stili. Per maggiori informazioni, consultare la sezione Markdown.

## Stampa del documento attivo

Per stampare il documento attivo è sufficiente fare clic sull'icona della stampante a destra delle schede dei documenti. Assicurarsi di non avere più righe di testo selezionate. In caso contrario, verrà stampata la selezione e non l'intero documento. **I settaggi delle dimensioni della carta, dei margini e dell'orientamento della pagina si trova nella finestra di dialogo di stampa.**

## Stampare una selezione nel documento attivo

Selezionare un blocco di testo a più righe nel documento attivo. Fare quindi clic sull'icona della stampante a destra delle schede del documento oppure fare clic con il pulsante destro del mouse sulla selezione e scegliere `Stampa`  dal menu contestuale. Quando appare il menu contestuale, `Stampa` appare in alto (o vicino), in basso o in nessun punto, a seconda dell'impostazione `Stampa: Posizione del menu contestuale dell'editor`.

I numeri di riga nella stampa sono allineati con i numeri di riga nell'editor, indipendentemente dal fatto che siano visibili o meno. Ad esempio, se si sta discutendo della riga di codice 1145 in una revisione del codice e si apre il file per modificarlo, premendo `Ctrl+G` e poi 1145 `[Invio]` il cursore si posizionerà direttamente sulla riga di codice in questione.

## Stampare un file senza aprirlo

Per stampare un file diverso dal documento attivo, individuarlo nel riquadro EXPLORER e fare clic con il tasto destro del mouse. Nel menu contestuale del file, `Stampa` appare sempre in cima al menu o vicino ad esso. In questo modo si stampa l'intero file.

## Stampa di tutti i file di una cartella

Se si preme `F1` e si digita `stampa cartella`, è possibile stampare tutti i file stampabili presenti nella cartella che contiene il documento attivo. Viene creato un unico processo di stampa con tutti i file separati da intestazioni che ne indicano il nome.



# Personalizzazione della configurazione

La maggior parte di queste impostazioni personalizza l'esperienza dell'utente (icona, posizione del menu, ecc.). Per trovare queste impostazioni, aprire il pannello delle impostazioni di VS Code e navigate fino a Estensioni/Stampa o cercate semplicemente "stampa". Se la versione di VS Code in uso è in inglese, cercare "printing".

Ecco un elenco dei nomi delle impostazioni disponibili, così come appaiono nel file di configurazione.

* `print.alternateBrowser` : abilita/disabilita un browser alternativo
* `print.browserPath` : il percorso ad un browser web
* `print.colourScheme` : il foglio di stile utilizzato per la colorazione della sintassi
* `print.editorContextMenuItemPosition` : posizione della voce `Stampa` nel menù contestuale
* `print.editorTitleMenuButton` :  mostra il pulsante di stampa nel menu del titolo dell'editor
* `print.fontSize` : dimensione del carattere (da 6 a 13 pt)
* `print.formatMarkdown` : renderizza in fase di stampa il Markdown come HTML con stili applicati
* `print.lineNumbers` : on, off o ereditato (dall'editor)
* `print.lineSpacing` : interlinea singola, interlinea e mezza o interlinea doppia
* `print.printAndClose` : dopo la stampa, chiudere il browser
* `print.folder.include`: modello per le liste di inclusione dei file. Vuoto corrisponde a tutto
* `print.folder.exclude`: modello per le liste di esclusione
* `print.folder.maxFiles`: numero massimo di file per i quali viene visualizzato il contenuto quando si stampa una cartella
* `print.folder.maxLines`: i file che contengono più righe di questa soglia vengono ignorati
* `print.logLevel`: controlla il livello di dettaglio del file di log

## Personalizzazione dell'interfaccia utente

È possibile controllare se l'icona di stampa appare nella barra degli strumenti quando si mette a fuoco un riquadro dell'editor. Questa impostazione è denominata `Pulsante del menù del titolo dell'editor`.

È possibile controllare se la voce di menu "Stampa" appare in alto, in basso o non compare in nessun punto dei menu contestuali utilizzando l'impostazione `Posizione voce menu contestuale editor`.

Quando l'impostazione `Stampa e chiudi` è selezionata, la stampa aprirà automaticamente la finestra di dialogo Stampa del browser e chiuderà automaticamente il browser dopo la stampa o l'annullamento. Se si disattiva questa opzione, il browser si aprirà con il documento renderizzato pronto per essere esaminato. Se si apre manualmente la finestra di dialogo Stampa, la stampa o l'annullamento non chiudono il browser.

## Utilizzo di un browser specifico per la stampa

Per impostazione predefinita, la stampa utilizza il browser predefinito. Tuttavia, la stampa funziona meglio con un browser derivato da Chromium e potrebbe non essere possibile o desiderabile cambiare il browser predefinito.

Per consentire la stampa con un browser diverso da quello predefinito, è possibile specificare il percorso di un browser alternativo e c'è anche una casella di controllo che consente di attivarlo e disattivarlo senza perderne il percorso.

Queste impostazioni sono denominate rispettivamente `Percorso del browser` e `Browser alternativo`.

Il percorso del browser alternativo è virgolettato automaticamente su Windows, mentre sulle piattaforme Unix gli spazi vengono eliminati. Purtroppo questo è incompatibile con la fornitura di opzioni da riga di comando.

Se è necessario fornire opzioni da riga di comando, creare un file batch (o un file di script bash) che specifichi le opzioni e fare riferimento al file di script bash nel percorso del browser alternativo.

## Stampa del codice sorgente

Utilizzando l'impostazione `Schema colore` sè possibile specificare lo schema di colori utilizzato per la colorazione della sintassi. La scelta è limitata a temi chiari perché le stampanti utilizzano carta bianca. 

Se si stampa il documento attivo e c'è una selezione su più righe, viene stampata solo la selezione.

### Tipo di carattere e dimensione

Il carattere è determinato dalle impostazioni dell'editor VS Code. Se si vede il carattere Fira Code sullo schermo, è quello che verrà stampato. 

La _dimensione_ del testo stampato è un'impostazione di Stampa, perché la dimensione ottimale sullo schermo potrebbe non essere la migliore sulla carta. 

## Stampa di Markdown

Probabilmente si desidera che i lavori di stampa di Markdown siano renderizzati e che vengano applicati gli stili, difatti questo è il comportamento predefinito. Se si desidera stampare Markdown come codice sorgente, è possibile deselezionare l'impostazione `Stampa: Renderizza Markdown`.

### Schema di colore

Per la stampa del codice sorgente, i fogli di stile sono raggruppati e possono essere scelti per nome da un elenco. La scelta è limitata ai fogli di stile chiari perché la carta della stampante è bianca e gli inchiostri e i toner della stampante sono progettati per la carta bianca. 

# Markdown

## Stili e markdown

### Applicare file CSS a un documento Markdown 

* È possibile incorporare un tag di collegamento al foglio di stile direttamente nel Markdown. Questo è specifico per il documento.  
* Esiste un'impostazione chiamata `markdown.styles`. Si tratta di un elenco di URL. Sia l'anteprima di Markdown che la stampa onoreranno questo elenco. È possibile utilizzare URL assoluti, URL relativi allo spazio di lavoro o URL relativi al documento, come mostrato nell'esempio seguente.

```json
"markdown.styles": [
	"https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css",
	"path/to/document/relative/custom.css",
	"workspace.resource/path/to/stylesheet.css"
]
```

Gli URL relativi allo spazio di lavoro sono il modo migliore per condividere le risorse tra i documenti. Si trovano nello spazio di lavoro, quindi possono essere controllati alla fonte insieme ai documenti, e poiché l'URL è relativo allo spazio di lavoro anziché al documento, è possibile organizzare (e riorganizzare) i documenti in cartelle senza interrompere gli URL. Si noti che questo vale non solo per i fogli di stile, ma anche per le risorse di file immagine.

### Associare uno stile a Markdown

La mappatura da Markdown all'HTML generato è ovvia. Le tabelle diventano elementi `table`, `th` e `td`. I titoli sono da `H1` a `H9`. I paragrafi sono elementi `P`, i punti e i numeri sono elementi `ul` e `ol`elements. 


Non dimenticate che potete incorporare l'HTML in Markdown, quindi non c'è nulla che vi impedisca di usare `div` o `span` per applicare una classe CSS a un blocco o a una riga di Markdown.

## Server Web

Il server web incorporato si lega solo all'indirizzo di loopback e accetta solo le connessioni specificate.

## Estensioni di Markdown Katex

Katex dipende da CSS e font provenienti dal Web. Per far funzionare la stampa è necessario aggiungere il foglio di stile richiesto alle impostazioni. Se si nota che uno o due elementi funzionano nell'anteprima, ma non nella stampa, determinare la versione corrente dal sito web di KaTeX e aggiornare l'URL. 

```json
"markdown.styles": [
	"https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"
]
```
Per eliminare le dipendenze, importate le risorse Katex nel vostro progetto come descritto nella sezione precedente e usate un riferimento relativo allo spazio di lavoro. 

Di seguito un paio di esempi per verificare la configurazione.
```
$$
\begin{alignedat}{2}
   10&x+ &3&y = 2 \\
   3&x+&13&y = 4
\end{alignedat}
$$
and thus

$$
x = \begin{cases}
   a &\text{if } b \\
   c &\text{if } d
\end{cases}
$$
```

## Markdown renderizzato e spazi di lavoro remoti

Per lavorare con gli spazi di lavoro remoti, un'estensione Markdown deve essere eseguita sull'host remoto, perché è lì che viene eseguita la pipeline di rendering di Markdown. Le estensioni come Stampa, progettate per l'uso con gli spazi di lavoro remoti, possono essere distribuite sull'host remoto con un solo clic. La maggior parte delle estensioni di Markdown è in grado di funzionare in questo modo, ma non è predisposta per questo.

Purtroppo, le estensioni di Markdown non sono normalmente configurate per l'uso remoto; i progettisti si aspettavano che venissero eseguite localmente. 

### Patching fai-da-te delle estensioni di Markdown

Se si necessita assolutamente della funzionalità, è possibile applicare una patch alle estensioni da sé.

1. Trovare dove sono installate le estensioni sulla vostra postazione di lavoro in `~/.vscode/extensions` (su Windows sostituite `%userprofile%` con `~`)
2. Modificare i file `package.json` per le estensioni Markdown che si desidera utilizzare sugli host remoti. Aggiungere l'`extensionKind` come attributo a livello di root. 
3. Una volta modificate tutte le estensioni Markdown, riavviare VS Code.
4. Installare l'estensione sull'host remoto e applicare la patch all'estensione sull'host remoto nello stesso modo.

```json
...
"extensionKind": [
  "workspace"
],
...
```

Le patch di questo tipo andranno perse al prossimo aggiornamento di un'estensione, quindi se la patch ha avuto successo si può inviare una PR all'editore.

# Risoluzione dei problemi

## Prerequisiti

* Per prima cosa assicuratevi di poter stampare una pagina web dal vostro browser.
* Per stampare da uno spazio di lavoro remoto ospitato su Linux, è necessario che `xdg-open` sia installato sull'host remoto. Ubuntu desktop è pronto all'uso.
* Firefox _non_ è la scelta ideale, ma se lo preferite come browser predefinito, sarete lieti di sapere che potete configurare la stampa per utilizzare un browser non predefinito: potete avere entrambe le cose.
* L'utente che esegue VS Code deve essere in grado di stabilire un socket di ascolto.

## Problemi al primo avvio
* Sembra che non succeda nulla &mdash; riavviate VS Code.
* Il browser si avvia ma non carica alcuna pagina &mdash; controllate i permessi di rete.
* Il browser mostra un messaggio di errore relativo all'impossibilità di trovare un file CSS &mdash; avete installato da un VSIX che non è stato preparato da noi. Procuratevi il [pacchetto ufficiale](https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print) e riprovate.

Se c'è qualcos'altro che non va o se avete un'idea di miglioramento, vi invitiamo a segnalare un problema sul repository GitHub.

## Scelta del browser

Il browser utilizzato determina la vostra esperienza d'uso.

### Consigliato per la stampa

Per ottenere i migliori risultati di stampa, installare un browser basato su Chromium. Se non si desidera utilizzare questo browser come predefinito, è possibile sfruttare le impostazioni dei browser alternativi. 

I seguenti sono ritenuti affidabili.
* Brave
* Chromium
* Chrome
* Edge

### NON consigliato per la stampa

* Firefox stampa abbastanza bene ma non chiude il browser. 
* Edge Classic non è più supportato.
* Internet Explorer non è supportato.

## Estensioni Markdown e supporto remoto

Per utilizzare Stampa con un host remoto, è necessario installarlo **sull'host remoto**. 

Per ottenere i vantaggi di un'estensione Markdown quando si stampa un documento da un host remoto, l'estensione Markdown deve essere copmilata con un valore `workspace` per il nodo `extensionKind` _e_ deve essere installata sull'host remoto. 

La maggior parte di queste estensioni non sono pensate per `workspace`. Si può ovviare banalmente modificando `package.json` con cui vengono distribuite. Sfortunatamente questa patch manuale rischia di andare persa ogni volta che l'estensione viene aggiornata, per cui si dovrebbe comunicare il problema all'autore delle estensioni da patchare.

## Browser alternativo

Non è possibile fornire opzioni da riga di comando nel percorso del browser alternativo. Su Windows, il percorso viene automaticamente messo tra virgolette in caso di spazi nei nomi di file o cartelle. Su altre piattaforme, gli spazi vengono evasi automaticamente.

Sia le virgolette che l'evasione degli spazi sono incompatibili con l'uso delle opzioni della riga di comando. La soluzione è creare un file batch (o uno script di shell) che avvii il browser con opzioni da riga di comando e fornire il percorso del file batch (o dello script di shell).

### Chrome e i plugin

Chrome può conservare le scelte della stampante, del formato carta e dei margini tra i lavori di stampa. Alcune opzioni della riga di comando di Chrome causano la segnalazione di errori, anche se la stampa riesce. 

Alcuni plugin di Chrome interferiscono con lo stile dei lavori di stampa. Sebbene sia possibile sopprimere i plugin con `--disable-plugins`, ciò non funziona quando è già presente un'istanza di Chrome in esecuzione. L'opzione `--incognito` sopprime i plugin quando c'è un'istanza in esecuzione, ma può comportare problemi.

## Segnalazione di un problema

Se _ancora_ non riuscite a far funzionare Stampa, [segnalate un problema sul repository](https://github.com/PDConSec/vsc-print/issues). Cercheremo di aiutarvi.

Potremmo chiedervi di aumentare il livello di log, di riprodurre il problema e di inviarci il log.

### Logging

Impostate il livello di log con l'impostazione `Stampa: Livello di log`. L'impostazione predefinita è `error` (livello minimo), ma si può alzare il livello fino a `debug`, che è molto dettagliato, o anche `silly`, che registra persino le chiamate al garbage collector.
