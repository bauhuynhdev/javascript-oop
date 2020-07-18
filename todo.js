function Todo() {
    const TABLE = 'todo';
    const CREATE = 1;
    const UPDATE = 2;

    var db = undefined;

    var id = undefined;

    var form = undefined;

    var statusForm = CREATE;

    /**
     * Get items
     * @returns {*}
     */
    function getItems() {
        return db.queryAll(TABLE, {
            sort: [['ID', 'DESC']]
        });
    }

    /**
     * Get a item
     * @param _id
     * @returns {null|*}
     */
    function getItem(_id) {
        _id = parseInt(_id);

        id = _id;

        const item = db.queryAll(TABLE, {
            query: {
                ID: _id
            }
        });

        if (item.length) {
            return item[0];
        }

        return null;
    }

    /**
     * Insert a item
     * @param payload
     */
    function insertItem(payload) {
        if (payload) {
            db.insert(TABLE, payload);
            db.commit();
        }
    }

    /**
     * Update a item
     * @param _id
     * @param payload
     */
    function updateItem(_id, payload = null) {
        if (payload) {
            db.update(TABLE, {ID: _id}, function (row) {
                for (var field in payload) {
                    row[field] = payload[field];
                }

                return row;
            })

            db.commit();
        }
    }

    /**
     * Delete a item
     * @param _id
     */
    function removeItem(_id) {
        _id = parseInt(_id);
        db.deleteRows(TABLE, {ID: _id});
        db.commit();
    }

    /**
     * Render view
     */
    function renderView() {
        $('.list-group').empty();

        var items = getItems();

        items.forEach(function (item) {
            var html =
                `<li data-id="${item.ID}" class="list-group-item d-flex align-items-center">${item.name}
                    <div class="tool ml-auto">
                        <button class="btn btn-warning update" type="button"><i aria-hidden="true"
                                                                         class="fa fa-pencil-square-o"></i>
                        </button>
                        <button class="btn btn-danger delete" type="button"><i aria-hidden="true"
                                                                        class="fa fa-trash-o"></i></button>
                    </div>
                </li>`
            $('.list-group').append(html);
        })

        registerListenCreateAndUpdate();
        registerDelete();
        handleSubmitForm();
    }

    /**
     * Refactor form before render
     * @param item
     */
    function refactorForm(item = null) {
        var title = 'Create';
        if (statusForm === UPDATE) {
            title = 'Update';
        }

        form = $('#formTodo');

        form.find('.modal-title').text(title);

        var name = '';
        if (item && item.name !== undefined) {
            name = item.name;
        }

        $('#nameInput').val(name);
        form.modal('show');
    }

    /**
     * Handle Create and Update of Form
     */
    function handleSubmitForm() {
        $('#submit')
            .off('click')
            .on('click', function () {
                var nameField = $('#nameInput').val();

                switch (statusForm) {
                    case CREATE:
                        insertItem({name: nameField})
                        break;
                    case UPDATE:
                        updateItem(id, {name: nameField})
                        break;
                }

                renderView();

                form.modal('hide');
            })
    }

    /**
     * Register event Create and Update
     */
    function registerListenCreateAndUpdate() {
        /**
         * Create
         */
        $('#create')
            .off('click')
            .on('click', function () {
                statusForm = CREATE;

                refactorForm();
            })

        /**
         * Update
         */
        $('.update')
            .off('click')
            .on('click', function () {
                const li = $(this).closest('li');
                const id = li.data('id');

                statusForm = UPDATE;

                const item = getItem(id)

                refactorForm(item);
            })
    }

    /**
     * Register event Delete
     */
    function registerDelete() {
        $('.delete')
            .off('click')
            .on('click', function () {
                const li = $(this).closest('li');
                const id = li.data('id');
                removeItem(id);
                li.remove();
            })
    }

    /**
     * Init DB
     */
    function createDB() {
        db = new localStorageDB('db', localStorage);
    }

    this.init = function (_items) {
        createDB();

        this.setItems(_items);

        renderView();
    }

    this.setItems = function (_items) {
        if (db.isNew()) {
            if (_items) {
                db.createTableWithData(TABLE, _items);
            } else {
                db.createTable(TABLE, ['name']);
            }

            db.commit();
        }
    }
}

$(function () {
    var todo = new Todo();
    var items = [{name: 'Ngủ dậy'}, {name: 'Tập thể dục'}, {name: 'Ăn sáng'}, {name: 'Đi làm'}];
    todo.init();
})
