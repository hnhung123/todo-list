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
                    document.querySelector('tbody').appendChild(eleMail);
                });
            };

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

            //*****Add  - Popup
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
                localStorage.setItem('data', JSON.stringify(dataMail)) // Convert [] => '[]'
            };
            //Create a new Constructor Function Mail
            function objectMail(id, mail, des, author) {
                this.id = id;
                this.mail = mail;
                this.des = des;
                this.author = author;
            }

            //*****Delete - Popup
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

            noBtn.addEventListener('click', () => {
                hidePopup(delPopup)
            });

            function deleteData(index) {
                dataMail = JSON.parse(localStorage.getItem('data')); // Convert '[]'=> [] -- convert string thanh object
                console.log(JSON.parse(JSON.stringify(dataMail)));
                dataMail.splice(index, 1);
                console.log(dataMail);
                dataMail.forEach((item, index) => {
                    return item.id = index + 1;
                });
                localStorage.setItem('data', JSON.stringify(dataMail)); //Convert [] => '[]'
                location.reload();
            }

            //*****Chức năng phân trang 
            let currentPage = 1;
            let rows = 5;
            let dataSet = JSON.parse(localStorage.getItem('data'))
            let table = document.querySelector('tbody');
            let allItem = document.querySelectorAll('tbody tr');
            // Hiện 5 dòng trong 1 trang
            function displayArrayPagination(array, wrapper, rows_par_page, page) {
                if (array == null) return;
                wrapper.innerHTML = '';
                page--;
                let start = rows_par_page * page;
                let end = start + rows_par_page;
                let paginationArray = array.slice(start, end);
                for (let i = 0; i < paginationArray.length; i++) {
                    wrapper.appendChild(allItem[i + start])
                }
            };
            displayArrayPagination(dataSet, table, rows, currentPage)
                // Hiện nút phân trang
            function createPageBtn() {
                if (dataSet == null) return;
                let quality = Math.ceil(dataSet.length / rows);
                let paginationGroup = document.createElement('ul');
                paginationGroup.className = 'pagination';
                document.querySelector('.table').appendChild(paginationGroup);
                for (let i = 0; i < quality; i++) {
                    let item = document.createElement('li');
                    if (i === currentPage - 1) {
                        item.classList.add('active')
                    }
                    item.innerHTML = i + 1;
                    paginationGroup.appendChild(item)
                }
            };

            createPageBtn()

            // Click vào nút phân trang
            let allPagBtn = document.querySelectorAll('.pagination li');

            if (allPagBtn == null) return;

            allPagBtn.forEach((item, index) => item.addEventListener('click', () => {
                    allPagBtn.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    currentPage = index + 1;
                    displayArrayPagination(dataSet, table, rows, currentPage)
                }))
                //Edit - popup
            let editBtn = document.querySelectorAll('.edit');
            editBtn.forEach((item, index) => item.addEventListener('click', () => {
                currentFunc = 'edit';
                showPopup(editPopup);
                completeBtn.addEventListener('click', () => {
                    validate();
                    if (validate()) {
                        loader.classList.add('active');
                        setTimeout(() => {
                            loader.classList.remove('active');
                            if (currentFunc == 'edit') {
                                editData(index)
                            }
                        }, 1000)
                    }
                })

            }));

            function editData(index) {
                dataMail = JSON.parse(localStorage.getItem('data'));
                dataMail[index].mail = fieldMail.value;
                dataMail[index].des = fieldDes.value;
                dataMail[index].author = fieldAuthor.value;

                localStorage.setItem('data', JSON.stringify(dataMail));
                location.reload()
            };

            //Search
            let search = document.querySelector('.nav__search #search');
            search.addEventListener('keyup', () => {
                console.log(search.value);
                searchData(search.value)

            });

            function searchData(searchValue) {
                let items = document.querySelectorAll('tbody tr');
                for (let i = 0; i < items.length; i++) {
                    let value = items[i].querySelector('.title').textContent;
                    if (value.toUpperCase().includes(searchValue.toUpperCase())) {
                        items[i].style.cssText = 'display: table-row';
                    } else {
                        items[i].style.cssText = 'display:none';
                    }
                }
            }

            //Sort
            let sort = document.querySelectorAll('[data-sort]');
            sort.forEach((item, index) => item.addEventListener('click', () => {
                    let order = item.dataset.sort;
                    sort.forEach(i => i.classList.remove('active'));
                    if (order == 'desc') {
                        item.dataset.sort = 'asc';
                        item.className = 'active asc';
                        sortData(item.dataset.col, 'asc')
                    } else {
                        item.dataset.sort = 'desc';
                        item.className = 'active desc';
                        sortData(item.dataset.col, 'desc')
                    }
                }))
                //Sort Data Function
            function sortData(type, order) {
                let typeSort = type;
                arraySort = JSON.parse(localStorage.getItem('data'));
                if (order == 'desc') {
                    if (typeSort == 'id') {
                        arraySort = arraySort.sort((a, b) => parseInt(a[typeSort]) > parseInt(b[typeSort]) ? 1 : -1)
                    } else {
                        arraySort = arraySort.sort((a, b) => a[typeSort].toLowerCase() > b[typeSort].toLowerCase() ? 1 : -1)
                    }
                } else {
                    if (typeSort == 'id') {
                        arraySort = arraySort.sort((a, b) => parseInt(a[typeSort]) > parseInt(b[typeSort]) ? 1 : -1);
                    } else {
                        arraySort = arraySort.sort((a, b) => a[typeSort].toLowerCase() < b[typeSort].toLowerCase() ? 1 : -1)
                    }
                }
                let allItem = document.querySelectorAll('tbody tr');
                let main = document.querySelector('tbody');
                main.innerHTML = '';
                let max = 0;
                while (max <= allItem.length) {
                    arraySort.forEach((items, indexes) => {
                        allItem.forEach((item, index) => {
                            let selfId = item.querySelector('.id').textContent;
                            if (selfId == items.id) {
                                main.appendChild(item);
                                max++;
                            }
                        })
                    })
                };

            }
        }
    }

    table.init()
})