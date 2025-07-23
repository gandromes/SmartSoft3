<?php
header('Content-Type: text/html; charset=utf-8');
require_once 'core/db.php';

$PATHREVIEWICON   = "assets/img/reviewicon.png";
$EDITREVIEWICON   = "assets/img/penicon.png";
$DELETEREVIEWICON = "assets/img/trashicon.png";

$stmt = $pdo->query("SELECT id, name, comment FROM reviews ORDER BY id DESC");  // 
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $id        = $row['id'];
    $username  = htmlspecialchars($row['name']);
    $text      = htmlspecialchars($row['comment']);

    echo "<div class='review' id='review-$id'>
            <img class='reviewicon' src='$PATHREVIEWICON' alt='Отзыв'>
            <div class='reviewinfoblock'>
                <p class='reviewusername' id='username-$id'>$username</p>
                <p class='reviewtext' id='text-$id'>$text</p>
            </div>
            <div class='reviewactions'>
                <img src='$EDITREVIEWICON' data-id='$id' alt='Редактировать' class='iconbutton editbutton'>
                <img src='$DELETEREVIEWICON' data-id='$id' alt='Удалить' class='iconbutton deletebutton'>
            </div>
          </div>";
}
?>