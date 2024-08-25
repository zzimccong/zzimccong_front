export const clearFirebaseIndexedDB = () => {
    if (!window.indexedDB) {
        console.log("IndexedDB가 이 브라우저에서 지원되지 않습니다.");
        return;
    }

    const databases = ["firebase-messaging-database", "firebase-messaging-database-key"];
    databases.forEach(dbName => {
        const request = indexedDB.deleteDatabase(dbName);
        request.onsuccess = () => console.log(`${dbName} IndexedDB 데이터베이스가 삭제되었습니다.`);
        request.onerror = (event) => console.log(`${dbName} IndexedDB 데이터베이스 삭제 중 오류 발생:`, event);
    });
};
