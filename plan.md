# Baskit Fertigstellungsplan

## Ziel

Baskit soll eine stabile mobile App sein, die Rezepte und Einkaufsliste sinnvoll verbindet:

- Rezepte anlegen, bearbeiten, loeschen und anzeigen
- Zutaten aus Rezepten komplett oder teilweise in die Einkaufsliste uebernehmen
- Einkaufsliste manuell erweitern und bearbeiten
- Zutaten beim Einkauf abhaken
- Herkunft aggregierter Zutaten nachvollziehen
- Basket nach dem Einkauf sauber leeren

## Aktueller Umsetzungsstand

- Phasen 1 bis 6 sind technisch umgesetzt.
- Die Kernlogik fuer Persistenz, Aggregation, Rezeptbearbeitung, partielle Zutatenuebernahme und Navigation ist abgeschlossen.
- Automatisierte Verifikation ist gruen:
  - `yarn verify`
  - `expo install --check`
  - `expo-doctor`
  - `expo config --json`
  - `expo export --platform ios`
  - `expo export --platform android`
- Der lokale Expo-Start auf dem iOS-Simulator wurde erfolgreich bis zum Oeffnen von `exp://127.0.0.1:8088` verifiziert.
- Offen bleiben nur zwei umweltabhaengige Release-Punkte:
  - kompletter manueller Klick-Smoke-Test
  - belastbare EAS-Validierung

## Verifizierter Ist-Stand

### Produkt

- Rezeptliste, Rezeptformular und Rezeptdetail sind grundsaetzlich vorhanden.
- Basket-Screen, Custom-Item-Eingabe und Herkunfts-Modal sind vorhanden.
- Das Sollverhalten ist in `CONCEPT.md` beschrieben.

### Technisch

- Die App basiert jetzt auf Expo SDK 54.
- `package.json` und `yarn.lock` wurden auf einen aktuellen, Expo-kompatiblen Stand gebracht.
- `expo install --check` ist sauber.
- `yarn tsc --noEmit` laeuft durch.
- Die SQLite-Abstraktion wurde auf das aktuelle `expo-sqlite`-API angepasst.
- Der ungueltige SQLite-Befehl `TRUNCATE TABLE` wurde durch `DELETE FROM` ersetzt.

### Aktuelle Luecken

- Rezeptbearbeitung ist im UI sichtbar, aber nicht implementiert.
- "Nur einige Zutaten in den Basket uebernehmen" ist nicht fertig.
- Basket-State und DB-State laufen teilweise auseinander.
- Custom-Items sind funktional nicht so robust wie Rezept-Zutaten.
- Die Navigation ist inkonsistent.
- Es gibt keine brauchbare Testbasis fuer die Kernflows.

## Prioritaeten

### P0 - Muss vor Release fertig sein

1. Basket-State stabilisieren
2. Persistenzmodell und Aggregation haerten
3. Rezeptbearbeitung fertigstellen
4. Partielle Zutatenuebernahme umsetzen
5. Einkaufs-Flow stabil machen

### P1 - Sollte fuer eine gute v1 drin sein

1. Navigation und Informationsarchitektur aufraeumen
2. UI/UX konsolidieren
3. Eingabevalidierung und Fehlerbehandlung verbessern
4. Leere, Lade- und Fehlerzustaende sauber machen

### P2 - Fuer Release-Qualitaet und spaetere Iteration

1. Tests einfuehren
2. Release-Prozess validieren
3. Versionierung und OTA-Strategie festziehen

## Ticketstatus-Mechanik

- `backlog.md` ist die operative Arbeitsliste.
- Jedes Ticket hat genau einen Status: `todo`, `in_progress`, `blocked`, `done`.
- Statuswechsel werden direkt in der Ticketzeile gepflegt.
- Blocker muessen immer kurz in derselben Zeile oder im naechsten Satz benannt werden.
- `plan.md` beschreibt die Phasen und Abhaengigkeiten, `backlog.md` die laufende Bearbeitung.

## Verbindliche Entscheidungen

1. SQLite ist die Single Source of Truth fuer Rezepte und Basket-Daten. UI-State wird nur abgeleitet und nicht mehr direkt mutiert.
2. Die App hat in v1 genau zwei Tabs: `Rezepte` und `Einkaufsliste`. `Home` wird entfernt.
3. `RecipeForm` wird fuer Create und Edit wiederverwendet.
4. Rezept-Zutaten koennen wirklich ausgewaehlt werden. Standard ist: alle Zutaten sind vorgewaehlt.
5. Die Rezeptansicht bekommt zwei klare Aktionen:
   - `Alle hinzufuegen`
   - `Ausgewaehlte hinzufuegen`
6. Basket-Eintraege werden als Rohzeilen persistiert und erst in der UI aggregiert.
7. Aggregation erfolgt in v1 ueber normalisierten `name + unit`-Schluessel. Es gibt keine automatische Einheitenumrechnung.
8. `checked` wird dauerhaft in SQLite gespeichert. Ein Check auf einer aggregierten Listenzeile wirkt auf alle zugrunde liegenden Rohzeilen dieser Aggregatgruppe.
9. `markedAsDeleted` bleibt ein Soft-Delete mit Wiederherstellung.
10. Custom-Items bleiben in derselben Tabelle wie Rezept-Zutaten, aber als gleichwertige Quelle mit eigener Kennzeichnung.
11. Wenn dasselbe Rezept mehrfach hinzugefuegt wird, entsteht jedes Mal eine eigene Source-/Snapshot-Gruppe; die sichtbare Listenansicht bleibt dennoch ueber `name + unit` aggregiert.
12. Beim Loeschen eines Rezepts bleiben bestehende Basket-Eintraege erhalten. Die Herkunft wird ueber Snapshot-Daten im Basket gesichert und als gespeicherter Rezepttitel mit Kennzeichnung `geloescht` angezeigt.
13. Bilder werden in v1 lokal als URI gespeichert. Cloud-Sync oder Remote-URLs sind kein Bestandteil dieser Version.
14. Es wird eine echte DB-Migrationsstrategie mit `PRAGMA user_version` eingefuehrt. Ein stiller Datenwipe ist fuer Updates nicht akzeptabel.
15. Release-Gates fuer v1 sind:
    - `yarn tsc --noEmit`
    - automatisierte Tests fuer Kernlogik
    - dokumentierter manueller Smoke-Test
    - erfolgreicher EAS-Produktionsbuild

## Umsetzungsphasen

## Phase 1 - Fundament stabilisieren

### Ziel

Die App muss technisch konsistent werden, bevor weitere Features darauf gebaut werden.

### Arbeitspakete

1. `BasketItemsContextProvider` auf immutable Updates umbauen.
2. Direkte Objekt- und Array-Mutationen entfernen.
3. DB-Operationen und UI-Refresh eindeutig koppeln.
4. Custom-Items genauso behandeln wie normale Basket-Items.
5. Basket-Leeren, Delete, Restore und Check-off gegen echte DB-Daten pruefen.

### Akzeptanzkriterien

- Nach App-Neustart stimmt der Basket mit der DB ueberein.
- Abhaken, Loeschen und Wiederherstellen sind reproduzierbar korrekt.
- Keine stillen State-Fehler durch direkte Mutation mehr.

## Phase 2 - Datenmodell und Basket-Logik saubern

### Ziel

Aggregierte Anzeige und persistierte Rohdaten muessen sauber getrennt sein.

### Arbeitspakete

1. Basket intern als Quell-Eintraege pro Rezept bzw. Custom-Quelle modellieren.
2. Aggregierte Anzeige als abgeleitete View-Logik bauen.
3. Herkunft einzelner Mengen im Modal robust aus den Rohdaten ableiten.
4. Einheitenkonflikte explizit behandeln.
5. `checked` und `markedAsDeleted` klar pro Quell-Eintrag definieren.

### Akzeptanzkriterien

- "2 Paprika" kann korrekt auf mehrere Rezepte zurueckgefuehrt werden.
- Unterschiedliche Einheiten werden nicht falsch zusammenaddiert.
- Aggregation veraendert keine Originaldaten.

## Phase 3 - Rezeptverwaltung vollstaendig machen

### Ziel

Rezepte muessen vollstaendig erstellt, bearbeitet, angezeigt und geloescht werden koennen.

### Arbeitspakete

1. Edit-Flow aus `RecipeModal` an echtes Bearbeitungsformular anbinden.
2. `RecipeForm` fuer Create und Edit vereinheitlichen.
3. Vorbelegung fuer Titel, Bild, Beschreibung, Zutaten und Schritte einbauen.
4. Update-Query fuer Rezepte ergaenzen.
5. Loeschverhalten pruefen, wenn Rezept-Zutaten bereits im Basket liegen.

### Akzeptanzkriterien

- Ein bestehendes Rezept kann ohne Datenverlust bearbeitet werden.
- Nach dem Speichern erscheint der aktualisierte Stand sofort in Liste und Detail.
- Loeschen hinterlaesst keinen inkonsistenten App-Zustand.

## Phase 4 - Zutatenuebernahme fertigstellen

### Ziel

Der Kernnutzen der App ist die Uebernahme von Zutaten aus Rezepten in den Basket.

### Arbeitspakete

1. Checkboxen in der Rezeptansicht funktional machen.
2. Zwei Aktionen anbieten:
   - alle Zutaten hinzufuegen
   - nur markierte Zutaten hinzufuegen
3. Bereits vorhandene Basket-Eintraege sauber mit neuen Quell-Eintraegen zusammenfuehren.
4. Teiluebernahme auch bei spaeterem erneuten Hinzufuegen sauber behandeln.
5. UI rueckmelden lassen, was erfolgreich uebernommen wurde.

### Akzeptanzkriterien

- Der Nutzer kann einzelne Zutaten auswaehlen und nur diese uebernehmen.
- Mehrfaches Hinzufuegen fuehrt nicht zu inkonsistentem Ursprung.
- Die Herkunft bleibt im Basket nachvollziehbar.

## Phase 5 - Einkaufsmodus verlaesslich machen

### Ziel

Die Einkaufsliste muss waehrend des Einkaufs schnell, robust und gut lesbar sein.

### Arbeitspakete

1. Offene, erledigte und geloeschte Eintraege klar trennen.
2. Checked-Status dauerhaft persistieren.
3. Long-Press-/Detail-Interaktionen vereinfachen.
4. Custom-Items im gleichen Interaktionsmodell fuehren.
5. "Basket leeren" als finalen Abschluss sauber absichern.

### Akzeptanzkriterien

- Abgehakte Eintraege bleiben auch nach Neustart abgehakt.
- Geloeschte Eintraege koennen nachvollziehbar wiederhergestellt werden.
- Der Basket kann am Ende komplett geleert werden.

## Phase 6 - Navigation und UX konsolidieren

### Ziel

Die App soll wie ein zusammenhaengendes Produkt wirken, nicht wie ein Prototyp.

### Arbeitspakete

1. Ungenutzte `home`-Route entfernen oder bewusst integrieren.
2. Tabs fachlich korrekt benennen.
3. Wiederverwendbare Farben, Abstaende und Typografie in ein kleines Theme heben.
4. Inline-Styles an zentralen Stellen reduzieren.
5. Empty-, Loading- und Error-States ergaenzen.
6. Touch Targets, Scroll-Verhalten und Lesbarkeit auf Mobilgeraeten pruefen.

### Akzeptanzkriterien

- Die Navigation ist fachlich eindeutig.
- Modals, Listen und Formulare wirken konsistent.
- Es gibt keine "toten" Screens oder halbfertigen Buttons mehr.

## Phase 7 - Validierung und Tests

### Ziel

Kernflows muessen gegen Regressionen abgesichert werden.

### Arbeitspakete

1. Unit-Tests fuer Aggregation und Hilfsfunktionen einfuehren.
2. Hook- oder Integrations-Tests fuer DB-Zugriffe ergaenzen.
3. Smoke-Tests fuer Kernflows definieren:
   - Rezept anlegen
   - Rezept bearbeiten
   - einige Zutaten hinzufuegen
   - alle Zutaten hinzufuegen
   - Custom-Item hinzufuegen
   - Item abhaken
   - Item loeschen/wiederherstellen
   - Basket leeren
4. Release-Build auf Geraet oder Simulator pruefen.

### Akzeptanzkriterien

- Kernlogik ist automatisiert abgedeckt.
- Die wichtigsten Nutzerfluesse sind manuell einmal sauber durchgetestet.
- Test-Skripte sind in `package.json` vorhanden und lokal ausfuehrbar.

## Phase 8 - Release vorbereiten

### Ziel

Die App soll als erste belastbare Version baubar und auslieferbar sein.

### Arbeitspakete

1. EAS-Build fuer Android und iOS validieren.
2. App-Version, Build-Nummern und Runtime-Version bewusst setzen.
3. OTA-Strategie fuer spaetere Bugfixes dokumentieren.
4. Assets, Splash, Icon und Store-Metadaten pruefen.
5. Datenschutz- und Berechtigungsbedarf fuer Bildauswahl pruefen.

### Akzeptanzkriterien

- Release-Build laeuft ohne offensichtliche Funktionsbrueche.
- Versionierung und Update-Strategie sind nachvollziehbar dokumentiert.
- Upgrade von bestehender lokaler DB auf den neuen Stand fuehrt nicht zu Datenverlust.

## Konkrete Reihenfolge fuer die naechsten Arbeitsschritte

1. `E6-T1` und `E6-T2` parallelisieren, weil Tooling und erste Tests die restliche Arbeit absichern.
2. Danach die Release-Gates in `E6-T3` und `E6-T4` schliessen.
3. Anschliessend die produktiven Epics in der Reihenfolge `E1` -> `E2` -> `E3` -> `E4` -> `E5` abarbeiten.
4. Nach jedem abgeschlossenen Ticket den Status in `backlog.md` aktualisieren.

1. BasketContext und Persistenz entkoppeln und stabilisieren.
2. Rezeptbearbeitung fertigstellen.
3. Partielle Zutatenuebernahme implementieren.
4. Einkaufsmodus mit persistiertem Checked-State haerten.
5. Navigation und UI konsolidieren.
6. Tests und Release-Pruefung aufsetzen.

## Bekannte Risiken

- Der Basket ist die kritischste Komponente; dort fuehren kleine Datenmodellfehler sofort zu UX-Fehlern.
- Das aktuelle DB-Schema ist funktional, aber nicht besonders sauber modelliert.
- Die App hat aktuell keine Testschutzschicht gegen Regressionen.
- Bilder und spaetere Datenmigrationen koennen zusaetzliche Randfaelle erzeugen.

## Empfehlung

Nicht parallel an UI-Schoenheit und Basket-Logik arbeiten. Erst Phase 1 bis 5 sauber schliessen, danach UX, Tests und Release-Haertung.
