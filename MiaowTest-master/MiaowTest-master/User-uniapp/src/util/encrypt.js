/**
 * 密码加密工具（使用MD5加盐哈希）
 */
import md5 from 'md5'; // 需要安装：npm install md5

// 盐值（实际项目中建议从后端获取动态盐值）
const SALT = 'your_static_salt_value'; // 生产环境需更换为随机盐

/**
 * 密码加密
 * @param {string} password 明文密码
 * @returns {string} 加密后的密码
 */
export function encryptPassword(password) {
    if (!password) return '';
    // 加盐哈希（盐值+密码+盐值 双重加密）
    return md5(`${SALT}${password}${SALT}`);
}