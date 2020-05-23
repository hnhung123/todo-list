window.onload = (() => {
    let table = {
        init: function() {
            this.toDoList();
        },
        toDoList: function() {
            pullData();

            function pullData() {
                dataMail = JSON.parse(localStorage.getItem('data'));
                if (dataMail == null) return;
                // dataMail = [
                //     { id: 1, mail: "nhung123@gmail.com", author: 'LE Thi Hong Nhung', des: 'This is description' }
                // ]
                document.querySelector('tbody').innerHTML = '';
                dataMail.forEach(element => {
                    let eleMail = document.createElement('tr');
                    let contentMail = `
                        <td class="id">${element.id}</td> 
                        <td class="title">${element.mail}</td> 
                        <td class="des">${element.des}</td> 
                        <td class="author">${element.author}</td> 
                        <td class="edit"><i class="fas fa-edit"></i></td>
                        <td class="trash"><i class="fas fa-trash-alt"></i></td>
                    `;
                    eleMail.innerHTML = contentMail;
                    console.log(contentMail);
                    document.querySelector('tbody').appendChild(eleMail);
                });
            };
            //Add - Edit - Popup
            let addBtn = document.querySelector('.btnAdd');
            let editPopup = document.querySelector('.form-add-edit');
            let completeBtn = editPopup.querySelector('#complete');
            let cancelBtn = editPopup.querySelector('#cancel');
            let overlay = document.querySelector('.overlay');
            let fieldMail = document.querySelector('#mail');
            let fieldDes = document.querySelector('#des');
            let fieldAuthor = document.querySelector('#author');
            let loader = document.querySelector('.loader');
            let currentFunc;

            addBtn.addEventListener('click', () => {
                currentFunc = 'add';
                showPopup(editPopup)
            });

            function showPopup(popup) {
                popup.classList.add('active');
                overlay.classList.add('active');
            };

            cancelBtn.addEventListener('click', () => {
                hidePopup(editPopup);
                resetForm()
            });

            function hidePopup(popup) {
                popup.classList.remove('active');
                overlay.classList.remove('active')
            };

            function resetForm() {
                fieldMail.value = '';
                fieldDes.value = '';
                fieldAuthor.value = '';
            };
            completeBtn.addEventListener('click', () => {
                validate();
                if (validate()) {
                    loader.classList.add('active');
                    setTimeout(() => {
                        loader.classList.remove('active');
                        if (currentFunc == 'add') {
                            addData();
                        }
                    }, 1000)

                }

            });

            function validate() {
                if (fieldMail.value.length == 0 || fieldDes.value.length == 0 || fieldAuthor.value.length == 0) {
                    editPopup.style.animation = 'invalid 0.5s linear forwards';
                    return false;
                } else {
                    return true;
                }
            };
            editPopup.addEventListener('animationend', () => {
                editPopup.style.animation = '';
            });

            function addData() {
                pushData();
                hidePopup(editPopup);
                resetForm();
                location.reload()

            };

            function pushData() {
                let dataMail = JSON.parse(localStorage.getItem('data'));
                if (dataMail === null) {
                    dataMail = []
                };
                let objMail = new objectMail(dataMail.length + 1, fieldMail.value, fieldDes.value, fieldAuthor.value);
                dataMail.push(objMail);
                localStorage.setItem('data', JSON.stringify(dataMail))
            };
            //Create a new Constructor Function Mail
            function objectMail(id, mail, des, author) {
                this.id = id;
                this.mail = mail;
                this.des = des;
                this.author = author;
            }
            //Delete  Popup
            let delBtn = document.querySelectorAll('.trash');
            let delPopup = document.querySelector('.form-delele');
            let yesBtn = document.querySelector('#yes');
            let noBtn = document.querySelector('#no');
            delBtn.forEach((item, index) => item.addEventListener('click', () => {
                showPopup(delPopup);
                yesBtn.addEventListener('click', () => {
                    loader.classList.add('active');
                    setTimeout(() => {
                        loader.classList.remove('active');
                        deleteData(index)
                    }, 1000);

                })
            }));

            function deleteData() {

            }
        }
    }

    table.init()
})