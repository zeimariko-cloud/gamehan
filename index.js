// Menggunakan KV / Memory internal sederhana khusus Vercel Serverless
// File ini bertugas menampung data dari Saweria dan mengirimkannya ke Roblox
let globalQueue = []; 

export default async function handler(req, res) {
    // Izinkan akses dari server mana saja (Roblox)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');

    // 1. JALUR MASUK: Jika Saweria mengirimkan POST Webhook
    if (req.method === 'POST') {
        try {
            const data = req.body;
            if (data && data.created_at && data.amount_raw) {
                const parsedDonation = {
                    donator_name: data.donator_name ? data.donator_name.trim() : "Anonim",
                    amount: parseInt(data.amount_raw) || 0,
                    message: data.message ? data.message.trim() : "Terima kasih!"
                };

                // Ambil data lama dari temporary cache atau langsung push
                globalQueue.push(parsedDonation);
                
                console.log(`📥 Webhook Saweria Masuk: ${parsedDonation.donator_name}`);
                return res.status(200).send('OK');
            }
            return res.status(400).send('Format Salah');
        } catch (e) {
            return res.status(500).send('Error');
        }
    }

    // 2. JALUR KELUAR: Jika Roblox mengambil data lewat GET
    if (req.method === 'GET') {
        const sendData = [...globalQueue];
        globalQueue = []; // Kosongkan antrean setelah diambil Roblox
        return res.json(sendData);
    }

    return res.status(405).send('Method Not Allowed');
}