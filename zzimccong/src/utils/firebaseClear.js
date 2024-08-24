export function clearFirebaseIndexedDB() {
    // Delete Firebase-related IndexedDB databases
    const dbsToDelete = [
        'firebase-heartbeat-database', 
        'firebase-installations-database',
        'firebase-messaging-database', 
    ];

    dbsToDelete.forEach((dbName) => {
        const request = indexedDB.deleteDatabase(dbName);
        request.onsuccess = function() {
            console.log(`Deleted IndexedDB: ${dbName}`);
        };
        request.onerror = function() {
            console.log(`Failed to delete IndexedDB: ${dbName}`);
        };
        request.onblocked = function() {
            console.log(`Deletion blocked for IndexedDB: ${dbName}`);
        };
    });
}