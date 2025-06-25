const fs = require('fs');
const path = require('path');

const userPath = path.join(__dirname, 'db', 'user.json');

const users = JSON.parse(fs.readFileSync(userPath, 'utf-8'));

function updateUserPermission(userId, newRole, newPermissions) {
  const user = users.find(u => u.id === userId);
  if (!user) {
    console.log('❌ User tidak ditemukan.');
    return;
  }

  user.role = newRole;
  user.permission = newPermissions;

  fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
  console.log(`✅ Berhasil update role dan permission untuk user ID ${userId}`);
}

// 🔧 Contoh penggunaan:
updateUserPermission(2, 'dosen', ['matakuliah.page', 'matakuliah.read']);
