var _default_version = 5;
var _default_database_name = "MyDatabase";
var _default_store_name = "MyStore";
var _default_key_path = "entityUrl";

var setUp = false;
var db;

export function openDatabase() {
    return new Promise((resolve, reject) => {
        if (setUp) {
            resolve(db);
        }

        var openRequest = window.indexedDB.open(_default_database_name, _default_version);

        openRequest.onerror = function (e) {
            reject("An error occurred while opening the offline database!");
        };

        openRequest.onupgradeneeded = function (e) {
            //TODO: Plan database upgrade or refresh, whichever is appropriate
            db = e.target.result;
            createObjectStore(_default_store_name, _default_key_path);
            resolve(db);
        };

        openRequest.onsuccess = function (e) {
            db = e.target.result;

            db.onerror = function (event) {
                reject("Database error: " + event.target.error);
            };

            setUp = true;
            resolve(db);
        };
    });
}

function createObjectStore(objectStoreName, keyPath) {
    if (objectStoreName === undefined)
        objectStoreName = _default_store_name;

    if (keyPath === undefined)
        keyPath = _default_key_path;

    if (!db.objectStoreNames.contains(objectStoreName)) {
        db.createObjectStore(objectStoreName, { keyPath: keyPath, autoIncrement: false });
    }
}

export function get(key, objectStoreName) {
    return new Promise((resolve, reject) => {
        if (objectStoreName === undefined)
            objectStoreName = _default_store_name;

        try {
            var transaction = db.transaction(objectStoreName);
            var objectStore = transaction.objectStore(objectStoreName);
            var request = objectStore.get(key);

            request.onsuccess = function (event) {
                var result = request.result;
                resolve(result);
            };

            request.onerror = function (event) {
                resolve(null);
            };
        } catch (e) {
            resolve(undefined);
        }
    });
}

export function getAll(objectStoreName) {
    return new Promise((resolve, reject) => {
        if (objectStoreName === undefined)
            objectStoreName = _default_store_name;

        try {
            var transaction = db.transaction(objectStoreName);
            var objectStore = transaction.objectStore(objectStoreName);

            if ('getAll' in objectStore) {
                objectStore.getAll().onsuccess = function (event) {
                    resolve(event.target.result);
                };
            } else {
                // Fallback to the traditional cursor approach if getAll isn't supported.
                var responce = [];
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        responce.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(responce);
                    }
                };
            }
        } catch (e) {
            resolve(undefined);
        }
    });
}

export function add(objectData, objectStoreName) {
    return new Promise((resolve, reject) => {
        if (objectStoreName === undefined)
            objectStoreName = _default_store_name;

        var transaction = db.transaction(objectStoreName, "readwrite");
        var objectStore = transaction.objectStore(objectStoreName);

        // put() - It will update an object if the key already exists, and it will add a new object otherwise
        // Resolves - Database error: Constraint Error: Key already exists in the object store.
        var request = objectStore.put(objectData);

        transaction.oncomplete = function (event) {
            resolve();
        };

        transaction.onerror = function (event) {
            reject(new Error('An error occurred while queueing an offline request!'));
        };
    });
}

export function update(objectData, objectStoreName) {
    return new Promise((resolve, reject) => {
        var transactionSucess = false;

        if (objectStoreName === undefined)
            objectStoreName = _default_store_name;

        var transaction = db.transaction(objectStoreName, "readwrite");
        var objectStore = transaction.objectStore(objectStoreName);
        objectStore.put(objectData);

        transaction.oncomplete = function (event) {
            resolve();
        };

        transaction.onerror = function (event) {
            reject(new Error('An error occurred while updating a previously queued offline request!'));
        };
    });
};

export function remove(key, objectStoreName) {
    return new Promise((resolve, reject) => {
        if (objectStoreName === undefined)
            objectStoreName = _default_store_name;

        var transaction = db.transaction(objectStoreName, "readwrite");
        var request = transaction.objectStore(objectStoreName).delete(key);

        transaction.oncomplete = function (event) {
            resolve(true);
        };

        transaction.onerror = function (event) {
            resolve(false);
        };
    });
}

export function clear(objectStoreName) {
    return new Promise((resolve, reject) => {
        if (objectStoreName === undefined)
            objectStoreName = _default_store_name;

        var transaction = db.transaction(objectStoreName, "readwrite");
        var request = transaction.objectStore(objectStoreName).clear();

        transaction.oncomplete = function (event) {
            resolve(true);
        };

        transaction.onerror = function (event) {
            resolve(false);
        };
    });
}

export function ready() {
    return setUp;
}

export function isSupported() {
    return ("indexedDB" in window);
}

export default {
    openDatabase,
    get,
    getAll,
    add,
    update,
    remove,
    clear
}