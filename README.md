# Baskit

Mobile App fuer Rezepte und Einkaufsliste.

## Development

```bash
yarn start
yarn typecheck
yarn test
yarn test:coverage
```

## Release Gates

Vor einem Release muessen diese Punkte gruen sein:

1. `yarn typecheck`
2. `yarn test`
3. manueller Smoke-Test auf Geraet oder Emulator
4. erfolgreicher EAS-Production-Build

## Manueller Smoke-Test

Die App wird einmal durch diese Kernfluesse geprueft:

1. Rezept anlegen
2. Rezept bearbeiten
3. Zutaten komplett in den Basket uebernehmen
4. einzelne Zutaten selektiv uebernehmen
5. Custom-Item hinzufuegen
6. Eintrag abhaken
7. Eintrag wiederherstellen oder loeschen
8. Basket leeren
9. App neu starten und Persistenz pruefen

## Android Bundle

```bash
bundletool build-apks --bundle=./build/android/baskit_1.0.0.aab --output=./my_app.apks --mode=universal
```
