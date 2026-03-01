# 📝 Todo List API - Backend

Il cuore pulsante dell'applicazione Todo List. Un'**API RESTful** robusta costruita con Node.js, Express e MySQL, progettata con un focus particolare sulla sicurezza e la flessibilità.

---

## 🚀 Caratteristiche Principali

- **Autenticazione Sicura**: Gestita tramite **JWT** memorizzati in `httpOnly Cookies` per prevenire attacchi XSS.
- **Password Protection**: Hashing avanzato delle password tramite **Bcrypt**.
- **CRUD Completo**: Gestione totale del ciclo di vita dei task (Create, Read, Update, Delete).
- **Filtri & Sorting Dinamici**: Filtri per `status`, `priority` e `category` con ordinamento intelligente per data.
- **Single Source of Truth**: Costanti centralizzate per garantire coerenza tra Database, Backend e Frontend.

---

## 🛠️ Tecnologie Utilizzate

| Tecnologia     | Scopo                              |
| :------------- | :--------------------------------- |
| **Node.js**    | Runtime di esecuzione              |
| **Express.js** | Framework web per le rotte         |
| **MySQL**      | Database relazionale               |
| **JWT**        | Gestione sessioni e autorizzazione |
| **Bcrypt**     | Sicurezza delle credenziali        |

---

## 📡 API Endpoints

### 🔐 Autenticazione (`/api/auth`)

| Metodo | Rotta       | Descrizione        | Note                              |
| :----- | :---------- | :----------------- | :-------------------------------- |
| `POST` | `/register` | Registra un utente | Valida dati e formatta i nomi     |
| `POST` | `/login`    | Effettua l'accesso | Rilascia il cookie `access_token` |
| `POST` | `/logout`   | Chiude la sessione | Cancella il cookie di sessione    |

### 📋 Task (`/api/tasks`)

> _Richiedono l'header di autenticazione tramite cookie._

| Metodo   | Rotta  | Descrizione              | Query Params                             |
| :------- | :----- | :----------------------- | :--------------------------------------- |
| `GET`    | `/`    | Lista i task dell'utente | `status`, `priority`, `category`, `sort` |
| `POST`   | `/`    | Crea un nuovo task       | Richiede `title`                         |
| `PATCH`  | `/:id` | Modifica parziale        | Inviare solo i campi da cambiare         |
| `DELETE` | `/:id` | Elimina un task          | Controllo proprietà (Ownership)          |

### ⚙️ Configurazione (`/api/config`)

| Metodo | Rotta | Descrizione                                    |
| :----- | :---- | :--------------------------------------------- |
| `GET`  | `/`   | Restituisce stati, priorità e categorie validi |

---

## 🗄️ Struttura Dati Task

Ogni task nel sistema è caratterizzato da:

- `id`: Identificativo univoco (PK).
- `title`: Titolo descrittivo (**Obbligatorio**).
- `status`: `todo`, `in_progress`, `done`.
- `priority`: `low`, `medium`, `high`.
- `scheduled_at`: Timestamp della scadenza.
- `category_id`: Riferimento alla categoria (FK).

---

## ⚙️ Installazione e Setup

1. **Clona il repository**:
   ```bash
   git clone https://github.com/pierluigi-ruffolo/Planit-server
   ```
