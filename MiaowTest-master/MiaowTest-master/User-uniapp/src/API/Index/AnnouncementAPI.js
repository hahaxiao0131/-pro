import { http } from '../../util/http.js';
/**
 * 获取公告详情
 * @returns {Promise} 返回公告详情数据
 */
export async function getNoticeInfo() {
    try{
        return await http({
            url: '/uniappAPI/Notice/getNoticeInfo',
            method: 'GET',
        });
    }catch(error){
        console.error("getNoticeInfo 失败", error);
        throw error;
    }
}


// src API/Index/AnnouncementAPI.js
export async function getIndexBanner(){
    try{
        const res = await http({
            url: '/uniappAPI/Banner/getIndexBanner',
            method: 'GET',
        })
        console.log('轮播图接口返回:', res) // 新增日志查看返回结果
        return res
    }catch(error){
        console.error("getBanner 失败", error);
        throw error;
    }
}
