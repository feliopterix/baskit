# Baskit Backlog

Status-Legende:

- `todo`
- `in_progress`
- `blocked`
- `done`

Ticketstatus-Mechanik:

- `backlog.md` ist die einzige Quelle fuer Ticketstatus.
- Der Status wird direkt in der Ticketzeile gepflegt.
- Wenn ein Ticket blockiert ist, steht die Ursache kurz in Klammern oder nach einem Gedankenstrich in derselben Zeile.
- Abgeschlossene Tickets werden auf `done` gesetzt und mit `[x]` markiert.

## Verbindliche Scope-Entscheidungen

- Zwei Tabs in v1: `Rezepte` und `Einkaufsliste`
- `Home` wird entfernt
- `RecipeForm` deckt Create und Edit ab
- Rezept-Zutaten sind wirklich selektierbar
- Aggregation in v1 ueber `name + unit`, ohne Einheitenumrechnung
- `checked` und `markedAsDeleted` werden dauerhaft in SQLite gespeichert
- Custom-Items bleiben in derselben Tabelle wie Rezept-Zutaten
- Mehrfaches Hinzufuegen eines Rezepts erzeugt getrennte Source-/Snapshot-Gruppen; sichtbare Listenzeilen bleiben aggregiert
- Rezept-Loeschung entfernt keine bereits im Basket gespeicherten Snapshot-Eintraege; Herkunft wird als gespeicherter Rezepttitel mit Kennzeichnung `geloescht` angezeigt
- DB-Migration mit `PRAGMA user_version` ist Pflicht
- Release-Gates: Typecheck, Tests, Smoke-Test und erfolgreicher EAS-Produktionsbuild

## Aktueller Status

- Implementierungsarbeit fuer `E1` bis `E5` ist abgeschlossen.
- `E6-T1` und `E6-T3` sind abgeschlossen.
- `E6-T2` bleibt blockiert, weil in dieser Terminal-Umgebung keine echte UI-Interaktion fuer den kompletten manuellen Klickpfad automatisiert verfuegbar ist. Der iOS-Simulator-Start wurde verifiziert.
- `E6-T4` bleibt blockiert, weil `eas-cli` hier nicht belastbar durchlief. Expo-Doctor, Expo-Config und Produktions-Bundles fuer iOS und Android sind jedoch erfolgreich validiert.

## Epic E1 - Datenmodell und Persistenz haerten

Ziel: Basket- und Rezeptdaten muessen robust, nachvollziehbar und dauerhaft konsistent sein.

### Tickets

- [x] `E1-T1` `done` SQLite-Zugriffe vereinheitlichen und gegen den aktuellen `expo-sqlite`-Stand absichern
- [x] `E1-T2` `done` DB-Migration mit `PRAGMA user_version` einfuehren und bestehende lokale Daten migrieren
- [x] `E1-T3` `done` Basket-Persistenzmodell fuer Rezept-Zutaten, Custom-Items, checked, markedAsDeleted und Source-Snapshots schliessen
- [x] `E1-T4` `done` Aggregationslogik von persistierten Quell-Eintraegen trennen
- [x] `E1-T5` `done` Clear-, Delete- und Restore-Flows auf echte DB-Synchronitaet umstellen
- [x] `E1-T6` `done` Migrations- und Kompatibilitaetsverhalten fuer bestehende lokale Daten pruefen

## Epic E2 - Basket-Kernlogik fertigstellen

Ziel: Die Einkaufsliste muss im Alltag stabil benutzbar sein.

### Tickets

- [x] `E2-T1` `done` `BasketItemsContextProvider` auf immutable Updates und belastbare Refresh-Logik umbauen
- [x] `E2-T2` `done` Custom-Items funktional auf denselben Standard wie Rezept-Zutaten bringen
- [x] `E2-T3` `done` Checked-State dauerhaft speichern und in UI korrekt sortieren
- [x] `E2-T4` `done` Herkunfts-Modal fuer aggregierte Zutaten robust machen
- [x] `E2-T5` `done` Basket-Leeren, Delete und Restore UX und Logik abschliessen

## Epic E3 - Rezeptverwaltung fertigstellen

Ziel: Rezepte muessen vollstaendig erstellt, bearbeitet, angezeigt und geloescht werden koennen.

### Tickets

- [x] `E3-T1` `done` Rezept-Create-Flow validieren und Eingabegrenzen verbessern
- [x] `E3-T2` `done` echten Edit-Flow fuer Rezepte implementieren
- [x] `E3-T3` `done` Delete-Verhalten fuer Rezepte inklusive Basket-Abhaengigkeiten festlegen und umsetzen
- [x] `E3-T4` `done` Rezeptdetail-Ansicht und Ingredient-Darstellung funktional und konsistent machen

## Epic E4 - Zutatenuebernahme aus Rezepten abschliessen

Ziel: Der wichtigste Produktflow ist die Uebernahme von Rezeptzutaten in den Basket.

### Tickets

- [x] `E4-T1` `done` Auswahl einzelner Zutaten in der Rezeptansicht funktional machen
- [x] `E4-T2` `done` "Alle hinzufuegen" und "Nur markierte hinzufuegen" sauber modellieren
- [x] `E4-T3` `done` Mehrfaches Hinzufuegen und Mengenaggregation ohne Herkunftsverlust behandeln
- [x] `E4-T4` `done` Nutzerfeedback fuer erfolgreich uebernommene Zutaten ergaenzen

## Epic E5 - Navigation, UX und visuelle Konsistenz

Ziel: Die App soll sich wie ein sauberes Produkt anfuehlen, nicht wie ein unfertiger Prototyp.

### Tickets

- [x] `E5-T1` `done` Navigation und Tab-Struktur aufraeumen
- [x] `E5-T2` `done` zentrales Theme fuer Farben, Typografie und Oberflaechen einfuehren
- [x] `E5-T3` `done` Listen, Modals und Formulare visuell konsolidieren
- [x] `E5-T4` `done` Empty-, Loading- und Error-States sauber gestalten
- [x] `E5-T5` `done` Mobile Usability, Touch Targets und Scroll-Verhalten absichern

## Epic E6 - Validierung, Tests und Release-Reife

Ziel: Die App soll nicht nur laufen, sondern belastbar auslieferbar sein.

### Tickets

- [x] `E6-T1` `done` Unit- und Integrations-Tests fuer Kernlogik und DB-nahe Funktionen aufsetzen
- [ ] `E6-T2` `blocked` Smoke-Test-Matrix fuer Kernflows definieren und manuell abarbeiten - Matrix dokumentiert, App-Start auf iOS-Simulator verifiziert, vollstaendige manuelle UI-Interaktion hier nicht automatisierbar
- [x] `E6-T3` `done` Build-, Versions- und OTA-Strategie dokumentieren und pruefen
- [ ] `E6-T4` `blocked` Android- und iOS-Release-Pfade mit EAS validieren - `expo-doctor`, `expo config` und `expo export` fuer iOS/Android sind gruen, `eas-cli` lief hier nicht belastbar durch

## Geplante Parallelisierung

- Worker 1: `E1`, `E2`
- Worker 2: `E3`, `E4`
- Worker 3: `E5`
- Worker 4: `E6` sowie Querschnittsverifikation

Die Verteilung wird nach der Review-Runde mit den 4 Analyse-Agenten finalisiert.
