<?php
require_once 'core/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // Добавление нового отзыва
    if ($action === 'add' && isset($_POST['name'], $_POST['comment'])) {
        $name = trim($_POST['name']);
        $comment = trim($_POST['comment']);

        if ($name && $comment) {
            $stmt = $pdo->prepare("INSERT INTO reviews (name, comment, address) VALUES (?, ?, '')");
            $stmt->execute([$name, $comment]);

            $id = $pdo->lastInsertId();
            echo json_encode([
                "status" => "OK",
                "id" => $id,
                "name" => htmlspecialchars($name),
                "comment" => htmlspecialchars($comment)
            ]);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "Заполните все поля"]);
            exit;
        }
    }

    // Удаление отзыва
    if ($action === 'delete' && isset($_POST['id'])) {
        $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = ?");
        $stmt->execute([$_POST['id']]);
        echo "OK";
        exit;
    }

    // Редактирование отзыва
    if ($action === 'edit' && isset($_POST['id'], $_POST['name'], $_POST['comment'])) {
        $stmt = $pdo->prepare("UPDATE reviews SET name = ?, comment = ? WHERE id = ?");
        $stmt->execute([
            trim($_POST['name']),
            trim($_POST['comment']),
            $_POST['id']
        ]);
        echo "OK";
        exit;
    }

    echo "Неверный запрос";
}
