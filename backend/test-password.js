// test-password.js
const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function testPassword() {
  try {
    const email = 'cakardi73@gmail.com';
    const testPassword = 'Test1234@'; // Ganti dengan password yang Anda pakai
    
    console.log('=== Testing Password ===');
    console.log('Email:', email);
    console.log('Test Password:', testPassword);
    console.log('');
    
    // 1. Cari user
    const user = await User.findOne({
      where: { email },
      include: [{ 
        model: require('./models').Role, 
        as: 'role',
        attributes: ['id', 'name']
      }]
    });
    
    if (!user) {
      console.log('❌ User tidak ditemukan di database!');
      console.log('Silakan register dulu.');
      return;
    }
    
    console.log('✅ User ditemukan:');
    console.log('- ID:', user.id);
    console.log('- Name:', user.name);
    console.log('- Email:', user.email);
    console.log('- Role:', user.role?.name);
    console.log('- Email Verified:', user.emailVerified ? 'YES' : 'NO');
    console.log('- Is Verified:', user.isVerified);
    console.log('- Password Hash:', user.password.substring(0, 30) + '...');
    console.log('');
    
    // 2. Cek format hash
    if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
      console.log('❌ WARNING: Password tidak ter-hash dengan benar!');
      console.log('Password harus dimulai dengan $2a$ atau $2b$');
      return;
    }
    
    console.log('✅ Password format OK (bcrypt hash detected)');
    console.log('');
    
    // 3. Test bcrypt.compare langsung
    console.log('Testing bcrypt.compare...');
    const directMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Result:', directMatch ? '✅ MATCH' : '❌ NOT MATCH');
    console.log('');
    
    // 4. Test User.verifyPassword method
    console.log('Testing User.verifyPassword...');
    const methodMatch = await User.verifyPassword(testPassword, user.password);
    console.log('Result:', methodMatch ? '✅ MATCH' : '❌ NOT MATCH');
    console.log('');
    
    // 5. Test dengan password salah
    console.log('Testing with wrong password...');
    const wrongMatch = await User.verifyPassword('WrongPass123@', user.password);
    console.log('Result:', wrongMatch ? '❌ SHOULD BE FALSE' : '✅ Correctly rejected');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  }
  
  process.exit();
}

testPassword();