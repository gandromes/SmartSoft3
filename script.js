"use strict";
// mybase utils any project
var _ = {
    len: (any) => any.length,
    log: (any) => console.log(any),
    error: (any) => console.error(any),
    empty: '',
    upfirstletter: (str) => str.charAt(0).toUpperCase() + str.substring(1),
    shuffle: function shuffle(array) {
        var currentIndex = array.length;
        var randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}

// CONST
var MINLETTERUSERFORM = 3;
var SERVERURL = 'http://127.0.0.1';


// FORM helpblock
document.getElementById("helpblock").addEventListener('submit', function (e){
    e.preventDefault();

    var name    = this.elements['name'].value.trim();
    var surname = this.elements['surname'].value.trim();
    var message = this.elements['message'].value.trim();
    var email   = this.elements['email'].value.trim();

    if (_.len(name) < MINLETTERUSERFORM) {
        Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Поле Имя должно содержать не менее 3 символов!'
        })
    }
    else if ((_.len(surname) < MINLETTERUSERFORM) && (surname !== _.empty)) {
        // по тз фамилия не обезательное поле.
        Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Поле Фамилия должна содержать не менее 3 символов!',
        })
    }
    else if (email == _.empty) {
        Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Поле почты не должно быть пустым!'
        })
    }
    else if (message == _.empty) {
        Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Сообщение не должно быть пустым!',
        })
    }
    else {
        Swal.fire({
            icon: 'success',
            title: 'Сообщение отправлено, ожидайте ответа'
        })
    }

    fetch(SERVERURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, email, message })
    })
    .then(response => {
        _.log("Ок:", response);
    })
    .catch(error => {
        _.error("Ошибка:", error);
    });
})

// FORM orderblock
document.getElementById('orderblock').addEventListener('submit', function (e){
    e.preventDefault();

    var name    = this.elements['full_name'].value.trim();
    var address = this.elements['delivery_address'].value.trim();
    var comment = this.elements['comment'].value.trim();
    var ischeck = this.elements['terms_agreement'].checked;

    if (_.len(name) < MINLETTERUSERFORM) {
        Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Имя должно содержать не менее 3 символов!'
        })
    }
    // Странно должна быть проверка на адрес так как адрес доставки заказа важный параметр без которого доставка не реализуема
    else if (!ischeck) {
        Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Необходимо принять условия договора-оферты'
        })
    }
    else { 
        Swal.fire({
            title: 'Ваш заказ создан!',
            html: `
            <p><strong>Имя:</strong> ${_.upfirstletter(name)}</p>
            <p><strong>Адрес:</strong> ${address || 'Отсутствует'}</p>
            <p><strong>Комментарий:</strong> ${comment || 'Отсутствует'}</p>
            `,
            icon: 'success',
        });
    }


    fetch(SERVERURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, address, comment})
  })
    .then(response => {
      console.log("Успех:", response);
    })
    .catch(error => {
      console.error("Ошибка:", error);
    });


})


    document.addEventListener("DOMContentLoaded", function () {
    var reviewsBlock = document.querySelector(".reviewsblock");

    // Воспользуемся делегированием на действия: редактировать / удалить
    reviewsBlock.addEventListener("click", function (e) {
        var target = e.target;
        var id = target.dataset.id;

        if (target.classList.contains("deletebutton")) {
            // Удаление
            Swal.fire({
                title: "Удалить отзыв?",
                text: "Это действие нельзя отменить!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Удалить",
                cancelButtonText: "Отмена",
                confirmButtonColor: "#d33"
            }).then(function (result) {
                if (result.isConfirmed) {
                    fetch("actions.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: "action=delete&id=" + encodeURIComponent(id)
                    })
                    .then(function (res) { return res.text(); })
                    .then(function (res) {
                        if (res.trim() === "OK") {
                            var reviewEl = document.getElementById("review-" + id);
                            if (reviewEl) reviewEl.remove();
                            Swal.fire("Удалено!", "Отзыв был удалён.", "success");
                        } else {
                            Swal.fire("Ошибка", res, "error");
                        }
                    });
                }
            });

        } else if (target.classList.contains("editbutton")) {
            // Редактирование
            var nameEl = document.getElementById("username-" + id);
            var textEl = document.getElementById("text-" + id);

            Swal.fire({
                title: "Редактировать отзыв",
                html:
                    '<input id="swal-name" class="swal2-input" placeholder="Имя" value="' + nameEl.textContent + '">' +
                    '<textarea id="swal-text" class="swal2-textarea" placeholder="Отзыв">' + textEl.textContent + '</textarea>',
                showCancelButton: true,
                confirmButtonText: "Сохранить",
                cancelButtonText: "Отмена",
                preConfirm: function () {
                    var name = document.getElementById("swal-name").value.trim();
                    var comment = document.getElementById("swal-text").value.trim();
                    if (!name || !comment) {
                        Swal.showValidationMessage("Имя и отзыв не могут быть пустыми");
                        return false;
                    }
                    return { name: name, comment: comment };
                }
            }).then(function (result) {
                if (result.isConfirmed) {
                    fetch("actions.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: "action=edit&id=" + encodeURIComponent(id) +
                              "&name=" + encodeURIComponent(result.value.name) +
                              "&comment=" + encodeURIComponent(result.value.comment)
                    })
                    .then(function (res) { return res.text(); })
                    .then(function (res) {
                        if (res.trim() === "OK") {
                            nameEl.textContent = result.value.name;
                            textEl.textContent = result.value.comment;
                            Swal.fire("Готово", "Отзыв обновлён", "success");
                        } else {
                            Swal.fire("Ошибка", res, "error");
                        }
                    });
                }
            });
        }
    });

    // Добавление отзыва
    var addBtn = document.getElementById("addReviewBtn");
    if (addBtn) {
        addBtn.addEventListener("click", function () {
            Swal.fire({
                title: 'Добавить отзыв',
                html:
                    '<input id="swal-name" class="swal2-input" placeholder="Ваше имя">' +
                    '<textarea id="swal-comment" class="swal2-textarea" placeholder="Ваш отзыв"></textarea>',
                confirmButtonText: 'Отправить',
                showCancelButton: true,
                cancelButtonText: 'Отмена',
                preConfirm: function () {
                    var name = document.getElementById("swal-name").value.trim();
                    var comment = document.getElementById("swal-comment").value.trim();
                    if (!name || !comment) {
                        Swal.showValidationMessage("Пожалуйста, заполните все поля");
                        return false;
                    }
                    return { name: name, comment: comment };
                }
            }).then(function (result) {
                if (result.isConfirmed) {
                    var name = result.value.name;
                    var comment = result.value.comment;

                    fetch("actions.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: "action=add&name=" + encodeURIComponent(name) +
                              "&comment=" + encodeURIComponent(comment)
                    })
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                        if (data.status === "OK") {
                            // Вставка нового отзыва без перезагрузки
                            var newHTML =
                                "<div class='review' id='review-" + data.id + "'>" +
                                    "<img class='reviewicon' src='reviewicon.png' alt='Отзыв'>" +
                                    "<div class='reviewinfoblock'>" +
                                        "<p class='reviewusername' id='username-" + data.id + "'>" + data.name + "</p>" +
                                        "<p class='reviewtext' id='text-" + data.id + "'>" + data.comment + "</p>" +
                                    "</div>" +
                                    "<div class='reviewactions'>" +
                                        "<img src='penicon.png' data-id='" + data.id + "' alt='Редактировать' class='iconbutton editbutton'>" +
                                        "<img src='trashicon.png' data-id='" + data.id + "' alt='Удалить' class='iconbutton deletebutton'>" +
                                    "</div>" +
                                "</div>";

                            var reviewsusersblock = reviewsBlock.children.reviewsusersblock; // получаю блок отзывов
                            reviewsusersblock.insertAdjacentHTML("afterBegin", newHTML);
                            Swal.fire("Готово!", "Отзыв добавлен", "success");
                        } else {
                            Swal.fire("Ошибка", data.message || "Не удалось добавить отзыв", "error");
                        }
                    });
                }
            });
        });
        }
    });