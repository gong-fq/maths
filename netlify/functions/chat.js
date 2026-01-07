const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const { currentComp, text } = JSON.parse(event.body);

    try {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}` 
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: `你是一位专业的数学教练。当前训练目标：${currentComp}。请基于2022新课标标准，多使用 LaTeX 公式解答。` },
                    { role: "user", content: text }
                ]
            })
        });

        const data = await response.json();
        return { statusCode: 200, body: JSON.stringify(data) };
    } catch (e) {
        return { statusCode: 500, body: e.toString() };
    }
};