import axios from "../../../Utils/Helpers/AxiosInstance"; 

export const login = async ( email, password ) => {
    try {
        // Menggunakan endpoint /users sesuai dengan db.json JSON Server
        const res = await axios.get("/users", { params: { email } });
        const user = res.data[0]; // JSON Server mengembalikan array, ambil elemen pertama

        if (!user) {
            throw new Error("Email tidak ditemukan");
        }
        if (user.password !== password) {
            throw new Error("Password salah");
        }

        // Jika berhasil, kembalikan objek user
        return user;
    } catch (error) {
        // Tangani error jaringan atau server
        console.error("API login error:", error);
        // Melempar error agar bisa ditangkap oleh komponen pemanggil
        throw error; 
    }
};