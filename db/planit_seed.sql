INSERT INTO `users` (`id`, `name`, `surname`, `email`, `password`) VALUES 
(1, 'Mario', 'Rossi', 'mario@example.com', '$2b$10$SampleHashForTesting123'),
(2, 'Giulia', 'Verdi', 'giulia@example.com', '$2b$10$AnotherSampleHash456');


INSERT INTO `categories` (`id`, `name`, `color`) VALUES 
(1, 'Lavoro', '#E74C3C'), 
(2, 'Sport', '#2ECC71'), 
(3, 'Personale', '#3498db'),
(4, 'Spesa', '#F1C40F');


INSERT INTO `tasks` (`user_id`, `category_id`, `title`, `description`, `status`, `priority`, `scheduled_at`) VALUES 
(1, 1, 'Finire il database', 'Completare lo schema su MySQL e testare le FK', 'in_progress', 'high', NOW()),
(1, 2, 'Allenamento Gambe', 'Sessione leg day in palestra', 'todo', 'medium', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 4, 'Comprare Latte', 'Prendere quello senza lattosio', 'todo', 'low', NULL),
(1, 1, 'Preparare presentazione Client X', 'Focus su grafici di vendita', 'todo', 'high', '2026-03-05 09:30:00'),
(1, 3, 'Prenotare vacanze estive', 'Controllare voli per la Grecia', 'todo', 'low', NULL),
(1, NULL, 'Task senza categoria', 'Verifica gestione task orfani', 'todo', 'low', NULL);


INSERT INTO `tasks` (`user_id`, `category_id`, `title`, `description`, `status`, `priority`, `scheduled_at`) VALUES 
(2, 3, 'Lezione di Yoga', 'Sessione online su Zoom', 'todo', 'medium', '2026-02-26 17:00:00'),
(2, 1, 'Scrivere articolo Blog', 'Database relazionali e Node.js', 'in_progress', 'high', '2026-02-28 12:00:00');