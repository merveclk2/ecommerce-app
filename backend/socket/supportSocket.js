let waitingQueue = [];
let activeChat = null;

module.exports = (io) => {

    io.on("connection", (socket) => {

        // 🔥 AUTH BİLGİSİNİ AL
        const { userId, username, role } = socket.handshake.auth || {};

        // Eğer auth yoksa bağlantıyı iptal edebiliriz (opsiyonel)
        if (!userId || !role) {
            console.log("❌ AUTH YOK:", socket.handshake.auth);
            return;
        }

        socket.user = { userId, username, role };

        console.log("✅ CONNECTED:", socket.user);


        socket.on("join_support", () => {

            if (socket.user.role !== "user") return;

            console.log("📩 USER JOIN SUPPORT:", socket.user);

            // Aynı kullanıcı tekrar eklenmesin
            const alreadyInQueue = waitingQueue.find(
                u => u.userId === socket.user.userId
            );

            if (!alreadyInQueue) {
                waitingQueue.push({
                    userId: socket.user.userId,
                    username: socket.user.username,
                    socketId: socket.id
                });
            }

            console.log("📋 QUEUE:", waitingQueue);

            io.to("admin_room").emit("update_waiting_list", waitingQueue);
        });


        socket.on("admin_join", () => {

            if (socket.user.role !== "admin") return;

            console.log("🛠 ADMIN JOINED ROOM");

            socket.join("admin_room");

            socket.emit("update_waiting_list", waitingQueue);
        });

        socket.on("admin_pick_user", (userId) => {

            console.log("ADMİN USER SEÇTİ:", userId);

            if (activeChat) return;

            const selectedUser = waitingQueue.find(u => u.userId === userId);
            if (!selectedUser) return;

            activeChat = {
                userId,
                userSocketId: selectedUser.socketId,
                adminSocketId: socket.id
            };

            waitingQueue = waitingQueue.filter(u => u.userId !== userId);
            io.to("admin_room").emit("update_waiting_list", waitingQueue);

            socket.emit("chat_started", userId);

            io.to(selectedUser.socketId).emit("chat_started");
        });


        socket.on("send_message", (data) => {

            if (!activeChat) return;

            if (socket.id === activeChat.adminSocketId) {

                // USER'A GÖNDER
                io.to(activeChat.userSocketId).emit("receive_message", data);

                // ADMIN'E GÖNDER
                socket.emit("receive_message", data);

            } else {

                // ADMIN'E GÖNDER
                io.to(activeChat.adminSocketId).emit("receive_message", data);

                // USER'A GÖNDER
                socket.emit("receive_message", data);

            }

        });


        socket.on("close_chat", () => {

            if (!activeChat) return;

            io.to(activeChat.userSocketId).emit("chat_closed");
            io.to(activeChat.adminSocketId).emit("chat_closed");

            activeChat = null;

            console.log("🔚 CHAT CLOSED");
        });


        socket.on("disconnect", () => {

            console.log("❌ DISCONNECTED:", socket.user);

            waitingQueue = waitingQueue.filter(u => u.socketId !== socket.id);

            if (activeChat && activeChat.userSocketId === socket.id) {
                activeChat = null;
            }

            io.to("admin_room").emit("update_waiting_list", waitingQueue);
        });

    });

};