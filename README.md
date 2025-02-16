# Dashboard Dokumentation

Dieses Dokument beschreibt das Verkaufs-Dashboard, das einen Überblick über tägliche und monatliche Verkaufsdaten bietet.

## 1. Übersicht

Das Dashboard zeigt Verkaufszahlen in Kacheln an, die je nach Auswahl (Tag/Monat) unterschiedliche Informationen darstellen. Es visualisiert die aktuelle Leistung und ermöglicht es Benutzern, zwischen Tages- und Monatsansichten zu wechseln.

## 2. Frontend-Elemente

### Interaktive Elemente

- **Tag/Monat-Umschalter:** Ein Umschalter (Button-Gruppe) in den Kacheln 1 und 2 (mit den Beschriftungen "Tag" und "Monat") ermöglicht es dem Benutzer, zwischen der Tages- und Monatsansicht zu wechseln. Der aktive Modus ist hervorgehoben.

- **Text unterhalb der Kacheln:** Zeigt den aktuellen Monat und weitere Informationen an:
  - März 2025 (Monat und Jahr)
  - Insgesamt 95 Autos verkauft.
  - An 22 von 22 Arbeitstagen wurde das Tagesziel überschritten (100.00%)
- **Monatsauswahl:** Ein Kalendersymbol und ein Textfeld unterhalb der Kacheln, mit der Beschriftung "März". Dies erlaubt es dem Benutzer einen Monat auszuwählen.

## 3. API-Dokumentation

Diese Dokumentation beschreibt die API-Endpunkte für die Verwaltung monatlicher und täglicher Verkaufsdaten.

## 3.1. Modelle

### 3.1.1. `MonthlySales`

Stellt die monatlichen Verkaufsdaten dar.

| Feld               | Typ        | Beschreibung                                                                                                  | Erforderlich |
| :----------------- | :--------- | :------------------------------------------------------------------------------------------------------------ | :----------- |
| `year`             | `Number`   | Jahr                                                                                                          | Ja           |
| `month`            | `Number`   | Monat                                                                                                         | Ja           |
| `plannedSales`     | `Number`   | Geplante Gesamtverkäufe                                                                                       | Ja           |
| `actualSales`      | `Number`   | Tatsächliche Gesamtverkäufe                                                                                   | Ja           |
| `workingDaysCount` | `Number`   | Anzahl der Arbeitstage (ohne Wochenenden und Feiertage) - Alias: `workingDays`                                | Ja           |
| `dailySales`       | `Array`    | Ein Array von [`DailySale`](#12-dailysale)-Objekten. Enthält tägliche Verkaufsdaten für jeden Tag des Monats. | Ja           |
| `_id`              | `ObjectId` | Eindeutige ID, die von MongoDB automatisch generiert wird.                                                    | Nein         |

### 3.1.2. `DailySale`

Stellt die täglichen Verkaufsdaten dar. Ist im `MonthlySales`-Modell enthalten.

| Feld           | Typ        | Beschreibung                                                  | Erforderlich |
| :------------- | :--------- | :------------------------------------------------------------ | :----------- |
| `day`          | `Number`   | Tag des Monats (1-31)                                         | Ja           |
| `sales`        | `Number`   | Verkäufe an diesem Tag                                        | Ja           |
| `isWorkingDay` | `Boolean`  | Gibt an, ob dieser Tag ein Arbeitstag ist (true/false)        | Ja           |
| `date`         | `Date`     | Datum                                                         | Ja           |
| `weekday`      | `String`   | Wochentag (z. B. "Monday", "Tuesday", ...)                    | Ja           |
| `holiday`      | `String`   | Name des Feiertags (nur wenn es ein Feiertag ist, sonst null) | Nein         |
| `_id`          | `ObjectId` | Eindeutige ID, die von MongoDB automatisch generiert wird     | Nein         |

## 3.2. Endpunkte

### 3.2.1. Monatliche Verkaufsdaten erstellen

**`POST /api/sales`**

Erstellt neue monatliche Verkaufsdaten.

**Anfrage-Body:**

```json
{
  "year": Number,       // Jahr
  "month": Number,      // Monat (1-12)
  "plannedSales": Number  // Geplante Gesamtverkäufe in diesem Monat
}
```

**Erfolgreiche Antwort (201 Created):**

```json
{
  "_id": "65a1234b567c890def123456", //generierte ID von MonthlySales
  "year": 2024,
  "month": 1,
  "plannedSales": 100,
  "actualSales": 0,
  "workingDaysCount": 22,
  "dailySales": [
    {
      "day": 1,
      "sales": 0,
      "isWorkingDay": true,
      "date": "2025-02-15T00:00:00.000Z",
      "weekday": "Sonntag",
      "_id": "65a1234b567c890def123457"
    }
    // ... Restliche Tagesdaten ...
  ],
  "__v": 0
}
```

**Fehlerantworten:**

- **`400 Bad Request`**:
  - Wenn `year`, `month` oder `plannedSales` fehlen.
  - Wenn `year`, `month` oder `plannedSales` keine Zahlen sind.
  - Wenn `month` nicht im Bereich 1-12 liegt.
  - Wenn `plannedSales` negativ ist.
- **`500 Internal Server Error`**: Interner Serverfehler (z. B. Fehler beim Speichern in der Datenbank).

### 3.2.2. Monatliche Verkaufsdaten abrufen

**`GET /api/sales/:yearMonth`**

Ruft die Verkaufsdaten für ein bestimmtes Jahr und einen bestimmten Monat ab (Format: `YYYYMM`).

**Anfrage-Parameter:**

| Parameter   | Typ      | Beschreibung                                                   | Erforderlich |
| :---------- | :------- | :------------------------------------------------------------- | :----------- |
| `yearMonth` | `String` | Jahr und Monat, die abgerufen werden sollen (Format: `YYYYMM`) | Ja           |

**Erfolgreiche Antwort (200 OK):**

```json
{
  "_id": "65a1234b567c890def123456",
  "year": 2024,
  "month": 1,
  "plannedSales": 1000000,
  "actualSales": 0,
  "workingDaysCount": 22,
  "dailySales": [
    {
      "day": 1,
      "sales": 0,
      "isWorkingDay": true,
      "date": "2024-01-01T00:00:00.000Z",
      "weekday": "Monday",
      "_id": "65a1234b567c890def123457"
    }
    // ... Restliche Tagesdaten ...
  ],
  "__v": 0
}
```

**Fehlerantworten:**

- **`400 Bad Request`**:
  - Wenn der `yearMonth`-Parameter fehlt oder die Länge nicht 6 ist.
  - Wenn Jahr oder Monat aus dem `yearMonth`-Parameter nicht in Zahlen konvertiert werden können.
  - Wenn `month` nicht im Bereich 1-12 liegt.
- **`404 Not Found`**: Wenn für das angegebene Jahr und den angegebenen Monat keine Verkaufsdaten vorhanden sind.
- **`500 Internal Server Error`**: Interner Serverfehler.

---

### 3.2.3. Liste der verfügbaren Monate abrufen

**`GET /api/sales/available-months`**

Ruft eine Liste aller Jahr-Monat-Kombinationen ab (`YYYYMM`-Format), für die Daten vorhanden sind.

**Anfrage-Parameter:** Keine

**Erfolgreiche Antwort (200 OK):**

```json
[
  "202312",
  "202401",
  "202402"
...
]
```

**Fehlerantworten:**

- **`500 Internal Server Error`**: Interner Serverfehler.
