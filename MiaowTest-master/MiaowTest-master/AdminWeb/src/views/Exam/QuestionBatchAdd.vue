<template>
  <div class="batch-add-container">
    <el-card>
      <div slot="header">
        <span>批量添加题目</span>
      </div>
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="所属考试" prop="examId">
          <el-select v-model="form.examId" placeholder="请选择考试">
            <el-option v-for="exam in exams" :key="exam.id" :label="exam.name" :value="exam.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目分类" prop="category">
          <el-input v-model="form.category" placeholder="请输入题目分类"></el-input>
        </el-form-item>
        <el-form-item label="题目内容" prop="message">
          <el-textarea v-model="form.message" rows="6" placeholder="请输入批量题目内容（每行一道题）"></el-textarea>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleBatchAdd">批量添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { modelappBatchaddQuestion } from '@/API/LLM/modelappAPI';
import { ElMessage } from 'element-plus';

// 表单数据
const form = reactive({
  examId: '',
  category: '',
  message: ''
});

// 考试列表（实际项目中从API获取）
const exams = ref([
  { id: 1, name: '期末测试' },
  { id: 2, name: '模拟考试' }
]);

// 表单引用
const formRef = ref();

// 批量添加处理
const handleBatchAdd = async () => {
  // 表单验证
  if (!form.examId) {
    ElMessage.warning('请选择所属考试');
    return;
  }
  if (!form.message.trim()) {
    ElMessage.warning('请输入题目内容');
    return;
  }

  try {
    // 调用API
    const res = await modelappBatchaddQuestion(form.message, form.examId, form.category);
    if (res?.code === 200 || res?.ActionType === 'OK') {
      ElMessage.success('批量添加成功');
      // 清空表单
      form.message = '';
    } else {
      ElMessage.error(res?.message || '添加失败');
    }
  } catch (error) {
    console.error('批量添加错误:', error);
    ElMessage.error('网络错误，请重试');
  }
};
</script>

<style scoped>
.batch-add-container {
  padding: 20px;
}
</style>
