# KI-Chatbot Widget 🤖

Ein einbindbares Chatbot-Widget für Webseiten, das über ein kleines Fenster unten
rechts erreichbar ist. Backend in **Spring Boot**, Frontend mit **Thymeleaf**, die
Antworten kommen von der **Claude API** von Anthropic.

> Entstanden als Abschlussprojekt meiner Ausbildung zum Fachinformatiker für
> Anwendungsentwicklung (IHK).

---

## 📸 Screenshot

<!-- Ersetze das hier durch einen echten Screenshot oder ein GIF!
     Lade das Bild ins Repo (z.B. in einen Ordner /docs) und verlinke es so: -->
![Chatbot Screenshot](docs/screenshot.png)

---

## ✨ Funktionen

- Chat-Fenster unten rechts, das sich per Klick öffnet und schließt
- Nachrichten werden per REST an das Backend geschickt
- Backend ruft die Claude API auf und gibt die Antwort zurück
- Chatverlauf wird in der Datenbank gespeichert
- Lässt sich in eine bestehende Webseite einbinden

---

## 🛠️ Tech-Stack

| Bereich    | Technologie          |
|------------|----------------------|
| Backend    | Java, Spring Boot    |
| Frontend   | Thymeleaf, HTML/CSS/JS |
| KI         | Anthropic Claude API |
| Datenbank  | Spring Data JPA      |
| Build      | Maven                |

---

## 🚀 Lokal starten

**Voraussetzungen:** Java 17+ und Maven installiert, sowie ein Claude-API-Key
(kostenlos erstellbar unter console.anthropic.com).

1. Repo klonen:
   ```bash
   git clone https://github.com/DEIN_USERNAME/chatbot-widget.git
   cd chatbot-widget
   ```

2. Konfiguration anlegen: Kopiere `application.properties.example` nach
   `src/main/resources/application.properties`.

3. Deinen API-Key als Umgebungsvariable setzen:
   ```bash
   # Linux / macOS
   export ANTHROPIC_API_KEY=dein-key-hier

   # Windows (PowerShell)
   $env:ANTHROPIC_API_KEY="dein-key-hier"
   ```

4. Starten:
   ```bash
   mvn spring-boot:run
   ```

5. Im Browser öffnen: `http://localhost:8080`

---

## 📁 Projektstruktur (grob)

```
src/main/java/.../chatbot/
├── controller/   REST-Endpunkte & Seiten
├── service/      Geschäftslogik + Claude-API-Anbindung
├── repository/   Datenbankzugriff
├── model/        Entities
└── dto/          Datenübertragungsobjekte
```

---

## 📝 Hinweis

Der API-Key ist **bewusst nicht** im Repository enthalten. Er wird zur Laufzeit
aus einer Umgebungsvariable gelesen.

---

## 👤 Autor

Tim Wilhelmi – [dein-github-link] 
