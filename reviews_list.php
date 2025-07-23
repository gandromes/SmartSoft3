<?php
header('Content-Type: text/html; charset=utf-8');
require_once 'db.php';

$stmt = $pdo->query("SELECT name, comment FROM reviews ORDER BY id DESC");  // чтобы повеселей было рандомный вывод из бд отзывов
$PATHREVIEWICON = "reviewicon.png";



while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "<div class='review'>
            <img class='reviewicon' src='$PATHREVIEWICON' alt='Отзыв'>
            <div class='reviewinfoblock'>
                <p class='reviewusername'>{$row['name']}</p>
                <p class='reviewtext'>{$row['comment']}</p>
            </div>
          </div>";
}
?>